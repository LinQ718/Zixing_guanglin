export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createSessionToken,
  verifyAdminCredentials,
} from "@/lib/admin/auth/session";
import { touchAdminLastLogin, verifyAdminAccountPassword } from "@/lib/admin/accounts";
import { getAdminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const username = String(body?.username || "").trim();
    const password = String(body?.password || "");

    const validByEnv = verifyAdminCredentials(username, password);
    const validByManagedAccount = validByEnv ? true : await verifyAdminAccountPassword(username, password);

    if (!validByManagedAccount) {
      return NextResponse.json({ ok: false, message: "帳號或密碼錯誤" }, { status: 401 });
    }

    const token = await createSessionToken(username);
    await touchAdminLastLogin(username).catch(() => undefined);
    try {
      const db = getAdminDb();
      const memberRef = db.collection("members").doc(username);
      const memberSnap = await memberRef.get();
      if (!memberSnap.exists) {
        const now = new Date().toISOString();
        await memberRef.set({
          id: username,
          name: username,
          email: `${username}@local.admin`,
          avatar: "",
          role: "admin",
          createdAt: now,
          updatedAt: now,
        });
      }
    } catch {
      // Do not block login when firestore is temporarily unavailable.
    }

    const response = NextResponse.json({ ok: true });

    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json({ ok: false, message: "登入失敗" }, { status: 400 });
  }
}

