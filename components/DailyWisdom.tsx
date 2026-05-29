"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";

const WISDOM_QUOTES = [
  "一念清淨，自有光明。",
  "每一刻都是新的開始。",
  "光從內心而生。",
  "心若安定，處處皆是光明。",
  "內心的平靜，是最深的祝福。",
  "善念如光，照亮自己也溫暖他人。",
  "放下執著，才能擁抱當下。",
  "靜心聆聽，生命自會低語。",
] as const;

const WISDOM_PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  left: `${4 + (i * 4.6) % 92}%`,
  top: `${8 + (i * 3.8) % 80}%`,
  size: 1.5 + (i % 4),
  duration: 6 + (i % 7),
  delay: ((i * 17) % 90) / 10,
  driftX: -18 + (i * 5.7) % 36,
  driftY: -16 + (i * 4.9) % 32,
}));

const HALOS = [
  { left: "14%", top: "24%", size: 170, dur: 6.2, delay: 0.3 },
  { left: "76%", top: "30%", size: 220, dur: 8.4, delay: 1.4 },
  { left: "40%", top: "64%", size: 190, dur: 7.1, delay: 2.1 },
  { left: "72%", top: "72%", size: 150, dur: 5.9, delay: 2.8 },
];

const MIST_LAYERS = [
  { left: "-8%", top: "6%", width: "42%", height: "36%", dur: 16, drift: 36, delay: 0 },
  { left: "58%", top: "18%", width: "40%", height: "34%", dur: 20, drift: 28, delay: 1.2 },
  { left: "16%", top: "58%", width: "48%", height: "30%", dur: 18, drift: 32, delay: 2.3 },
];

const RIPPLE_RINGS = [120, 200, 280];

