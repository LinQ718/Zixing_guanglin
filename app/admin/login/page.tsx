"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("請輸入帳號與密碼");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        setError(data.message || "登入失敗");
        setLoading(false);
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setError("登入失敗，請稍後再試");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-[rgba(138,109,65,0.2)] bg-[rgba(252,248,242,0.95)] p-6 shadow-[0_12px_40px_rgba(56,42,18,0.08)]">
        <p className="text-xs tracking-[0.2em] text-[rgba(90,70,35,0.48)]">ADMIN LOGIN</p>
        <h1 className="font-serif-tc mt-2 text-2xl tracking-[0.14em] text-[rgba(44,32,16,0.95)]">後台登入</h1>
        <p className="mt-2 text-sm text-[rgba(76,62,41,0.7)]">請使用管理員帳號登入後台。</p>

        <form onSubmit={submit} className="mt-5 space-y-3">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="帳號"
            className="w-full rounded-lg border border-[rgba(138,109,65,0.25)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[rgba(61,92,71,0.7)] focus:ring-2 focus:ring-[rgba(61,92,71,0.2)]"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="密碼"
            className="w-full rounded-lg border border-[rgba(138,109,65,0.25)] bg-white px-3 py-2.5 text-sm outline-none focus:border-[rgba(61,92,71,0.7)] focus:ring-2 focus:ring-[rgba(61,92,71,0.2)]"
          />
          {error ? <p className="text-sm text-[rgba(150,60,35,0.9)]">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg border border-[rgba(61,92,71,0.55)] bg-[rgba(61,92,71,0.92)] px-4 py-2.5 text-sm tracking-[0.1em] text-[rgba(248,244,236,1)] hover:bg-[rgba(46,74,56,1)] disabled:opacity-60"
          >
            {loading ? "登入中..." : "登入後台"}
          </button>
        </form>
      </div>
    </div>
  );
}
