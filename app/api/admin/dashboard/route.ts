import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/authz";
import { listEntity } from "@/lib/admin/repository";
import type { Course, Product } from "@/lib/admin/types";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) {
      return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status });
    }

    const [products, courses, members, logs, notices] = await Promise.all([
      listEntity("products"),
      listEntity("courses"),
      listEntity("members"),
      listEntity("practice_logs"),
      listEntity("notices"),
    ]);

    const productRows = products as Product[];
    const courseRows = courses as Course[];

    const metrics = {
      totalProducts: productRows.length,
      lowStockProducts: productRows.filter((x) => x.status === "sold_out" || (x.stock || 0) <= 10).length,
      publishedCourses: courseRows.filter((x) => x.status === "active").length,
      totalMembers: members.length,
      latestLogs: logs.slice(0, 5),
      latestNotices: notices.slice(0, 5),
    };

    return NextResponse.json({ ok: true, metrics });
  } catch (error) {
    const message = error instanceof Error ? error.message : "儀表板資料讀取失敗";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
