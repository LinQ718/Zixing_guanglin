import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, validateSessionToken } from "@/lib/admin/auth/session";
import { hasR2Config, r2Bucket, r2Client, r2PublicBaseUrl } from "@/lib/r2/server";

export const runtime = "nodejs";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const maxBytes = 5 * 1024 * 1024;

function extFromType(contentType: string) {
  if (contentType === "image/jpeg") return "jpg";
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  if (contentType === "image/gif") return "gif";
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

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const valid = await validateSessionToken(token);

    if (!valid) {
      return NextResponse.json({ ok: false, message: "未登入或登入已過期" }, { status: 401 });
    }

    if (!hasR2Config()) {
      return NextResponse.json(
        {
          ok: true,
          mode: "local",
          uploadEndpoint: "/api/admin/upload/local",
          message: "R2 尚未設定，已切換為本地上傳模式",
        },
        { status: 200 }
      );
    }

    const body = await request.json();
    const contentType = String(body?.contentType || "");
    const contentLength = Number(body?.contentLength || 0);
    const folder = sanitizeFolder(String(body?.folder || "admin"));

    if (!allowedMimeTypes.has(contentType)) {
      return NextResponse.json({ ok: false, message: "不支援的圖片格式" }, { status: 400 });
    }

    if (!Number.isFinite(contentLength) || contentLength <= 0 || contentLength > maxBytes) {
      return NextResponse.json({ ok: false, message: "圖片大小需介於 1 byte 到 5MB" }, { status: 400 });
    }

    const key = makeObjectKey(folder, contentType);
    const command = new PutObjectCommand({
      Bucket: r2Bucket,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 120 });
    const publicUrl = r2PublicBaseUrl
      ? `${r2PublicBaseUrl.replace(/\/$/, "")}/${key}`
      : `${new URL(uploadUrl).origin}/${r2Bucket}/${key}`;

    return NextResponse.json({
      ok: true,
      mode: "r2",
      uploadUrl,
      objectKey: key,
      publicUrl,
      expiresIn: 120,
    });
  } catch {
    return NextResponse.json({ ok: false, message: "產生上傳授權失敗" }, { status: 500 });
  }
}
