import { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, getSessionUsername, validateSessionToken } from "@/lib/admin/auth/session";
import { getAdminDb, hasFirebaseAdminConfig } from "@/lib/firebase/admin";
import { listAdminAccounts } from "@/lib/admin/accounts";

export async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const valid = await validateSessionToken(token);
  if (!valid) {
    return { ok: false as const, message: "未登入或登入已過期", status: 401 };
  }

  const username = token ? await getSessionUsername(token) : null;
  if (!username) {
    return { ok: false as const, message: "登入狀態無效", status: 401 };
  }

  const bootstrapAdmin = process.env.ADMIN_USER || "admin";
  if (username === bootstrapAdmin) {
    return { ok: true as const, username };
  }

  const managedAccounts = await listAdminAccounts().catch(() => []);
  const account = managedAccounts.find((x) => x.username === username);
  if (account && account.status === "active") {
    return { ok: true as const, username };
  }

  if (!hasFirebaseAdminConfig()) {
    return { ok: false as const, message: "尚未設定 Firebase 管理員環境變數", status: 503 };
  }

  const db = getAdminDb();
  const memberDoc = await db.collection("members").doc(username).get();
  if (!memberDoc.exists) {
    return { ok: false as const, message: "找不到管理者帳號", status: 403 };
  }

  const member = memberDoc.data() as { role?: string };
  if (member.role !== "admin") {
    return { ok: false as const, message: "無後台權限", status: 403 };
  }

  return { ok: true as const, username };
}
