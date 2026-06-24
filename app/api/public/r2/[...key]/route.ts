export async function generateStaticParams() {
  return [];
}

import { GetObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { hasR2Config, r2Bucket, r2Client } from "@/lib/r2/server";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = false;

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ key: string[] }> }
) {
  try {
    if (!hasR2Config()) {
      return NextResponse.json({ ok: false, message: "R2 尚未設定完成" }, { status: 404 });
    }

    const { key } = await context.params;
    const objectKey = (key || []).join("/");

    if (!objectKey) {
      return NextResponse.json({ ok: false, message: "無效的圖片路徑" }, { status: 400 });
    }

    const res = await r2Client.send(
      new GetObjectCommand({
        Bucket: r2Bucket,
        Key: objectKey,
      })
    );

    const contentType = res.ContentType || "application/octet-stream";
    const bytes = await res.Body?.transformToByteArray();

    if (!bytes) {
      return NextResponse.json({ ok: false, message: "找不到圖片內容" }, { status: 404 });
    }

    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ ok: false, message: "讀取圖片失敗" }, { status: 404 });
  }
}

