import { NextRequest, NextResponse } from "next/server";
import { isAdminEntity, listPublicEntity } from "@/lib/admin/repository";

const allowList = new Set(["products", "courses", "notices", "lamp_sea"]);

export const runtime = "nodejs";

export async function GET(_request: NextRequest, context: { params: Promise<{ entity: string }> }) {
  try {
    const { entity } = await context.params;
    if (!isAdminEntity(entity) || !allowList.has(entity)) {
      return NextResponse.json({ ok: false, message: "不支援的公開資料類型" }, { status: 404 });
    }

    const rows = await listPublicEntity(entity);
    return NextResponse.json({ ok: true, rows });
  } catch (error) {
    const message = error instanceof Error ? error.message : "讀取公開資料失敗";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
