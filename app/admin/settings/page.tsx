"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  Card,
  FieldLabel,
  GhostButton,
  Input,
  PrimaryButton,
  Select,
  StatusPill,
  TableWrap,
} from "@/components/admin/AdminUI";
import {
  adminService,
  type AdminAccount,
  type AdminAccountRole,
  type AdminAccountStatus,
} from "@/lib/admin/service";

export default function SettingsAdminPage() {
  const [rows, setRows] = useState<AdminAccount[]>([]);
  const [keyword, setKeyword] = useState("");
  const [message, setMessage] = useState("");

  const emptyForm = {
    username: "",
    displayName: "",
    role: "admin" as AdminAccountRole,
    status: "active" as AdminAccountStatus,
    password: "",
  };

  const [form, setForm] = useState(emptyForm);

  const reload = () => adminService.accounts.list().then(setRows);

  useEffect(() => {
    reload();
  }, []);

  const filtered = useMemo(() => {
    if (!keyword.trim()) return rows;
    const q = keyword.trim().toLowerCase();
    return rows.filter((x) => [x.username, x.displayName, x.role, x.status].some((v) => v.toLowerCase().includes(q)));
  }, [keyword, rows]);

  const save = async () => {
    if (!form.username.trim()) {
      setMessage("請輸入登入帳號");
      return;
    }

    if (!form.displayName.trim()) {
      setMessage("請輸入顯示名稱");
      return;
    }

    const exists = rows.some((x) => x.username === form.username.toLowerCase());
    if (exists) {
      await adminService.accounts.update(form.username, {
        displayName: form.displayName,
        role: form.role,
        status: form.status,
        password: form.password.trim() ? form.password : undefined,
      });
      setMessage("帳號已更新");
    } else {
      if (!form.password.trim()) {
        setMessage("新增帳號時請設定初始密碼");
        return;
      }

      await adminService.accounts.create({
        username: form.username,
        displayName: form.displayName,
        role: form.role,
        status: form.status,
        password: form.password,
      });
      setMessage("帳號已建立");
    }

    setForm(emptyForm);
    await reload();
  };

  const remove = async (username: string) => {
    await adminService.accounts.remove(username);
    if (form.username === username) {
      setForm(emptyForm);
    }
    setMessage("帳號已刪除");
    await reload();
  };

  return (
    <div>
      <AdminPageHeader
        title="後台帳號管理"
        description="管理可登入後台的帳號、角色與啟用狀態。帳號建立後可直接使用該帳密登入。"
      />

      <div className="grid gap-4 xl:grid-cols-[1.1fr_2fr]">
        <Card title={form.username ? "編輯後台帳號" : "新增後台帳號"}>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <FieldLabel>登入帳號</FieldLabel>
              <Input
                placeholder="例如：admin01"
                value={form.username}
                onChange={(e) => setForm((v) => ({ ...v, username: e.target.value.toLowerCase().trim() }))}
              />
            </div>

            <div className="space-y-1.5">
              <FieldLabel>顯示名稱</FieldLabel>
              <Input
                placeholder="例如：營運管理員"
                value={form.displayName}
                onChange={(e) => setForm((v) => ({ ...v, displayName: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <FieldLabel>角色</FieldLabel>
                <Select value={form.role} onChange={(e) => setForm((v) => ({ ...v, role: e.target.value as AdminAccountRole }))}>
                  <option value="admin">admin</option>
                  <option value="super_admin">super_admin</option>
                </Select>
              </div>

              <div className="space-y-1.5">
                <FieldLabel>狀態</FieldLabel>
                <Select value={form.status} onChange={(e) => setForm((v) => ({ ...v, status: e.target.value as AdminAccountStatus }))}>
                  <option value="active">啟用</option>
                  <option value="disabled">停用</option>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <FieldLabel>密碼（編輯時留空代表不變更）</FieldLabel>
              <Input
                type="password"
                placeholder="請輸入至少 8 碼"
                value={form.password}
                onChange={(e) => setForm((v) => ({ ...v, password: e.target.value }))}
              />
            </div>

            {message ? <p className="text-xs text-[rgba(76,62,41,0.8)]">{message}</p> : null}

            <div className="flex gap-2">
              <PrimaryButton onClick={save}>儲存帳號</PrimaryButton>
              <GhostButton
                onClick={() => {
                  setForm(emptyForm);
                  setMessage("");
                }}
              >
                清除
              </GhostButton>
            </div>
          </div>
        </Card>

        <Card
          title="可登入後台帳號"
          actions={<Input placeholder="搜尋帳號" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-[220px]" />}
        >
          <TableWrap>
            <table className="min-w-full text-sm">
              <thead className="bg-[rgba(138,109,65,0.08)]">
                <tr>
                  <th className="px-3 py-2 text-left">帳號</th>
                  <th className="px-3 py-2 text-left">名稱</th>
                  <th className="px-3 py-2 text-left">角色</th>
                  <th className="px-3 py-2 text-left">狀態</th>
                  <th className="px-3 py-2 text-left">最近登入</th>
                  <th className="px-3 py-2 text-left">操作</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.username} className="border-t border-[rgba(138,109,65,0.12)]">
                    <td className="px-3 py-2 font-medium">{row.username}</td>
                    <td className="px-3 py-2">{row.displayName}</td>
                    <td className="px-3 py-2">{row.role}</td>
                    <td className="px-3 py-2">
                      <StatusPill
                        label={row.status === "active" ? "啟用" : "停用"}
                        tone={row.status === "active" ? "ok" : "muted"}
                      />
                    </td>
                    <td className="px-3 py-2 text-xs text-[rgba(76,62,41,0.72)]">
                      {row.lastLoginAt ? new Date(row.lastLoginAt).toLocaleString("zh-TW") : "尚未登入"}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <GhostButton
                          className="px-2.5 py-1.5"
                          onClick={() => {
                            setForm({
                              username: row.username,
                              displayName: row.displayName,
                              role: row.role,
                              status: row.status,
                              password: "",
                            });
                            setMessage("");
                          }}
                        >
                          編輯
                        </GhostButton>
                        <GhostButton className="px-2.5 py-1.5" onClick={() => remove(row.username)}>
                          刪除
                        </GhostButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        </Card>
      </div>

      <div className="mt-4">
        <Card title="系統帳號說明">
          <ul className="space-y-1.5 text-sm tracking-[0.05em] text-[rgba(76,62,41,0.8)]">
            <li>• `.env.local` 內 `ADMIN_USER / ADMIN_PASS` 為備援超級管理帳號。</li>
            <li>• 本頁新增的帳號可直接登入後台，並可隨時停用。</li>
            <li>• 建議至少保留 1 個可登入的 `super_admin` 帳號，避免鎖死後台。</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