export default function DailyWisdom() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const reduceMotion = useReducedMotion();
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % WISDOM_QUOTES.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section
      id="wisdom"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-24 md:py-32"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 10% 0%, rgba(204,226,212,0.45) 0%, rgba(250,247,242,1) 58%), radial-gradient(100% 78% at 100% 100%, rgba(213,231,216,0.26) 0%, rgba(250,247,242,0.1) 70%)",
        }}
      />

      <div className="absolute inset-0 pointer-events-none opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(138,109,65,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(138,109,65,0.08) 1px, transparent 1px)",
          backgroundSize: "58px 58px",
          maskImage:
            "radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.15) 68%, transparent 100%)",
        }}
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {MIST_LAYERS.map((mist, i) => (
          <motion.div
            key={`mist-${i}`}
            className="absolute rounded-full"
            style={{
              left: mist.left,
              top: mist.top,
              width: mist.width,
              height: mist.height,
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(223,237,227,0.42) 0%, rgba(223,237,227,0.22) 42%, rgba(223,237,227,0) 75%)",
              filter: "blur(22px)",
            }}
            animate={
              reduceMotion
                ? { opacity: 0.45 }
                : {
                    x: [0, mist.drift, -mist.drift * 0.6, 0],
                    y: [0, -mist.drift * 0.28, mist.drift * 0.2, 0],
                    opacity: [0.36, 0.54, 0.4, 0.36],
                    scale: [1, 1.05, 0.97, 1],
                  }
            }
            transition={{
              duration: mist.dur,
              delay: mist.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {WISDOM_PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              background:
                "radial-gradient(circle, rgba(239,226,190,0.9) 0%, rgba(191,164,112,0.4) 55%, transparent 100%)",
              boxShadow: "0 0 14px rgba(227,205,150,0.28)",
            }}
            animate={
              reduceMotion
                ? { opacity: 0.3 }
                : {
                    x: [0, p.driftX, -p.driftX * 0.6, p.driftX * 0.35, 0],
                    y: [0, -p.driftY, p.driftY * 0.4, -p.driftY * 0.6, 0],
                    opacity: [0.14, 0.62, 0.2, 0.55, 0.14],
                    scale: [0.85, 1.2, 0.9, 1.05, 0.85],
                  }
            }
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        className="absolute -left-[20%] top-[30%] w-[70%] h-[20%] pointer-events-none"
        style={{
          background:
            "linear-gradient(112deg, rgba(255,255,255,0), rgba(255,245,217,0.28), rgba(255,255,255,0))",
          filter: "blur(12px)",
          transform: "rotate(-6deg)",
        }}
        animate={reduceMotion ? { opacity: 0.2 } : { x: ["-14%", "18%", "-14%"], opacity: [0.08, 0.34, 0.08] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {HALOS.map((halo, index) => (
          <motion.div
            key={index}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: halo.left,
              top: halo.top,
              width: halo.size,
              height: halo.size,
              border: "1px solid rgba(201,175,120,0.22)",
              boxShadow: "inset 0 0 0 18px rgba(201,175,120,0.04)",
              filter: "blur(0.2px)",
            }}
            animate={{
              opacity: [0.05, 0.2, 0.06],
              scale: [0.88, 1.12, 0.92],
            }}
            transition={{
              duration: halo.dur,
              delay: halo.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {RIPPLE_RINGS.map((ring, i) => (
          <motion.div
            key={`ring-${ring}`}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: ring,
              height: ring,
              border: "1px solid rgba(199,171,114,0.18)",
            }}
            animate={
              reduceMotion
                ? { opacity: 0.08 }
                : {
                    scale: [0.88, 1.22],
                    opacity: [0.16, 0],
                  }
            }
            transition={{
              duration: 6.4 + i * 1.2,
              delay: i * 1.35,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6">
        <div className="p-4 md:p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 16% 22%, rgba(138,109,65,0.25) 0.8px, transparent 1.2px), radial-gradient(circle at 78% 68%, rgba(138,109,65,0.2) 0.8px, transparent 1.2px)",
              backgroundSize: "140px 140px, 160px 160px",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="mb-8 md:mb-10"
          >
            <h2 className="font-serif-tc text-[clamp(1.6rem,4vw,2.4rem)] tracking-[0.28em] text-[rgba(85,67,38,0.78)]">
              今日心語
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="relative mx-auto min-h-[148px] md:min-h-[170px] max-w-3xl flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={quoteIndex}
                initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif-tc text-[clamp(1.5rem,4.5vw,2.5rem)] font-light tracking-[0.2em] leading-[1.9] text-[rgba(96,72,36,0.86)]"
              >
                <span>「</span>
                {Array.from(WISDOM_QUOTES[quoteIndex]).map((char, index) => (
                  <motion.span
                    key={`${quoteIndex}-${index}-${char}`}
                    className="inline-block"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.04 * index, ease: "easeOut" }}
                  >
                    {char}
                  </motion.span>
                ))}
                <span>」</span>
              </motion.blockquote>
            </AnimatePresence>
          </motion.div>

          <div className="mx-auto mt-1 mb-2 h-[2px] w-[160px] rounded-full bg-[rgba(138,109,65,0.14)] overflow-hidden">
            <motion.div
              key={`progress-${quoteIndex}`}
              className="h-full rounded-full bg-[rgba(188,154,95,0.5)]"
              initial={{ width: "0%", opacity: 0.9 }}
              animate={{ width: "100%", opacity: 0.75 }}
              transition={{ duration: 4.8, ease: "linear" }}
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.35, ease: "easeOut" }}
            className="mt-8 md:mt-10 text-[clamp(0.95rem,2.1vw,1.12rem)] tracking-[0.12em] text-[rgba(96,72,36,0.64)]"
          >
            讓 <span className="font-medium text-[rgba(96,72,36,0.8)]">心慢下來</span>{" "}
            <span className="font-medium text-[rgba(96,72,36,0.8)]">呼吸變穩</span>{" "}
            <span className="font-medium text-[rgba(96,72,36,0.8)]">世界安靜</span>{" "}
            <span className="font-medium text-[rgba(96,72,36,0.8)]">內在被安放</span>
          </motion.p>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(250,247,242,1))" }}
      />
    </section>
  );
}
