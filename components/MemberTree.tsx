"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { label: "修持天數", value: 28, unit: "天", color: "rgba(200,185,154" },
  { label: "定課完成", value: 340, unit: "次", color: "rgba(180,210,170" },
  { label: "善念回向", value: 92, unit: "則", color: "rgba(210,185,220" },
  { label: "願燈點亮", value: 15, unit: "盞", color: "rgba(220,200,150" },
];

function GlowingTree({ inView }: { inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex items-end justify-center"
      style={{ height: 280 }}
    >
      <svg
        viewBox="0 0 300 280"
        width="240"
        height="240"
        style={{
          animation: "treeGlow 3s ease-in-out infinite",
          overflow: "visible",
        }}
      >
        {/* Root glow */}
        <ellipse cx="150" cy="268" rx="50" ry="6"
          fill="rgba(100,180,120,0.08)"
          style={{ filter: "blur(4px)" }} />

        {/* Trunk */}
        <path
          d="M145 268 Q142 230 148 190 Q152 150 150 110"
          stroke="rgba(120,160,100,0.35)" strokeWidth="8" fill="none"
          strokeLinecap="round"
        />
        <path
          d="M155 268 Q158 232 152 192 Q148 152 150 110"
          stroke="rgba(100,140,80,0.25)" strokeWidth="5" fill="none"
          strokeLinecap="round"
        />

        {/* Branch 1 - left */}
        <path d="M148 200 Q120 175 95 155" stroke="rgba(120,160,100,0.3)" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M148 165 Q115 145 85 125" stroke="rgba(120,160,100,0.25)" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Branch 2 - right */}
        <path d="M152 195 Q178 170 205 152" stroke="rgba(120,160,100,0.3)" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M151 155 Q185 138 215 118" stroke="rgba(120,160,100,0.25)" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Sub branches */}
        <path d="M95 155 Q80 140 68 128" stroke="rgba(120,160,100,0.2)" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M95 155 Q90 138 88 122" stroke="rgba(120,160,100,0.2)" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M205 152 Q218 136 232 126" stroke="rgba(120,160,100,0.2)" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Leaf clusters - glowing circles */}
        {[
          [150, 60, 45], [100, 85, 35], [205, 85, 35],
          [70, 112, 25], [88, 100, 20], [215, 100, 22],
          [235, 112, 20], [130, 75, 22], [170, 72, 22],
          [60, 130, 15], [240, 124, 14], [150, 45, 18],
        ].map(([cx, cy, r], i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill={`rgba(${80 + i * 5}, ${160 + i * 3}, ${90 + i * 4}, 0.12)`}
            stroke={`rgba(120,180,100,${0.15 + (i % 3) * 0.05})`}
            strokeWidth="0.5"
            style={{ animation: `leafSway ${3 + i * 0.4}s ${i * 0.3}s ease-in-out infinite` }}
          />
        ))}

        {/* Light orbs on branches (善念) */}
        {[
          [95, 155], [80, 140], [205, 152], [215, 118],
          [150, 110], [115, 135], [185, 138], [150, 60],
          [70, 118], [235, 122], [150, 80],
        ].map(([cx, cy], i) => (
          <g key={`orb-${i}`}>
            <circle cx={cx} cy={cy} r="3"
              fill={`rgba(${200 + i * 3}, ${185 + i * 2}, 154, 0.7)`}
              style={{ animation: `particlePulse ${2 + i * 0.5}s ${i * 0.3}s ease-in-out infinite` }}
            />
            <circle cx={cx} cy={cy} r="6"
              fill="transparent"
              stroke={`rgba(200,185,154,${0.15 + (i % 3) * 0.05})`}
              strokeWidth="0.5"
              style={{ animation: `particlePulse ${2 + i * 0.5}s ${i * 0.3}s ease-in-out infinite` }}
            />
          </g>
        ))}
      </svg>

      {/* Ground glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-6 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(100,180,120,0.15) 0%, transparent 70%)",
          filter: "blur(6px)",
        }}
      />
    </motion.div>
  );
}

export default function MemberTree() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });

  return (
    <section
      id="member"
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-28"
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 55%, rgba(210,235,218,0.4) 0%, rgba(250,247,242,1) 60%)",
        }}
      />

      {/* Soft ground glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(60,120,70,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2 }}
          className="text-center mb-12"
        >
          <span className="text-[10px] tracking-[0.5em] text-[rgba(120,90,45,0.45)] uppercase">
            Practice Journey
          </span>
          <div className="divider-zen my-4" />
          <h2 className="font-serif-tc text-[clamp(1.8rem,4.5vw,2.8rem)] font-light tracking-[0.25em] text-gold-gradient">
            我的修行樹
          </h2>
          <p className="mt-4 text-[13px] tracking-[0.1em] text-[rgba(100,75,35,0.55)] leading-loose">
            定課越穩，心樹越茂盛
            <br />
            每一日的修持，都是根系向下扎實的力量
          </p>
        </motion.div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Tree */}
          <div className="flex-1 flex justify-center">
            <GlowingTree inView={inView} />
          </div>

          {/* Stats */}
          <div className="flex-1 w-full max-w-md">
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.9, delay: 0.15 * i + 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="card-zen p-5 text-center"
                >
                  <div
                    className="text-[1.8rem] font-light tracking-tight mb-1"
                    style={{
                      fontVariantNumeric: "tabular-nums",
                      color: `${stat.color},0.85)`,
                    }}
                  >
                    {stat.value}
                    <span className="text-[0.9rem] ml-0.5 opacity-60">{stat.unit}</span>
                  </div>
                  <div className="text-[11px] tracking-[0.18em] text-[rgba(120,90,45,0.55)]">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Progress rings */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.9 }}
              className="mt-6 card-zen p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-serif-tc text-[13px] tracking-[0.15em] text-[rgba(55,38,12,0.72)]">
                  本月修持進度
                </span>
                <span className="text-[11px] tracking-[0.15em] text-[rgba(120,90,45,0.55)]">
                  68%
                </span>
              </div>
              <div className="w-full h-px bg-[rgba(138,109,65,0.1)] mb-1">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={inView ? { width: "68%" } : {}}
                  transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                  className="h-full"
                  style={{
                    background: "linear-gradient(90deg, rgba(80,140,90,0.4), rgba(138,109,65,0.6))",
                  }}
                />
              </div>
              <p className="text-[11px] tracking-[0.06em] text-[rgba(100,75,35,0.45)] leading-relaxed mt-3">
                保持晨晚定課，心樹會在日常中長出更穩定的新葉。
              </p>
            </motion.div>

            {/* Join CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 1.1 }}
              className="mt-5 flex gap-3"
            >
              <a href="/practice-notebook" className="btn-zen flex-1 text-[13px] py-3 tracking-[0.15em]">
                進入我的修行簿
              </a>
              <a
                href="/join"
                className="btn-zen flex-1 text-[13px] py-3 tracking-[0.15em]"
                style={{ borderColor: "rgba(138,109,65,0.2)", background: "transparent" }}
              >
                新會員加入
              </a>
            </motion.div>
          </div>
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
