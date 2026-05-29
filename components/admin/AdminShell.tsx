"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "結緣品管理", href: "/admin/products" },
  { label: "一念燈海管理", href: "/admin/lantern-sea" },
  { label: "日日行課程管理", href: "/admin/courses" },
  { label: "會員修行簿", href: "/admin/practice-logs" },
  { label: "噔噔通知管理", href: "/admin/notifications" },
  { label: "會員管理", href: "/admin/members" },
  { label: "設定", href: "/admin/settings" },
];

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const title = useMemo(() => {
    const found = navItems.find((x) => x.href === pathname);
    return found?.label || "管理後台";
  }, [pathname]);

  if (pathname === "/admin/login") {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_15%_20%,rgba(200,185,154,0.2),transparent_45%),radial-gradient(circle_at_85%_15%,rgba(61,92,71,0.12),transparent_40%),#f7f2e9] text-[rgba(44,32,16,0.92)]">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,rgba(200,185,154,0.18),transparent_40%),radial-gradient(circle_at_90%_0%,rgba(61,92,71,0.1),transparent_35%),#f7f2e9] text-[rgba(44,32,16,0.92)]">
      <div className="mx-auto flex max-w-[1520px]">
        <aside className="hidden lg:flex lg:w-[292px] lg:shrink-0 lg:flex-col border-r border-[rgba(138,109,65,0.2)] bg-[linear-gradient(180deg,rgba(252,248,242,0.95)_0%,rgba(246,239,228,0.92)_100%)] backdrop-blur-md min-h-screen sticky top-0">
          <div className="px-7 py-7 border-b border-[rgba(138,109,65,0.15)]">
            <h1 className="font-serif-tc text-xl tracking-[0.2em] text-[rgba(61,92,71,0.95)]">自性光林</h1>
            <p className="text-xs tracking-[0.2em] mt-2 text-[rgba(90,70,35,0.5)]">後台管理系統</p>
          </div>
          <nav className="px-4 py-5 space-y-1.5">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={classNames(
                    "block rounded-xl px-4 py-3 text-[14px] tracking-[0.08em] transition-all",
                    active
                      ? "bg-[rgba(61,92,71,0.14)] text-[rgba(26,46,30,1)] border border-[rgba(61,92,71,0.35)] shadow-[0_8px_22px_rgba(61,92,71,0.08)]"
                      : "text-[rgba(55,40,14,0.7)] hover:bg-[rgba(138,109,65,0.08)]"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="min-h-screen flex-1">
          <header className="sticky top-0 z-30 border-b border-[rgba(138,109,65,0.15)] bg-[rgba(250,247,242,0.92)] backdrop-blur-md">
            <div className="px-4 py-3 sm:px-6 md:px-8 lg:px-10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="lg:hidden rounded-md border border-[rgba(138,109,65,0.3)] px-3 py-2 text-sm"
                  onClick={() => setOpen((v) => !v)}
                >
                  選單
                </button>
                <div>
                  <p className="text-xs tracking-[0.2em] text-[rgba(90,70,35,0.45)]">ADMIN</p>
                  <h2 className="font-serif-tc text-lg tracking-[0.12em] text-[rgba(44,32,16,0.95)]">{title}</h2>
                </div>
              </div>
              <span className="hidden sm:inline-flex text-xs md:text-sm tracking-[0.08em] text-[rgba(61,92,71,0.88)] rounded-full border border-[rgba(61,92,71,0.25)] px-3 py-1.5">
                智慧維護中
              </span>
              <button
                type="button"
                disabled={loggingOut}
                onClick={async () => {
                  setLoggingOut(true);
                  await fetch("/api/admin/auth/logout", { method: "POST" });
                  window.location.href = "/admin/login";
                }}
                className="rounded-md border border-[rgba(138,109,65,0.35)] bg-[rgba(250,247,242,0.8)] px-3 py-1.5 text-xs tracking-[0.08em] text-[rgba(60,42,18,0.82)] transition hover:bg-[rgba(138,109,65,0.08)]"
              >
                {loggingOut ? "登出中" : "登出"}
              </button>
            </div>

            {open ? (
              <div className="lg:hidden border-t border-[rgba(138,109,65,0.15)] p-3 space-y-1">
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={classNames(
                        "block rounded-md px-3 py-2 text-sm tracking-[0.08em]",
                        active
                          ? "bg-[rgba(61,92,71,0.15)] text-[rgba(26,46,30,1)]"
                          : "text-[rgba(55,40,14,0.72)] hover:bg-[rgba(138,109,65,0.08)]"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </header>

          <main className="px-4 py-5 sm:px-6 md:px-8 lg:px-10 lg:py-8">
            <div className="rounded-2xl border border-[rgba(138,109,65,0.14)] bg-[rgba(252,248,242,0.6)] p-3 sm:p-4 md:p-5">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
