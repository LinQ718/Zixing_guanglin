import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/authz";
import { deleteEntity, isAdminEntity, upsertEntity } from "@/lib/admin/repository";

export const runtime = "nodejs";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ entity: string; id: string }> }
) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) {
      return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status });
    }

    const { entity, id } = await context.params;
    if (!isAdminEntity(entity)) {
      return NextResponse.json({ ok: false, message: "不支援的資料類型" }, { status: 404 });
    }

    const payload = await request.json();
    const row = await upsertEntity(entity, { ...payload, id });
    return NextResponse.json({ ok: true, row });
  } catch (error) {
    const message = error instanceof Error ? error.message : "更新資料失敗";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ entity: string; id: string }> }
) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) {
      return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status });
    }

    const { entity, id } = await context.params;
    if (!isAdminEntity(entity)) {
      return NextResponse.json({ ok: false, message: "不支援的資料類型" }, { status: 404 });
    }

    await deleteEntity(entity, id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "刪除資料失敗";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
