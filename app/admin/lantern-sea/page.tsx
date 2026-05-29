"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Card, FieldLabel, GhostButton, Input, PrimaryButton, Select, StatusPill, TableWrap, TextArea } from "@/components/admin/AdminUI";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { adminService, createId } from "@/lib/admin/service";
import type { LanternSeaItem } from "@/lib/admin/types";

const emptyForm: LanternSeaItem = {
  id: "",
  title: "",
  content: "",
  imageUrl: "",
  status: "inactive",
  createdAt: "",
  updatedAt: "",
};

export default function LanternSeaAdminPage() {
  const [rows, setRows] = useState<LanternSeaItem[]>([]);
  const [editing, setEditing] = useState(emptyForm);

  const reload = () => adminService.lanternSea.list().then(setRows);

  useEffect(() => {
    reload();
  }, []);

  const save = async () => {
    await adminService.lanternSea.upsert({
      ...editing,
      id: editing.id || createId("l"),
      createdAt: editing.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setEditing(emptyForm);
    reload();
  };

  return (
    <div>
      <AdminPageHeader
        title="一念燈海管理"
        description="新增、編輯、刪除燈海內容，並可設定前台上架或下架。"
      />

      <div className="grid gap-4 xl:grid-cols-[1.1fr_2fr]">
        <Card title={editing.id ? "編輯燈海內容" : "新增燈海內容"}>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <FieldLabel>燈海標題</FieldLabel>
              <Input placeholder="例如：願心供燈" value={editing.title} onChange={(e) => setEditing((v) => ({ ...v, title: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>燈海內容</FieldLabel>
              <TextArea placeholder="請輸入供燈說明與祈願文案" rows={4} value={editing.content} onChange={(e) => setEditing((v) => ({ ...v, content: e.target.value }))} />
            </div>
            <ImageUploadField
              value={editing.imageUrl}
              onChange={(value) => setEditing((v) => ({ ...v, imageUrl: value }))}
              uploadFolder="lantern-sea"
              label="燈海圖片"
            />
            <div className="space-y-1.5">
              <FieldLabel>上架狀態</FieldLabel>
              <Select value={editing.status} onChange={(e) => setEditing((v) => ({ ...v, status: e.target.value as LanternSeaItem["status"] }))}>
                <option value="active">上架中</option>
                <option value="inactive">已下架</option>
              </Select>
            </div>
            <div className="flex gap-2">
              <PrimaryButton onClick={save} disabled={!editing.title.trim()}>儲存內容</PrimaryButton>
              <GhostButton onClick={() => setEditing(emptyForm)}>清除</GhostButton>
            </div>
          </div>
        </Card>

        <Card title="燈海項目列表">
          <TableWrap>
            <table className="min-w-full text-sm">
              <thead className="bg-[rgba(138,109,65,0.08)]">
                <tr>
                  <th className="px-3 py-2 text-left">標題</th>
                  <th className="px-3 py-2 text-left">狀態</th>
                  <th className="px-3 py-2 text-left">操作</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-[rgba(138,109,65,0.12)] align-top">
                    <td className="px-3 py-2">
                      <p className="font-medium">{row.title}</p>
                      <p className="mt-1 text-xs text-[rgba(76,62,41,0.65)] line-clamp-2">{row.content}</p>
                    </td>
                    <td className="px-3 py-2">
                      <StatusPill label={row.status === "active" ? "前台顯示" : "前台隱藏"} tone={row.status === "active" ? "ok" : "muted"} />
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <GhostButton onClick={() => setEditing({ ...row })} className="px-2.5 py-1.5">編輯</GhostButton>
                        <GhostButton
                          onClick={async () => {
                            await adminService.lanternSea.remove(row.id);
                            reload();
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
