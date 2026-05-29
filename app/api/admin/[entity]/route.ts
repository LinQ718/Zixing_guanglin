import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/authz";
import { isAdminEntity, listEntity, upsertEntity } from "@/lib/admin/repository";

export const runtime = "nodejs";

export async function GET(request: NextRequest, context: { params: Promise<{ entity: string }> }) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) {
      return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status });
    }

    const { entity } = await context.params;
    if (!isAdminEntity(entity)) {
      return NextResponse.json({ ok: false, message: "不支援的資料類型" }, { status: 404 });
    }

    const rows = await listEntity(entity);
    return NextResponse.json({ ok: true, rows });
  } catch (error) {
    const message = error instanceof Error ? error.message : "讀取資料失敗";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ entity: string }> }) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) {
      return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status });
    }

    const { entity } = await context.params;
    if (!isAdminEntity(entity)) {
      return NextResponse.json({ ok: false, message: "不支援的資料類型" }, { status: 404 });
    }

    const payload = await request.json();
    const row = await upsertEntity(entity, payload);
    return NextResponse.json({ ok: true, row });
  } catch (error) {
    const message = error instanceof Error ? error.message : "新增資料失敗";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
