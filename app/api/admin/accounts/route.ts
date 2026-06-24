export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/authz";
import { listAdminAccounts, upsertAdminAccount } from "@/lib/admin/accounts";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) {
      return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status });
    }

    const rows = await listAdminAccounts();
    return NextResponse.json({ ok: true, rows });
  } catch (error) {
    const message = error instanceof Error ? error.message : "讀取帳號列表失敗";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) {
      return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status });
    }

    const payload = await request.json();
    const row = await upsertAdminAccount({
      username: String(payload?.username || ""),
      displayName: String(payload?.displayName || ""),
      role: payload?.role === "super_admin" ? "super_admin" : "admin",
      status: payload?.status === "disabled" ? "disabled" : "active",
      password: payload?.password ? String(payload.password) : undefined,
    });

    return NextResponse.json({ ok: true, row });
  } catch (error) {
    const message = error instanceof Error ? error.message : "建立後台帳號失敗";
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}

