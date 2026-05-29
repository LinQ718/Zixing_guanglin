"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Card, Input, Select, StatusPill, TableWrap } from "@/components/admin/AdminUI";
import { adminService } from "@/lib/admin/service";
import type { PracticeLog } from "@/lib/admin/types";

export default function PracticeLogsAdminPage() {
  const [rows, setRows] = useState<PracticeLog[]>([]);
  const [members, setMembers] = useState<Array<{ id: string; name: string }>>([]);
  const [keyword, setKeyword] = useState("");
  const [date, setDate] = useState("");
  const [memberId, setMemberId] = useState("");
  const [courseName, setCourseName] = useState("");

  useEffect(() => {
    adminService.members.list().then((list) => setMembers(list.map((x) => ({ id: x.id, name: x.name }))));
  }, []);

  useEffect(() => {
    adminService.practiceLogs
      .list({
        keyword,
        date: date || undefined,
        memberId: memberId || undefined,
        courseName: courseName || undefined,
      })
      .then(setRows);
  }, [keyword, date, memberId, courseName]);

  const courseOptions = useMemo(() => {
    const unique = new Set(rows.map((x) => x.courseName));
    return Array.from(unique);
  }, [rows]);

  return (
    <div>
      <AdminPageHeader
        title="會員修行簿"
        description="查閱會員修行紀錄，並可依日期、會員、課程分類快速篩選。"
      />

      <Card title="搜尋與篩選">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Input placeholder="搜尋會員或內容" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Select value={memberId} onChange={(e) => setMemberId(e.target.value)}>
            <option value="">全部會員</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </Select>
          <Select value={courseName} onChange={(e) => setCourseName(e.target.value)}>
            <option value="">全部課程</option>
            {courseOptions.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </Select>
        </div>
      </Card>

      <div className="mt-4">
        <Card title={`修行簿列表 (${rows.length})`}>
          <TableWrap>
            <table className="min-w-full text-sm">
              <thead className="bg-[rgba(138,109,65,0.08)]">
                <tr>
                  <th className="px-3 py-2 text-left">會員</th>
                  <th className="px-3 py-2 text-left">日期</th>
                  <th className="px-3 py-2 text-left">標題與內容</th>
                  <th className="px-3 py-2 text-left">完成狀態</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-[rgba(138,109,65,0.12)] align-top">
                    <td className="px-3 py-2">{row.memberName || row.memberId}</td>
                    <td className="px-3 py-2">{row.date}</td>
                    <td className="px-3 py-2">
                      <p className="font-medium">{row.title}</p>
                      <p>{row.content}</p>
                    </td>
                    <td className="px-3 py-2">
                      <StatusPill
                        label={row.status === "done" ? "已完成" : row.status === "in_progress" ? "進行中" : "待處理"}
                        tone={row.status === "done" ? "ok" : row.status === "in_progress" ? "warn" : "muted"}
                      />
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
