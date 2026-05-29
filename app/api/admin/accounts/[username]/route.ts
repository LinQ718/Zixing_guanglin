import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/authz";
import { deleteAdminAccount, upsertAdminAccount } from "@/lib/admin/accounts";

export const runtime = "nodejs";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) {
      return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status });
    }

    const { username } = await context.params;
    const payload = await request.json();

    const row = await upsertAdminAccount({
      username,
      displayName: String(payload?.displayName || username),
      role: payload?.role === "super_admin" ? "super_admin" : "admin",
      status: payload?.status === "disabled" ? "disabled" : "active",
      password: payload?.password ? String(payload.password) : undefined,
    });

    return NextResponse.json({ ok: true, row });
  } catch (error) {
    const message = error instanceof Error ? error.message : "更新後台帳號失敗";
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) {
      return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status });
    }

    const { username } = await context.params;
    const bootstrapAdmin = (process.env.ADMIN_USER || "admin").toLowerCase();

    if (username.toLowerCase() === bootstrapAdmin) {
      return NextResponse.json({ ok: false, message: "預設備援帳號不可刪除" }, { status: 400 });
    }

    await deleteAdminAccount(username);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "刪除後台帳號失敗";
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
