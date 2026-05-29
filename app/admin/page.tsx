"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Card, StatusPill, TableWrap } from "@/components/admin/AdminUI";
import { adminService } from "@/lib/admin/service";
import type { DashboardMetrics } from "@/lib/admin/types";

const emptyMetrics: DashboardMetrics = {
  totalProducts: 0,
  lowStockProducts: 0,
  publishedCourses: 0,
  totalMembers: 0,
  latestLogs: [],
  latestNotices: [],
};

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>(emptyMetrics);

  useEffect(() => {
    adminService.dashboard.getMetrics().then(setMetrics);
  }, []);

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="查看商品、課程、會員與修行資料概況，快速掌握整體營運狀態。"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat title="商品總數" value={metrics.totalProducts} sub="結緣品資料庫" />
        <Stat title="庫存不足" value={metrics.lowStockProducts} sub="含低於 10 件" warning />
        <Stat title="上架課程" value={metrics.publishedCourses} sub="目前前台可見" />
        <Stat title="會員總數" value={metrics.totalMembers} sub="已註冊會員" />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <Card title="最新修行簿紀錄">
          <TableWrap>
            <table className="min-w-full text-sm">
              <thead className="bg-[rgba(138,109,65,0.08)] text-[rgba(76,62,41,0.82)]">
                <tr>
                  <th className="px-3 py-2 text-left">會員</th>
                  <th className="px-3 py-2 text-left">日期</th>
                  <th className="px-3 py-2 text-left">課程</th>
                  <th className="px-3 py-2 text-left">狀態</th>
                </tr>
              </thead>
              <tbody>
                {metrics.latestLogs.map((row) => (
                  <tr key={row.id} className="border-t border-[rgba(138,109,65,0.12)]">
                    <td className="px-3 py-2">{row.memberName}</td>
                    <td className="px-3 py-2">{row.date}</td>
                    <td className="px-3 py-2">{row.courseName}</td>
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

        <Card title="最新通知">
          <div className="space-y-3">
            {metrics.latestNotices.map((row) => (
              <div
                key={row.id}
                className="rounded-xl border border-[rgba(138,109,65,0.2)] bg-[rgba(255,255,255,0.7)] p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-serif-tc text-[17px] tracking-[0.08em] text-[rgba(44,32,16,0.95)]">{row.title}</h4>
                  <StatusPill
                    label={row.status === "published" ? "已發布" : row.status === "draft" ? "草稿" : "已隱藏"}
                    tone={row.status === "published" ? "ok" : row.status === "draft" ? "neutral" : "muted"}
                  />
                </div>
                <p className="mt-1 text-sm text-[rgba(76,62,41,0.72)] line-clamp-2">{row.content}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Stat({
  title,
  value,
  sub,
  warning,
}: {
  title: string;
  value: number;
  sub: string;
  warning?: boolean;
}) {
  return (
    <article className="rounded-2xl border border-[rgba(138,109,65,0.2)] bg-[rgba(252,248,242,0.92)] p-4 shadow-[0_8px_30px_rgba(56,42,18,0.05)]">
      <p className="text-xs tracking-[0.16em] text-[rgba(90,70,35,0.5)]">{title}</p>
      <p className={`mt-2 font-serif-tc text-3xl tracking-[0.08em] ${warning ? "text-[rgba(137,85,20,0.95)]" : "text-[rgba(44,32,16,0.95)]"}`}>
        {value}
      </p>
      <p className="mt-1 text-xs tracking-[0.08em] text-[rgba(76,62,41,0.66)]">{sub}</p>
    </article>
  );
}
