import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, validateSessionToken } from "@/lib/admin/auth/session";
import { hasR2Config } from "@/lib/r2/server";

export const runtime = "nodejs";

function getMissingR2EnvKeys() {
  const required = [
    "R2_ACCOUNT_ID",
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
    "R2_BUCKET",
  ] as const;

  return required.filter((key) => !process.env[key] || !String(process.env[key]).trim());
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const valid = await validateSessionToken(token);

  if (!valid) {
    return NextResponse.json({ ok: false, message: "未登入或登入已過期" }, { status: 401 });
  }

  const configured = hasR2Config();
  const missingKeys = getMissingR2EnvKeys();

  return NextResponse.json({
    ok: true,
    configured,
    mode: configured ? "r2" : "local",
    missingKeys,
  });
}
