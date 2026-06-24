"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";

const WISDOM_QUOTES = [
  {
    text: "把呼吸放慢，心就有空間安住。",
    tags: ["調息", "安住", "回身"] as const,
  },
  {
    text: "願意回到當下，光就會重新聚攏。",
    tags: ["當下", "聚光", "覺知"] as const,
  },
  {
    text: "真正的平靜，不是沒有聲音，而是能聽見自己。",
    tags: ["聆聽", "寧靜", "誠實"] as const,
  },
  {
    text: "把善意留在每個念頭裡，日常自然生光。",
    tags: ["善念", "溫暖", "發願"] as const,
  },
] as const;

const PRACTICE_OVERVIEW = [
  { label: "晨起安住", value: "12 分鐘" },
  { label: "呼吸觀照", value: "108 次" },
  { label: "夜間回向", value: "5 分鐘" },
] as const;

const REFLECTION_PROMPTS = [
  "今天哪一刻，心最安定？",
  "哪個念頭值得放下？",
  "我想把哪一份善意帶給他人？",
] as const;

const AMBIENT_LIGHTS = [
  { left: "12%", top: "20%", size: 210, duration: 12, delay: 0.4 },
  { left: "82%", top: "16%", size: 240, duration: 14, delay: 1.1 },
  { left: "74%", top: "78%", size: 190, duration: 11, delay: 0.9 },
];

