import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb, hasFirebaseAdminConfig } from "@/lib/firebase/admin";
import {
  deleteEntityLocal,
  listEntityLocal,
  listPublicEntityLocal,
  upsertEntityLocal,
} from "@/lib/admin/local-db";
import type {
  Course,
  LanternSeaItem,
  Member,
  Notice,
  PracticeLog,
  Product,
} from "@/lib/admin/types";

export type AdminEntity =
  | "products"
  | "courses"
  | "notices"
  | "lamp_sea"
  | "members"
  | "practice_logs";

export type EntityMap = {
  products: Product;
  courses: Course;
  notices: Notice;
  lamp_sea: LanternSeaItem;
  members: Member;
  practice_logs: PracticeLog;
};

export const allEntities: AdminEntity[] = [
  "products",
  "courses",
  "notices",
  "lamp_sea",
  "members",
  "practice_logs",
];

export function isAdminEntity(value: string): value is AdminEntity {
  return allEntities.includes(value as AdminEntity);
}

export async function listEntity<T extends AdminEntity>(entity: T) {
  if (!hasFirebaseAdminConfig()) {
    return listEntityLocal(entity);
  }

  const db = getAdminDb();
  const snapshot = await db
    .collection(entity)
    .orderBy("updatedAt", "desc")
    .get()
    .catch(async () => db.collection(entity).get())
    .catch(async () => null);

  if (!snapshot) {
    return listEntityLocal(entity);
  }

  return snapshot.docs.map((doc) => {
    const data = doc.data() as EntityMap[T];
    return { ...data, id: doc.id };
  });
}

export async function upsertEntity<T extends AdminEntity>(
  entity: T,
  input: Partial<EntityMap[T]> & { id?: string }
) {
  if (!hasFirebaseAdminConfig()) {
    return upsertEntityLocal(entity, input);
  }

  const db = getAdminDb();
  const now = new Date().toISOString();

  try {
    if (input.id) {
      const id = input.id;
      const ref = db.collection(entity).doc(id);
      const existing = await ref.get();
      await ref.set(
        {
          ...(existing.exists ? existing.data() : {}),
          ...input,
          id,
          updatedAt: now,
          createdAt: existing.exists ? existing.data()?.createdAt || now : now,
        },
        { merge: true }
      );

      const updated = await ref.get();
      return updated.data() as EntityMap[T];
    }

    const ref = db.collection(entity).doc();
    const payload = {
      ...input,
      id: ref.id,
      createdAt: now,
      updatedAt: now,
      _serverTime: FieldValue.serverTimestamp(),
    };
    await ref.set(payload);
    const created = await ref.get();
    return created.data() as EntityMap[T];
  } catch {
    return upsertEntityLocal(entity, input);
  }
}

export async function deleteEntity(entity: AdminEntity, id: string) {
  if (!hasFirebaseAdminConfig()) {
    await deleteEntityLocal(entity, id);
    return;
  }

  const db = getAdminDb();
  await db.collection(entity).doc(id).delete().catch(async () => {
    await deleteEntityLocal(entity, id);
  });
}

export async function listPublicEntity(entity: AdminEntity) {
  if (!hasFirebaseAdminConfig()) {
    return listPublicEntityLocal(entity);
  }

  const db = getAdminDb();

  try {
    if (entity === "products") {
      const snap = await db.collection(entity).where("status", "==", "active").get();
      return snap.docs.map((d) => d.data());
    }

    if (entity === "courses") {
      const snap = await db.collection(entity).where("status", "==", "active").get();
      return snap.docs.map((d) => d.data());
    }

    if (entity === "notices") {
      const snap = await db.collection(entity).where("status", "==", "published").get();
      return snap.docs.map((d) => d.data());
    }

    if (entity === "lamp_sea") {
      const snap = await db.collection(entity).where("status", "==", "active").get();
      return snap.docs.map((d) => d.data());
    }

    const snap = await db.collection(entity).get();
    return snap.docs.map((d) => d.data());
  } catch {
    return listPublicEntityLocal(entity);
  }
}
