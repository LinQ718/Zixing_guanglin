"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Card, GhostButton, Input, PrimaryButton, Select, TableWrap } from "@/components/admin/AdminUI";
import { adminService, createId } from "@/lib/admin/service";
import type { Member } from "@/lib/admin/types";

const emptyMember: Member = {
  id: "",
  name: "",
  email: "",
  avatar: "",
  role: "member",
  createdAt: "",
};

export default function MembersAdminPage() {
  const [rows, setRows] = useState<Member[]>([]);
  const [keyword, setKeyword] = useState("");
  const [editing, setEditing] = useState<Member>(emptyMember);

  useEffect(() => {
    adminService.members.list({ keyword }).then(setRows);
  }, [keyword]);

  const save = async () => {
    await adminService.members.upsert({
      ...editing,
      id: editing.id || createId("member"),
      createdAt: editing.createdAt || new Date().toISOString(),
    });
    setEditing(emptyMember);
    adminService.members.list({ keyword }).then(setRows);
  };

  return (
    <div>
      <AdminPageHeader
        title="會員管理"
        description="管理會員資料與角色權限，僅 admin 可進入後台。"
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_2fr]">
        <Card title={editing.id ? "編輯會員" : "新增會員"}>
          <div className="space-y-3">
            <Input placeholder="會員姓名" value={editing.name} onChange={(e) => setEditing((v) => ({ ...v, name: e.target.value }))} />
            <Input placeholder="Email" value={editing.email} onChange={(e) => setEditing((v) => ({ ...v, email: e.target.value }))} />
            <Input placeholder="頭像網址" value={editing.avatar} onChange={(e) => setEditing((v) => ({ ...v, avatar: e.target.value }))} />
            <Select value={editing.role} onChange={(e) => setEditing((v) => ({ ...v, role: e.target.value as Member["role"] }))}>
              <option value="member">member</option>
              <option value="admin">admin</option>
            </Select>
            <div className="flex gap-2">
              <PrimaryButton onClick={save} disabled={!editing.name.trim() || !editing.email.trim()}>
                {editing.id ? "儲存變更" : "新增會員"}
              </PrimaryButton>
              <GhostButton onClick={() => setEditing(emptyMember)}>清除</GhostButton>
            </div>
          </div>
        </Card>

        <Card
          title="會員列表"
          actions={<Input placeholder="搜尋會員" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-[220px]" />}
        >
          <TableWrap>
            <table className="min-w-full text-sm">
              <thead className="bg-[rgba(138,109,65,0.08)]">
                <tr>
                  <th className="px-3 py-2 text-left">姓名</th>
                  <th className="px-3 py-2 text-left">Email</th>
                  <th className="px-3 py-2 text-left">角色</th>
                  <th className="px-3 py-2 text-left">建立時間</th>
                  <th className="px-3 py-2 text-left">操作</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-[rgba(138,109,65,0.12)]">
                    <td className="px-3 py-2">{row.name}</td>
                    <td className="px-3 py-2">{row.email}</td>
                    <td className="px-3 py-2">{row.role}</td>
                    <td className="px-3 py-2">{new Date(row.createdAt).toLocaleDateString("zh-TW")}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <GhostButton onClick={() => setEditing({ ...row })} className="px-2.5 py-1.5">編輯</GhostButton>
                        <GhostButton
                          onClick={async () => {
                            await adminService.members.remove(row.id);
                            adminService.members.list({ keyword }).then(setRows);
                          }}
                          className="px-2.5 py-1.5"
                        >
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
    </div>
  );
}