export default function DailyWisdom() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const reduceMotion = useReducedMotion();
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % WISDOM_QUOTES.length);
    }, 6200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section id="wisdom" ref={ref} className="relative overflow-hidden py-16 md:py-24">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(248,243,235,1) 0%, rgba(246,238,227,0.98) 48%, rgba(243,234,221,0.95) 100%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(138,109,65,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(138,109,65,0.08) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
        }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {AMBIENT_LIGHTS.map((light, idx) => (
          <motion.div
            key={idx}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: light.left,
              top: light.top,
              width: light.size,
              height: light.size,
              background:
                "radial-gradient(circle, rgba(188,153,92,0.18) 0%, rgba(188,153,92,0.06) 42%, rgba(188,153,92,0) 72%)",
              filter: "blur(2px)",
            }}
            animate={
              reduceMotion
                ? { opacity: 0.2 }
                : {
                    scale: [0.92, 1.06, 0.95],
                    opacity: [0.16, 0.3, 0.16],
                    x: [0, 12, -8, 0],
                    y: [0, -10, 8, 0],
                  }
            }
            transition={{
              duration: light.duration,
              delay: light.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 84% 18%, rgba(112,145,122,0.14) 0%, rgba(112,145,122,0.06) 36%, transparent 66%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-8 text-center md:mb-10"
        >
          <p className="mb-3 text-[11px] tracking-[0.42em] text-[rgba(104,77,42,0.72)]">DAILY WISDOM</p>
          <h2 className="font-serif-tc text-[clamp(1.75rem,4.4vw,2.8rem)] tracking-[0.18em] text-[rgba(79,57,26,0.92)]">
            今日心語
          </h2>
        </motion.div>

        <div className="space-y-5 lg:space-y-6">
          <motion.article
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, ease: "easeOut", delay: 0.06 }}
            className="relative overflow-hidden rounded-[2rem] border border-[rgba(129,100,61,0.2)] bg-[linear-gradient(140deg,rgba(255,253,248,0.88),rgba(248,239,227,0.7))] p-6 shadow-[0_22px_52px_rgba(89,63,30,0.14)] backdrop-blur-sm md:p-8"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.14]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 12% 16%, rgba(146,111,62,0.45) 1px, transparent 1.5px), radial-gradient(circle at 82% 74%, rgba(146,111,62,0.38) 1px, transparent 1.5px)",
                backgroundSize: "130px 130px, 150px 150px",
              }}
            />

            <div className="relative text-center">
              <div className="mb-6 flex items-center justify-center md:mb-7">
                <p className="text-[11px] tracking-[0.26em] text-[rgba(104,77,42,0.66)]">心語輪播</p>
              </div>

              <div className="pointer-events-none absolute left-4 top-3 text-[2rem] leading-none text-[rgba(120,92,52,0.18)] md:left-6 md:top-4">
                「
              </div>
              <div className="pointer-events-none absolute bottom-8 right-4 text-[2rem] leading-none text-[rgba(120,92,52,0.18)] md:bottom-9 md:right-6">
                」
              </div>

              <div className="flex min-h-[120px] items-center justify-center md:min-h-[140px]">
                <AnimatePresence mode="wait">
                  <motion.blockquote
                    key={quoteIndex}
                    initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -12, filter: "blur(3px)" }}
                    transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                    className="mx-auto max-w-5xl font-serif-tc text-[clamp(1.45rem,4vw,2.5rem)] leading-[1.65] tracking-[0.1em] text-[rgba(82,58,26,0.9)]"
                  >
                    「{WISDOM_QUOTES[quoteIndex].text}」
                  </motion.blockquote>
                </AnimatePresence>
              </div>

              <div className="mt-5 h-[2px] w-full overflow-hidden rounded-full bg-[rgba(138,109,65,0.16)]">
                <motion.div
                  key={`wisdom-progress-${quoteIndex}`}
                  className="h-full rounded-full bg-[linear-gradient(90deg,rgba(184,146,84,0.3),rgba(184,146,84,0.75))]"
                  initial={{ width: "0%", opacity: 0.95 }}
                  animate={{ width: "100%", opacity: 0.8 }}
                  transition={{ duration: 6.1, ease: "linear" }}
                />
              </div>

              <div className="mt-4 flex items-center justify-center gap-2">
                {WISDOM_QUOTES.map((_, idx) => (
                  <button
                    key={`quote-dot-${idx}`}
                    type="button"
                    aria-label={`切換心語 ${idx + 1}`}
                    onClick={() => setQuoteIndex(idx)}
                    className="h-2.5 w-2.5 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor:
                        idx === quoteIndex ? "rgba(160,122,64,0.9)" : "rgba(160,122,64,0.26)",
                      transform: idx === quoteIndex ? "scale(1.12)" : "scale(1)",
                    }}
                  />
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
                {WISDOM_QUOTES[quoteIndex].tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[rgba(136,106,62,0.2)] bg-[rgba(255,252,246,0.62)] px-3 py-1 text-[11px] tracking-[0.12em] text-[rgba(96,72,36,0.74)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>

          <div className="grid gap-4 md:gap-5 lg:grid-cols-2">
            <motion.article
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.13 }}
              className="h-full rounded-3xl border border-[rgba(129,100,61,0.16)] bg-[rgba(255,252,246,0.72)] p-5 shadow-[0_15px_34px_rgba(89,63,30,0.1)]"
            >
              <p className="text-[11px] tracking-[0.24em] text-[rgba(102,75,39,0.7)]">今日練習提要</p>
              <div className="mt-4 space-y-2.5">
                {PRACTICE_OVERVIEW.map((item, idx) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-xl border border-[rgba(132,102,61,0.14)] bg-[rgba(255,252,247,0.54)] px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[rgba(137,107,61,0.16)] text-[11px] text-[rgba(88,62,30,0.85)]">
                        {idx + 1}
                      </span>
                      <p className="text-[13px] tracking-[0.06em] text-[rgba(72,50,21,0.88)]">{item.label}</p>
                    </div>
                    <span className="text-[12px] tracking-[0.08em] text-[rgba(92,68,34,0.74)]">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.22 }}
              className="h-full rounded-3xl border border-[rgba(129,100,61,0.16)] bg-[rgba(255,252,246,0.72)] p-5 shadow-[0_15px_34px_rgba(89,63,30,0.1)]"
            >
              <p className="text-[11px] tracking-[0.24em] text-[rgba(102,75,39,0.7)]">晚間自問</p>
              <div className="mt-4 space-y-2.5">
                {REFLECTION_PROMPTS.map((item, idx) => (
                  <div
                    key={item}
                    className="flex items-center gap-2.5 rounded-xl border border-[rgba(132,102,61,0.14)] bg-[rgba(255,252,247,0.54)] px-3 py-2.5"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[rgba(137,107,61,0.16)] text-[11px] text-[rgba(88,62,30,0.85)]">
                      {idx + 1}
                    </span>
                    <p className="text-[13px] tracking-[0.06em] text-[rgba(72,50,21,0.88)]">{item}</p>
                  </div>
                ))}
              </div>
            </motion.article>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-20"
        style={{ background: "linear-gradient(to bottom, rgba(246,238,227,0), rgba(246,238,227,1))" }}
      />
    </section>
  );
}
