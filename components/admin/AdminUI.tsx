"use client";

import type { ReactNode } from "react";

export function Card({ title, actions, children }: { title: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-[rgba(138,109,65,0.18)] bg-[rgba(252,248,242,0.9)] p-4 md:p-5 shadow-[0_8px_30px_rgba(56,42,18,0.05)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-serif-tc text-lg tracking-[0.1em] text-[rgba(44,32,16,0.95)]">{title}</h3>
        {actions}
      </div>
      {children}
    </section>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <p className="text-xs tracking-[0.08em] text-[rgba(90,70,35,0.7)]">{children}</p>;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-[rgba(138,109,65,0.25)] bg-white px-3 py-2.5 text-sm tracking-[0.04em] text-[rgba(44,32,16,0.95)] outline-none transition focus:border-[rgba(61,92,71,0.7)] focus:ring-2 focus:ring-[rgba(61,92,71,0.2)] ${props.className || ""}`}
    />
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-lg border border-[rgba(138,109,65,0.25)] bg-white px-3 py-2.5 text-sm tracking-[0.04em] text-[rgba(44,32,16,0.95)] outline-none transition focus:border-[rgba(61,92,71,0.7)] focus:ring-2 focus:ring-[rgba(61,92,71,0.2)] ${props.className || ""}`}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-lg border border-[rgba(138,109,65,0.25)] bg-white px-3 py-2.5 text-sm tracking-[0.04em] text-[rgba(44,32,16,0.95)] outline-none transition focus:border-[rgba(61,92,71,0.7)] focus:ring-2 focus:ring-[rgba(61,92,71,0.2)] ${props.className || ""}`}
    />
  );
}

export function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-lg border border-[rgba(61,92,71,0.55)] bg-[rgba(61,92,71,0.92)] px-4 py-2 text-sm tracking-[0.08em] text-[rgba(248,244,236,1)] transition hover:bg-[rgba(46,74,56,1)] disabled:opacity-60 ${props.className || ""}`}
    />
  );
}

export function GhostButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-lg border border-[rgba(138,109,65,0.35)] bg-[rgba(250,247,242,0.8)] px-3 py-2 text-sm tracking-[0.08em] text-[rgba(60,42,18,0.82)] transition hover:bg-[rgba(138,109,65,0.08)] ${props.className || ""}`}
    />
  );
}

export function StatusPill({ label, tone = "neutral" }: { label: string; tone?: "neutral" | "ok" | "warn" | "muted" }) {
  const toneClass =
    tone === "ok"
      ? "bg-[rgba(61,92,71,0.15)] text-[rgba(26,46,30,0.95)] border-[rgba(61,92,71,0.4)]"
      : tone === "warn"
        ? "bg-[rgba(184,127,56,0.15)] text-[rgba(110,70,20,0.95)] border-[rgba(184,127,56,0.45)]"
        : tone === "muted"
          ? "bg-[rgba(120,105,82,0.14)] text-[rgba(76,62,41,0.9)] border-[rgba(120,105,82,0.35)]"
          : "bg-[rgba(138,109,65,0.12)] text-[rgba(76,53,22,0.9)] border-[rgba(138,109,65,0.3)]";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs tracking-[0.08em] ${toneClass}`}>
      {label}
    </span>
  );
}

export function TableWrap({ children }: { children: ReactNode }) {
  return <div className="overflow-x-auto rounded-xl border border-[rgba(138,109,65,0.18)]">{children}</div>;
}
