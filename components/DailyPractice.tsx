"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const tasks = [
  {
    id: 1,
    icon: "✦",
    label: "感恩一件事",
    desc: "寫下今天最感恩的一件小事，安住心念。",
  },
  {
    id: 2,
    icon: "◇",
    label: "說一句善語",
    desc: "向自己或身邊的人說一句溫柔善語。",
  },
  {
    id: 3,
    icon: "○",
    label: "靜心五分鐘",
    desc: "閉眼觀息五分鐘，讓念頭回到當下。",
  },
  {
    id: 4,
    icon: "◈",
    label: "為家人祝福",
    desc: "默念祝福，願家人平安、身心安穩。",
  },
];

function MiniLotus({ bloom }: { bloom: boolean }) {
  return (
    <AnimatePresence>
      {bloom && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -10 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -top-8 left-1/2 -translate-x-1/2"
        >
          <svg width="32" height="32" viewBox="0 0 100 100" fill="none"
            style={{ animation: "lotusGlow 2s ease-in-out infinite" }}>
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <ellipse
                key={i}
                cx="50"
                cy="30"
                rx="8"
                ry="15"
                transform={`rotate(${deg}, 50, 50)`}
                fill="rgba(200,185,154,0.25)"
                stroke="rgba(200,185,154,0.6)"
                strokeWidth="0.8"
              />
            ))}
            <circle cx="50" cy="50" r="6" fill="rgba(212,185,120,0.7)" />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function DailyPractice() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const toggle = (id: number) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allDone = completed.size === tasks.length;

  return (
    <section
      id="practice"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-28"
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 40% 55%, rgba(210,235,218,0.4) 0%, rgba(250,247,242,1) 65%)",
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <span className="text-[10px] tracking-[0.5em] text-[rgba(120,90,45,0.45)] uppercase">
            Daily Practice
          </span>
          <div className="divider-zen my-4" />
          <h2 className="font-serif-tc text-[clamp(1.8rem,4.5vw,2.8rem)] font-light tracking-[0.25em] text-gold-gradient">
            日日修心
          </h2>
          <p className="mt-4 text-[13px] tracking-[0.12em] text-[rgba(100,75,35,0.55)] leading-loose">
            每一個微小修持，都是照見自心的功課
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
        {/* Task cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          {tasks.map((task, i) => {
            const done = completed.has(task.id);
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.15 * i, ease: [0.22, 1, 0.36, 1] }}
                className="relative h-full"
              >
                <MiniLotus bloom={done} />
                <button
                  onClick={() => toggle(task.id)}
                  className={`w-full h-full min-h-[132px] p-4 transition-all duration-500 group border-l border-[rgba(138,109,65,0.22)] bg-gradient-to-r from-[rgba(252,248,242,0.72)] to-transparent ${
                    done
                      ? "border-[rgba(138,109,65,0.35)] bg-[linear-gradient(90deg,rgba(220,240,222,0.62),rgba(252,248,242,0.2))]"
                      : ""
                  }`}
                >
                  {/* Check indicator */}
                  <div className="flex flex-col items-center justify-center text-center gap-2 h-full">
                    <div
                      className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-400 ${
                        done
                          ? "border-[rgba(138,109,65,0.7)] bg-[rgba(200,175,130,0.18)]"
                          : "border-[rgba(138,109,65,0.22)] bg-transparent"
                      }`}
                    >
                      {done && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-[rgba(100,72,28,0.9)] text-[10px] leading-none"
                        >
                          ✓
                        </motion.span>
                      )}
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex items-center justify-center gap-2 mb-1.5">
                        <span className="text-[rgba(138,109,65,0.45)] text-[11px]">{task.icon}</span>
                        <h3
                          className={`font-serif-tc text-[15px] tracking-[0.15em] transition-colors duration-400 ${
                            done ? "text-[rgba(100,72,28,0.88)]" : "text-[rgba(50,36,12,0.78)]"
                          }`}
                        >
                          {task.label}
                        </h3>
                      </div>
                      <p className="text-[12px] tracking-[0.05em] text-[rgba(100,75,35,0.5)] leading-relaxed">
                        {task.desc}
                      </p>
                    </div>
                  </div>

                  {/* Completion glow */}
                  {done && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: "radial-gradient(ellipse at 20% 50%, rgba(138,109,65,0.05) 0%, transparent 70%)",
                      }}
                    />
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Progress + Completion message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="flex flex-col items-center"
        >
          {/* Progress bar */}
          <div className="w-full max-w-xs h-px bg-[rgba(138,109,65,0.1)] mb-2">
            <motion.div
              className="h-full bg-gradient-to-r from-[rgba(138,109,65,0.3)] to-[rgba(138,109,65,0.7)]"
              initial={{ width: "0%" }}
              animate={{ width: `${(completed.size / tasks.length) * 100}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <p className="text-[11px] tracking-[0.25em] text-[rgba(120,90,45,0.5)]">
            {completed.size} / {tasks.length} 已完成
          </p>

          {/* All done message */}
          <AnimatePresence>
            {allDone && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 text-center"
              >
                <div className="divider-zen mb-4" />
                <p className="font-serif-tc text-[1.1rem] tracking-[0.2em] text-gold-gradient leading-loose">
                  今日修持圓滿
                </p>
                <p className="text-[12px] tracking-[0.15em] text-[rgba(100,75,35,0.5)] mt-2">
                  一念清淨，功德回向十方
                </p>
                <motion.div
                  className="mt-4 flex justify-center"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg width="40" height="40" viewBox="0 0 100 100" fill="none"
                    style={{ animation: "lotusGlow 2s ease-in-out infinite" }}>
                    {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((deg, i) => (
                      <ellipse
                        key={i}
                        cx="50"
                        cy="28"
                        rx="7"
                        ry="16"
                        transform={`rotate(${deg}, 50, 50)`}
                        fill="rgba(200,185,154,0.2)"
                        stroke="rgba(200,185,154,0.7)"
                        strokeWidth="0.6"
                      />
                    ))}
                    <circle cx="50" cy="50" r="6" fill="rgba(230,210,140,0.8)" />
                  </svg>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 14 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.25, ease: "easeOut" }}
            className="lg:col-span-4"
          >
            <div className="p-6 md:p-7 border border-[rgba(138,109,65,0.16)] bg-[rgba(252,248,242,0.6)] backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[rgba(120,90,45,0.48)] mb-5">
                Practice Rhythm
              </p>
              <div className="space-y-4">
                {[
                  "晨課：觀息 10 分鐘，立今日願心",
                  "日課：一語止躁，行一件善行",
                  "晚課：記錄感恩，回向家人眾生",
                ].map((line, i) => (
                  <div key={line} className="pb-4 border-b last:border-0 border-[rgba(138,109,65,0.1)]">
                    <span className="font-serif-tc text-[12px] tracking-[0.14em] text-[rgba(70,50,20,0.82)]">
                      0{i + 1}
                    </span>
                    <p className="mt-1 text-[12px] tracking-[0.06em] text-[rgba(100,75,35,0.56)] leading-relaxed">
                      {line}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(250,247,242,1))" }}
      />
    </section>
  );
}
