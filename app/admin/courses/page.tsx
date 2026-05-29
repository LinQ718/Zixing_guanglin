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
  TextArea,
} from "@/components/admin/AdminUI";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { adminService, createId } from "@/lib/admin/service";
import type { Course, CourseStatus } from "@/lib/admin/types";

const emptyForm: Course = {
  id: "",
  title: "",
  description: "",
  date: "",
  time: "",
  teacher: "",
  imageUrl: "",
  maxStudents: 0,
  status: "inactive",
  createdAt: "",
  updatedAt: "",
  signups: 0,
  category: "",
};

export default function CoursesAdminPage() {
  const [rows, setRows] = useState<Course[]>([]);
  const [members, setMembers] = useState<Array<{ id: string; name: string; email: string; role: string }>>([]);
  const [editing, setEditing] = useState<Course>(emptyForm);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const reload = () => adminService.courses.list().then(setRows);

  useEffect(() => {
    reload();
    adminService.members.list().then((list) =>
      setMembers(list.map((x) => ({ id: x.id, name: x.name, email: x.email, role: x.role })))
    );
  }, []);

  const save = async () => {
    await adminService.courses.upsert({
      ...editing,
      id: editing.id || createId("c"),
      createdAt: editing.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setEditing(emptyForm);
    reload();
  };

  const totalSignups = useMemo(() => rows.reduce((sum, x) => sum + (x.signups || 0), 0), [rows]);
  const selectedCourse = rows.find((x) => x.id === selectedCourseId) || null;

  return (
    <div>
      <AdminPageHeader
        title="日日行課程管理"
        description="上架或下架課程，維護課程內容、日期時間與講師資料。"
      />

      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <Card title="上架課程數">
          <p className="font-serif-tc text-3xl text-[rgba(44,32,16,0.95)]">{rows.filter((x) => x.status === "active").length}</p>
        </Card>
        <Card title="總報名人數">
          <p className="font-serif-tc text-3xl text-[rgba(44,32,16,0.95)]">{totalSignups}</p>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_2fr]">
        <Card title={editing.id ? "編輯課程" : "新增課程"}>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <FieldLabel>課程名稱</FieldLabel>
              <Input placeholder="例如：晨間觀息 21 日" value={editing.title} onChange={(e) => setEditing((v) => ({ ...v, title: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>課程介紹</FieldLabel>
              <TextArea placeholder="請輸入課程內容與重點" rows={3} value={editing.description} onChange={(e) => setEditing((v) => ({ ...v, description: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <FieldLabel>開課日期</FieldLabel>
                <Input type="date" value={editing.date} onChange={(e) => setEditing((v) => ({ ...v, date: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <FieldLabel>上課時間</FieldLabel>
                <Input type="time" value={editing.time} onChange={(e) => setEditing((v) => ({ ...v, time: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <FieldLabel>講師</FieldLabel>
              <Input placeholder="例如：明映老師" value={editing.teacher} onChange={(e) => setEditing((v) => ({ ...v, teacher: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>課程分類</FieldLabel>
              <Input placeholder="例如：呼吸觀 / 靜坐" value={editing.category || ""} onChange={(e) => setEditing((v) => ({ ...v, category: e.target.value }))} />
            </div>
            <ImageUploadField
              value={editing.imageUrl}
              onChange={(value) => setEditing((v) => ({ ...v, imageUrl: value }))}
              uploadFolder="courses"
              label="課程圖片"
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <FieldLabel>目前報名人數</FieldLabel>
                <Input type="number" placeholder="例如：18" value={editing.signups || 0} onChange={(e) => setEditing((v) => ({ ...v, signups: Number(e.target.value) }))} />
              </div>
              <div className="space-y-1.5">
                <FieldLabel>課程人數上限</FieldLabel>
                <Input type="number" placeholder="例如：40" value={editing.maxStudents} onChange={(e) => setEditing((v) => ({ ...v, maxStudents: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <FieldLabel>上架狀態</FieldLabel>
              <Select value={editing.status} onChange={(e) => setEditing((v) => ({ ...v, status: e.target.value as CourseStatus }))}>
                <option value="active">上架中</option>
                <option value="inactive">已下架</option>
              </Select>
            </div>
            <div className="flex gap-2">
              <PrimaryButton onClick={save} disabled={!editing.title.trim()}>儲存課程</PrimaryButton>
              <GhostButton onClick={() => setEditing(emptyForm)}>清除</GhostButton>
            </div>
          </div>
        </Card>

        <Card title="課程列表">
          <TableWrap>
            <table className="min-w-full text-sm">
              <thead className="bg-[rgba(138,109,65,0.08)]">
                <tr>
                  <th className="px-3 py-2 text-left">課程</th>
                  <th className="px-3 py-2 text-left">日期時間</th>
                  <th className="px-3 py-2 text-left">講師</th>
                  <th className="px-3 py-2 text-left">報名</th>
                  <th className="px-3 py-2 text-left">狀態</th>
                  <th className="px-3 py-2 text-left">操作</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-[rgba(138,109,65,0.12)] align-top">
                    <td className="px-3 py-2">
                      <p className="font-medium">{row.title}</p>
                      <p className="mt-1 text-xs text-[rgba(76,62,41,0.65)]">{row.description}</p>
                    </td>
                    <td className="px-3 py-2">{row.date} {row.time}</td>
                    <td className="px-3 py-2">{row.teacher}</td>
                    <td className="px-3 py-2">{row.signups || 0} / {row.maxStudents}</td>
                    <td className="px-3 py-2">
                      <StatusPill label={row.status === "active" ? "上架中" : "已下架"} tone={row.status === "active" ? "ok" : "muted"} />
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <GhostButton onClick={() => setEditing({ ...row })} className="px-2.5 py-1.5">編輯</GhostButton>
                        <GhostButton onClick={() => setSelectedCourseId(row.id)} className="px-2.5 py-1.5">會員</GhostButton>
                        <GhostButton
                          onClick={async () => {
                            await adminService.courses.remove(row.id);
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

      <div className="mt-4">
        <Card title="課程報名會員資料">
          {selectedCourse ? (
            <>
              <p className="text-sm text-[rgba(76,62,41,0.75)]">課程：{selectedCourse.title} / 報名人數：{selectedCourse.signups || 0}</p>
              <div className="mt-3 overflow-x-auto rounded-xl border border-[rgba(138,109,65,0.18)]">
                <table className="min-w-full text-sm">
                  <thead className="bg-[rgba(138,109,65,0.08)]">
                    <tr>
                      <th className="px-3 py-2 text-left">會員姓名</th>
                      <th className="px-3 py-2 text-left">Email</th>
                      <th className="px-3 py-2 text-left">角色</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.slice(0, selectedCourse.signups || members.length).map((m) => (
                      <tr key={`${selectedCourse.id}-${m.id}`} className="border-t border-[rgba(138,109,65,0.12)]">
                        <td className="px-3 py-2">{m.name}</td>
                        <td className="px-3 py-2">{m.email}</td>
                        <td className="px-3 py-2">{m.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p className="text-sm text-[rgba(76,62,41,0.72)]">請先在上方課程列表點選「會員」，即可查看該課程的報名會員資料。</p>
          )}
        </Card>
      </div>
    </div>
  );
}
