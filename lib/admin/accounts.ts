import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { getAdminDb, hasFirebaseAdminConfig } from "@/lib/firebase/admin";

export type AdminAccountRole = "admin" | "super_admin";
export type AdminAccountStatus = "active" | "disabled";

export type AdminAccount = {
  username: string;
  displayName: string;
  role: AdminAccountRole;
  status: AdminAccountStatus;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
};

export type PublicAdminAccount = Omit<AdminAccount, "passwordHash">;

const dbFilePath = path.join(process.cwd(), "data", "admin-accounts.json");

function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

function toPublicAccount(account: AdminAccount): PublicAdminAccount {
  return {
    username: account.username,
    displayName: account.displayName,
    role: account.role,
    status: account.status,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
    lastLoginAt: account.lastLoginAt,
  };
}

async function ensureLocalFile() {
  await fs.mkdir(path.dirname(dbFilePath), { recursive: true });
  try {
    await fs.access(dbFilePath);
  } catch {
    await fs.writeFile(dbFilePath, "[]", "utf8");
  }
}

async function readLocalAccounts() {
  await ensureLocalFile();
  const raw = await fs.readFile(dbFilePath, "utf8");
  const rows = JSON.parse(raw) as AdminAccount[];
  return rows;
}

async function writeLocalAccounts(rows: AdminAccount[]) {
  await fs.writeFile(dbFilePath, JSON.stringify(rows, null, 2), "utf8");
}

async function listAccountsFromFirestore() {
  const db = getAdminDb();
  const snapshot = await db
    .collection("admin_accounts")
    .orderBy("updatedAt", "desc")
    .get()
    .catch(async () => db.collection("admin_accounts").get());

  return snapshot.docs.map((doc) => {
    const data = doc.data() as AdminAccount;
    return {
      ...data,
      username: data.username || doc.id,
    };
  });
}

export async function listAdminAccounts() {
  const rows = hasFirebaseAdminConfig() ? await listAccountsFromFirestore().catch(readLocalAccounts) : await readLocalAccounts();
  return rows.map(toPublicAccount);
}

export async function upsertAdminAccount(input: {
  username: string;
  displayName: string;
  role: AdminAccountRole;
  status: AdminAccountStatus;
  password?: string;
}) {
  const username = String(input.username || "").trim().toLowerCase();
  if (!username) {
    throw new Error("請輸入帳號");
  }

  const now = new Date().toISOString();

  if (hasFirebaseAdminConfig()) {
    const db = getAdminDb();
    const ref = db.collection("admin_accounts").doc(username);
    const existing = await ref.get();
    const previous = existing.exists ? (existing.data() as AdminAccount) : null;

    const next: AdminAccount = {
      username,
      displayName: input.displayName || username,
      role: input.role || "admin",
      status: input.status || "active",
      passwordHash: input.password ? hashPassword(input.password) : previous?.passwordHash || "",
      createdAt: previous?.createdAt || now,
      updatedAt: now,
      lastLoginAt: previous?.lastLoginAt,
    };

    if (!next.passwordHash) {
      throw new Error("請設定初始密碼");
    }

    await ref.set(next, { merge: true });
    return toPublicAccount(next);
  }

  const rows = await readLocalAccounts();
  const index = rows.findIndex((x) => x.username === username);
  const existing = index >= 0 ? rows[index] : null;

  const next: AdminAccount = {
    username,
    displayName: input.displayName || username,
    role: input.role || "admin",
    status: input.status || "active",
    passwordHash: input.password ? hashPassword(input.password) : existing?.passwordHash || "",
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    lastLoginAt: existing?.lastLoginAt,
  };

  if (!next.passwordHash) {
    throw new Error("請設定初始密碼");
  }

  if (index >= 0) {
    rows[index] = next;
  } else {
    rows.unshift(next);
  }

  await writeLocalAccounts(rows);
  return toPublicAccount(next);
}

export async function deleteAdminAccount(username: string) {
  const normalized = String(username || "").trim().toLowerCase();
  if (!normalized) {
    throw new Error("缺少帳號");
  }

  if (hasFirebaseAdminConfig()) {
    const db = getAdminDb();
    await db.collection("admin_accounts").doc(normalized).delete().catch(async () => {
      const rows = await readLocalAccounts();
      await writeLocalAccounts(rows.filter((x) => x.username !== normalized));
    });
    return;
  }

  const rows = await readLocalAccounts();
  await writeLocalAccounts(rows.filter((x) => x.username !== normalized));
}

export async function verifyAdminAccountPassword(username: string, password: string) {
  const normalized = String(username || "").trim().toLowerCase();
  if (!normalized || !password) {
    return false;
  }

  const rows = hasFirebaseAdminConfig() ? await listAccountsFromFirestore().catch(readLocalAccounts) : await readLocalAccounts();
  const account = rows.find((x) => x.username === normalized);

  if (!account) return false;
  if (account.status !== "active") return false;

  return account.passwordHash === hashPassword(password);
}

export async function touchAdminLastLogin(username: string) {
  const normalized = String(username || "").trim().toLowerCase();
  if (!normalized) return;

  const now = new Date().toISOString();

  if (hasFirebaseAdminConfig()) {
    const db = getAdminDb();
    await db
      .collection("admin_accounts")
      .doc(normalized)
      .set({ lastLoginAt: now, updatedAt: now }, { merge: true })
      .catch(async () => {
        const rows = await readLocalAccounts();
        const idx = rows.findIndex((x) => x.username === normalized);
        if (idx >= 0) {
          rows[idx] = { ...rows[idx], lastLoginAt: now, updatedAt: now };
          await writeLocalAccounts(rows);
        }
      });
    return;
  }

  const rows = await readLocalAccounts();
  const idx = rows.findIndex((x) => x.username === normalized);
  if (idx >= 0) {
    rows[idx] = { ...rows[idx], lastLoginAt: now, updatedAt: now };
    await writeLocalAccounts(rows);
  }
}
