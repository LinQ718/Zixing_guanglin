export const ADMIN_SESSION_COOKIE = "zixing_admin_session";

const FALLBACK_USER = "admin";
const FALLBACK_PASS = "admin321";
const SECRET = process.env.ADMIN_SESSION_SECRET || "zixing-admin-secret-change-me";

const ADMIN_USER = process.env.ADMIN_USER || FALLBACK_USER;
const ADMIN_PASS = process.env.ADMIN_PASS || FALLBACK_PASS;

export function verifyAdminCredentials(username: string, password: string) {
  return username === ADMIN_USER && password === ADMIN_PASS;
}

async function sign(payload: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(username: string) {
  const issuedAt = Date.now().toString();
  const payload = `${username}.${issuedAt}`;
  const signature = await sign(payload);
  return `${payload}.${signature}`;
}

export async function validateSessionToken(token: string | undefined) {
  const parsed = await parseSessionToken(token);
  return parsed.valid;
}

export async function getSessionUsername(token: string | undefined) {
  const parsed = await parseSessionToken(token);
  return parsed.valid ? parsed.username : null;
}

async function parseSessionToken(token: string | undefined) {
  if (!token) return { valid: false, username: null as string | null };
  const [username, issuedAt, signature] = token.split(".");
  if (!username || !issuedAt || !signature) return { valid: false, username: null as string | null };
  const payload = `${username}.${issuedAt}`;
  const valid = await sign(payload);
  if (signature !== valid) return { valid: false, username: null as string | null };

  // 7 days TTL
  const ttl = 7 * 24 * 60 * 60 * 1000;
  const age = Date.now() - Number(issuedAt);
  if (Number.isNaN(age) || age < 0 || age > ttl) return { valid: false, username: null as string | null };
  return { valid: true, username };
}
