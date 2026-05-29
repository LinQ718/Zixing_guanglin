"use client";

import { useEffect, useState } from "react";
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
  TextArea,
} from "@/components/admin/AdminUI";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { adminService, createId } from "@/lib/admin/service";
import type { Notice, NotificationStatus } from "@/lib/admin/types";

const emptyForm: Notice = {
  id: "",
  title: "",
  content: "",
  imageUrl: "",
  link: "",
  status: "draft",
  createdAt: "",
  updatedAt: "",
};

export default function NotificationsAdminPage() {
  const [rows, setRows] = useState<Notice[]>([]);
  const [editing, setEditing] = useState<Notice>(emptyForm);

  const reload = () => adminService.notices.list().then(setRows);

  useEffect(() => {
    reload();
  }, []);

  const save = async () => {
    await adminService.notices.upsert({
      ...editing,
      id: editing.id || createId("n"),
      createdAt: editing.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      link: editing.link || editing.linkUrl || "",
    });
    setEditing(emptyForm);
    reload();
  };

  return (
    <div>
      <AdminPageHeader
        title="噔噔通知管理"
        description="管理通知標題、內容、圖片與連結，並可切換草稿、已發布、已隱藏。"
      />

      <div className="grid gap-4 xl:grid-cols-[1.1fr_2fr]">
        <Card title={editing.id ? "編輯通知" : "新增通知"}>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <FieldLabel>通知標題</FieldLabel>
              <Input placeholder="例如：端午前夕共修通知" value={editing.title} onChange={(e) => setEditing((v) => ({ ...v, title: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>通知內容</FieldLabel>
              <TextArea placeholder="請輸入通知內文" rows={5} value={editing.content} onChange={(e) => setEditing((v) => ({ ...v, content: e.target.value }))} />
            </div>
            <ImageUploadField
              value={editing.imageUrl}
              onChange={(value) => setEditing((v) => ({ ...v, imageUrl: value }))}
              uploadFolder="notifications"
              label="通知圖片"
            />
            <div className="space-y-1.5">
              <FieldLabel>跳轉連結</FieldLabel>
              <Input placeholder="例如：/join 或 https://example.com" value={editing.link || editing.linkUrl || ""} onChange={(e) => setEditing((v) => ({ ...v, link: e.target.value, linkUrl: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>發布狀態</FieldLabel>
              <Select value={editing.status} onChange={(e) => setEditing((v) => ({ ...v, status: e.target.value as NotificationStatus }))}>
                <option value="draft">草稿</option>
                <option value="published">已發布</option>
                <option value="hidden">已隱藏</option>
              </Select>
            </div>
            <div className="flex gap-2">
              <PrimaryButton onClick={save} disabled={!editing.title.trim()}>儲存通知</PrimaryButton>
              <GhostButton onClick={() => setEditing(emptyForm)}>清除</GhostButton>
            </div>
          </div>
        </Card>

        <Card title="通知列表">
          <TableWrap>
            <table className="min-w-full text-sm">
              <thead className="bg-[rgba(138,109,65,0.08)]">
                <tr>
                  <th className="px-3 py-2 text-left">標題</th>
                  <th className="px-3 py-2 text-left">連結</th>
                  <th className="px-3 py-2 text-left">狀態</th>
                  <th className="px-3 py-2 text-left">操作</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-[rgba(138,109,65,0.12)] align-top">
                    <td className="px-3 py-2">
                      <p className="font-medium">{row.title}</p>
                      <p className="mt-1 text-xs text-[rgba(76,62,41,0.62)] line-clamp-2">{row.content}</p>
                    </td>
                    <td className="px-3 py-2 text-xs text-[rgba(76,62,41,0.72)]">{row.link || row.linkUrl || "-"}</td>
                    <td className="px-3 py-2">
                      <StatusPill
                        label={row.status === "published" ? "已發布" : row.status === "draft" ? "草稿" : "已隱藏"}
                        tone={row.status === "published" ? "ok" : row.status === "draft" ? "neutral" : "muted"}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <GhostButton onClick={() => setEditing({ ...row, linkUrl: row.link || row.linkUrl })} className="px-2.5 py-1.5">編輯</GhostButton>
                        <GhostButton
                          onClick={async () => {
                            await adminService.notices.remove(row.id);
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
