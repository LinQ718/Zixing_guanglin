import { promises as fs } from "node:fs";
import path from "node:path";
import {
  courseSeed,
  lanternSeaSeed,
  memberSeed,
  noticeSeed,
  practiceLogSeed,
  productSeed,
} from "@/lib/admin/mock-data";
import type { AdminEntity, EntityMap } from "@/lib/admin/repository";

type AdminDbShape = {
  products: EntityMap["products"][];
  courses: EntityMap["courses"][];
  notices: EntityMap["notices"][];
  lamp_sea: EntityMap["lamp_sea"][];
  members: EntityMap["members"][];
  practice_logs: EntityMap["practice_logs"][];
};

type TimedRecord = {
  id: string;
  createdAt?: string;
  updatedAt?: string;
};

type StatusRecord = {
  status?: string;
};

const dbFilePath = path.join(process.cwd(), "data", "admin-db.json");

const initialDb: AdminDbShape = {
  products: productSeed,
  courses: courseSeed,
  notices: noticeSeed,
  lamp_sea: lanternSeaSeed,
  members: memberSeed,
  practice_logs: practiceLogSeed,
};

async function ensureDbFile() {
  await fs.mkdir(path.dirname(dbFilePath), { recursive: true });
  try {
    await fs.access(dbFilePath);
  } catch {
    await fs.writeFile(dbFilePath, JSON.stringify(initialDb, null, 2), "utf8");
  }
}

async function readDb() {
  await ensureDbFile();
  const raw = await fs.readFile(dbFilePath, "utf8");
  return JSON.parse(raw) as AdminDbShape;
}

async function writeDb(db: AdminDbShape) {
  await fs.writeFile(dbFilePath, JSON.stringify(db, null, 2), "utf8");
}

export async function listEntityLocal<T extends AdminEntity>(entity: T) {
  const db = await readDb();
  const rows = db[entity] as EntityMap[T][];
  return [...rows].sort((a, b) => {
    const aTimed = a as EntityMap[T] & TimedRecord;
    const bTimed = b as EntityMap[T] & TimedRecord;
    return String(bTimed.updatedAt || bTimed.createdAt || "").localeCompare(
      String(aTimed.updatedAt || aTimed.createdAt || "")
    );
  });
}

export async function upsertEntityLocal<T extends AdminEntity>(
  entity: T,
  input: Partial<EntityMap[T]> & { id?: string }
) {
  const db = await readDb();
  const rows = db[entity] as EntityMap[T][];
  const now = new Date().toISOString();

  const id = input.id || `${entity}-${Math.random().toString(36).slice(2, 10)}`;
  const index = rows.findIndex((x) => (x as EntityMap[T] & TimedRecord).id === id);

  if (index >= 0) {
    rows[index] = {
      ...rows[index],
      ...input,
      id,
      updatedAt: now,
      createdAt: (rows[index] as EntityMap[T] & TimedRecord).createdAt || now,
    } as EntityMap[T];
  } else {
    rows.unshift({
      ...input,
      id,
      createdAt: (input as Partial<EntityMap[T]> & { createdAt?: string }).createdAt || now,
      updatedAt: now,
    } as EntityMap[T]);
  }

  db[entity] = rows as AdminDbShape[T];
  await writeDb(db);
  return rows.find((x) => (x as EntityMap[T] & TimedRecord).id === id) as EntityMap[T];
}

export async function deleteEntityLocal(entity: AdminEntity, id: string) {
  const db = await readDb();
  const rows = db[entity] as Array<TimedRecord>;
  db[entity] = rows.filter((x) => x.id !== id) as AdminDbShape[typeof entity];
  await writeDb(db);
}

export async function listPublicEntityLocal(entity: AdminEntity) {
  const rows = await listEntityLocal(entity);
  const statusRows = rows as Array<StatusRecord>;

  if (entity === "products") {
    return rows.filter((_, index) => statusRows[index]?.status === "active");
  }
  if (entity === "courses") {
    return rows.filter((_, index) => statusRows[index]?.status === "active");
  }
  if (entity === "notices") {
    return rows.filter((_, index) => statusRows[index]?.status === "published");
  }
  if (entity === "lamp_sea") {
    return rows.filter((_, index) => statusRows[index]?.status === "active");
  }

  return rows;
}
