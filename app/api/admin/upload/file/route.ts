import { PutObjectCommand } from "@aws-sdk/client-s3";
import { promises as fs } from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, validateSessionToken } from "@/lib/admin/auth/session";
import { hasR2Config, r2Bucket, r2Client, r2PublicBaseUrl } from "@/lib/r2/server";

export const runtime = "nodejs";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);
const maxBytes = 5 * 1024 * 1024;

function extFromType(contentType: string) {
  if (contentType === "image/jpeg") return "jpg";
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  if (contentType === "image/gif") return "gif";
  if (contentType === "image/svg+xml") return "svg";
  return "bin";
}

function sanitizeFolder(input: string) {
  const safe = (input || "admin").trim().toLowerCase().replace(/[^a-z0-9/_-]/g, "");
  return safe || "admin";
}

function makeObjectKey(folder: string, contentType: string) {
  const now = new Date();
  const yyyy = String(now.getFullYear());
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 10);
  const ext = extFromType(contentType);
  return `${folder}/${yyyy}/${mm}/${dd}/${Date.now()}-${rand}.${ext}`;
}

function getR2ReadUrl(objectKey: string) {
  if (r2PublicBaseUrl) {
    return `${r2PublicBaseUrl.replace(/\/$/, "")}/${objectKey}`;
  }
  return `/api/public/r2/${objectKey}`;
}

async function saveToLocal(file: File, folder: string) {
  const objectKey = makeObjectKey(folder, file.type);
  const uploadDir = path.join(process.cwd(), "public", "uploads", path.dirname(objectKey));
  await fs.mkdir(uploadDir, { recursive: true });

  const fullPath = path.join(process.cwd(), "public", "uploads", objectKey);
  const arrayBuffer = await file.arrayBuffer();
  await fs.writeFile(fullPath, Buffer.from(arrayBuffer));

  return {
    ok: true,
    mode: "local" as const,
    objectKey,
    publicUrl: `/uploads/${objectKey}`,
  };
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const valid = await validateSessionToken(token);

    if (!valid) {
      return NextResponse.json({ ok: false, message: "未登入或登入已過期" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = sanitizeFolder(String(formData.get("folder") || "admin"));

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, message: "未收到上傳檔案" }, { status: 400 });
    }

    if (!allowedMimeTypes.has(file.type)) {
      return NextResponse.json({ ok: false, message: "不支援的圖片格式" }, { status: 400 });
    }

    if (file.size <= 0 || file.size > maxBytes) {
      return NextResponse.json({ ok: false, message: "圖片大小需介於 1 byte 到 5MB" }, { status: 400 });
    }

    if (!hasR2Config()) {
      const local = await saveToLocal(file, folder);
      return NextResponse.json(local);
    }

    const objectKey = makeObjectKey(folder, file.type);
    const body = Buffer.from(await file.arrayBuffer());

    await r2Client.send(
      new PutObjectCommand({
        Bucket: r2Bucket,
        Key: objectKey,
        ContentType: file.type,
        Body: body,
      })
    );

    return NextResponse.json({
      ok: true,
      mode: "r2",
      objectKey,
      publicUrl: getR2ReadUrl(objectKey),
    });
  } catch {
    return NextResponse.json({ ok: false, message: "上傳失敗，請稍後再試" }, { status: 500 });
  }
}
