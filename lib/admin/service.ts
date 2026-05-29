import type {
  Course,
  DashboardMetrics,
  LanternSeaItem,
  Member,
  MemberFilter,
  Notice,
  PracticeLog,
  PracticeLogFilter,
  Product,
} from "@/lib/admin/types";

type EntityName = "products" | "courses" | "notices" | "lamp_sea" | "members" | "practice_logs";

export type AdminAccountRole = "admin" | "super_admin";
export type AdminAccountStatus = "active" | "disabled";

export type AdminAccount = {
  username: string;
  displayName: string;
  role: AdminAccountRole;
  status: AdminAccountStatus;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
};

async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });

  const raw = await response.text();
  let data: unknown = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    if (!response.ok) {
      throw new Error(raw || "伺服器回傳非 JSON 錯誤");
    }
    throw new Error("伺服器回應格式錯誤");
  }

  const parsed = data as { ok?: boolean; message?: string } | null;
  if (!response.ok || parsed?.ok === false) {
    throw new Error(parsed?.message || "資料請求失敗");
  }
  return data as T;
}

async function listEntity<T>(entity: EntityName): Promise<T[]> {
  const data = await fetchJson<{ ok: true; rows: T[] }>(`/api/admin/${entity}`);
  return data.rows;
}

async function createEntity<T>(entity: EntityName, row: Partial<T>) {
  const data = await fetchJson<{ ok: true; row: T }>(`/api/admin/${entity}`, {
    method: "POST",
    body: JSON.stringify(row),
  });
  return data.row;
}

async function updateEntity<T extends { id: string }>(entity: EntityName, row: T) {
  const data = await fetchJson<{ ok: true; row: T }>(`/api/admin/${entity}/${row.id}`, {
    method: "PUT",
    body: JSON.stringify(row),
  });
  return data.row;
}

async function removeEntity(entity: EntityName, id: string) {
  await fetchJson<{ ok: true }>(`/api/admin/${entity}/${id}`, {
    method: "DELETE",
  });
}

const byKeyword = (raw: string, targets: string[]) => {
  const q = raw.trim().toLowerCase();
  if (!q) return true;
  return targets.some((x) => x.toLowerCase().includes(q));
};

export const adminService = {
  products: {
    list: () => listEntity<Product>("products"),
    upsert: (row: Product) => (row.id ? updateEntity("products", row) : createEntity("products", row)),
    remove: (id: string) => removeEntity("products", id),
  },

  lanternSea: {
    list: () => listEntity<LanternSeaItem>("lamp_sea"),
    upsert: (row: LanternSeaItem) => (row.id ? updateEntity("lamp_sea", row) : createEntity("lamp_sea", row)),
    remove: (id: string) => removeEntity("lamp_sea", id),
  },

  courses: {
    list: () => listEntity<Course>("courses"),
    upsert: (row: Course) => (row.id ? updateEntity("courses", row) : createEntity("courses", row)),
    remove: (id: string) => removeEntity("courses", id),
  },

  members: {
    list: async (filter?: MemberFilter) => {
      const rows = await listEntity<Member>("members");
      if (!filter?.keyword) return rows;
      return rows.filter((row) => byKeyword(filter.keyword || "", [row.name, row.email, row.role]));
    },
    upsert: (row: Member) => (row.id ? updateEntity("members", row) : createEntity("members", row)),
    remove: (id: string) => removeEntity("members", id),
  },

  practiceLogs: {
    list: async (filter?: PracticeLogFilter) => {
      const rows = await listEntity<PracticeLog>("practice_logs");
      return rows.filter((row) => {
        const keywordPass = byKeyword(filter?.keyword || "", [
          row.title || "",
          row.content || "",
          row.memberName || "",
          row.courseName || "",
          row.practiceType || "",
        ]);
        const datePass = !filter?.date || row.date === filter.date;
        const memberPass = !filter?.memberId || row.memberId === filter.memberId;
        const coursePass = !filter?.courseName || row.courseName === filter.courseName;
        return keywordPass && datePass && memberPass && coursePass;
      });
    },
    upsert: (row: PracticeLog) => (row.id ? updateEntity("practice_logs", row) : createEntity("practice_logs", row)),
    remove: (id: string) => removeEntity("practice_logs", id),
  },

  notices: {
    list: async () => {
      const rows = await listEntity<Notice>("notices");
      return rows.map((row) => ({ ...row, linkUrl: row.link }));
    },
    upsert: (row: Notice) => {
      const normalized = { ...row, link: row.link || row.linkUrl || "" };
      return row.id ? updateEntity("notices", normalized) : createEntity("notices", normalized);
    },
    remove: (id: string) => removeEntity("notices", id),
  },

  dashboard: {
    getMetrics: async (): Promise<DashboardMetrics> => {
      const data = await fetchJson<{ ok: true; metrics: DashboardMetrics }>("/api/admin/dashboard");
      return data.metrics;
    },
  },

  accounts: {
    list: async () => {
      const data = await fetchJson<{ ok: true; rows: AdminAccount[] }>("/api/admin/accounts");
      return data.rows;
    },
    create: async (input: {
      username: string;
      displayName: string;
      role: AdminAccountRole;
      status: AdminAccountStatus;
      password: string;
    }) => {
      const data = await fetchJson<{ ok: true; row: AdminAccount }>("/api/admin/accounts", {
        method: "POST",
        body: JSON.stringify(input),
      });
      return data.row;
    },
    update: async (
      username: string,
      input: {
        displayName: string;
        role: AdminAccountRole;
        status: AdminAccountStatus;
        password?: string;
      }
    ) => {
      const data = await fetchJson<{ ok: true; row: AdminAccount }>(`/api/admin/accounts/${username}`, {
        method: "PUT",
        body: JSON.stringify(input),
      });
      return data.row;
    },
    remove: async (username: string) => {
      await fetchJson<{ ok: true }>(`/api/admin/accounts/${username}`, {
        method: "DELETE",
      });
    },
  },
};

export const createId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
