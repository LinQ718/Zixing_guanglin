export const dynamic = "force-dynamic";
import { promises as fs } from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, validateSessionToken } from "@/lib/admin/auth/session";

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

    const now = new Date();
    const yyyy = String(now.getFullYear());
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const rand = Math.random().toString(36).slice(2, 10);
    const ext = extFromType(file.type);
    const objectKey = `${folder}/${yyyy}/${mm}/${dd}/${Date.now()}-${rand}.${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads", folder, yyyy, mm, dd);
    await fs.mkdir(uploadDir, { recursive: true });

    const arrayBuffer = await file.arrayBuffer();
    const fullPath = path.join(process.cwd(), "public", "uploads", objectKey);
    await fs.writeFile(fullPath, Buffer.from(arrayBuffer));

    return NextResponse.json({
      ok: true,
      mode: "local",
      objectKey,
      publicUrl: `/uploads/${objectKey}`,
    });
  } catch {
    return NextResponse.json({ ok: false, message: "本地上傳失敗" }, { status: 500 });
  }
}
