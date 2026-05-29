"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const BLESS_PARTICLES = Array.from({ length: 15 }, (_, i) => ({
  left: `${(i * 6.7) % 100}%`,
  bottom: `${(i * 4.67) % 70}%`,
  size: `${1 + (i % 3)}px`,
}));

const services = [
  { id: 1, icon: "◈", title: "線上祈福", desc: "虔誠一念，發送心中最深的祝願與祈禱" },
  { id: 2, icon: "◇", title: "法會資訊", desc: "定期舉辦各式法會，廣結善緣，積累福德" },
  { id: 3, icon: "○", title: "清明追思", desc: "傳承孝道，寄托思念，讓愛永遠長存" },
  { id: 4, icon: "✦", title: "誦經回向", desc: "以誦經功德，迴向給所有需要的眾生" },
  { id: 5, icon: "◈", title: "光明祝願", desc: "點亮心燈，以智慧光明照耀您的人生之路" },
  { id: 6, icon: "◇", title: "善念紀錄", desc: "記錄每一個善念，讓愛與光持續累積" },
];

function IncenseSmoke() {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-[62%] flex gap-8 pointer-events-none">
      {[0, 1, 2].map((i) => (
        <div key={i} className="relative w-1 h-24">
          {/* Stick */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-16 opacity-30"
            style={{ background: "linear-gradient(to top, rgba(180,140,80,0.6), transparent)" }}
          />
          {/* Smoke strands */}
          {[0, 1].map((j) => (
            <div
              key={j}
              className="absolute bottom-14 left-1/2 -translate-x-1/2 w-1 h-10 rounded-full opacity-60"
              style={{
                background: "radial-gradient(ellipse at 50% 80%, rgba(200,190,170,0.3) 0%, transparent 100%)",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Blessings() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      id="blessing"
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-28"
    >
      {/* Background - temple silhouette hint */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(215,235,220,0.35) 0%, rgba(250,247,242,1) 60%)",
        }}
      />

      {/* Faint architecture silhouette */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none" style={{ opacity: 0.06 }}>
        <svg viewBox="0 0 800 300" className="w-full max-w-2xl" preserveAspectRatio="xMidYMax meet">
          {/* Main hall */}
          <rect x="280" y="100" width="240" height="180" fill="rgba(200,185,154,1)" />
          <polygon points="280,100 400,20 520,100" fill="rgba(200,185,154,1)" />
          {/* Side wings */}
          <rect x="160" y="160" width="120" height="120" fill="rgba(200,185,154,0.7)" />
          <polygon points="160,160 220,110 280,160" fill="rgba(200,185,154,0.7)" />
          <rect x="520" y="160" width="120" height="120" fill="rgba(200,185,154,0.7)" />
          <polygon points="520,160 580,110 640,160" fill="rgba(200,185,154,0.7)" />
          {/* Columns hint */}
          {[310, 350, 390, 430, 470].map((x) => (
            <rect key={x} x={x} y="160" width="6" height="120" fill="rgba(200,185,154,0.5)" />
          ))}
        </svg>
      </div>

      {/* Gold particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {BLESS_PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: p.left,
              bottom: p.bottom,
              width: p.size,
              height: p.size,
              background: "rgba(138,109,65,0.45)",
              opacity: 0.24,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Incense smoke decoration */}
      <IncenseSmoke />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2 }}
          className="text-center mb-16"
        >
          <span className="text-[10px] tracking-[0.5em] text-[rgba(120,90,45,0.45)] uppercase">
            Blessings & Prayer
          </span>
          <div className="divider-zen my-4" />
          <h2 className="font-serif-tc text-[clamp(1.8rem,4.5vw,2.8rem)] font-light tracking-[0.25em] text-gold-gradient">
            光林祈願
          </h2>
          <p className="mt-4 text-[13px] tracking-[0.1em] text-[rgba(100,75,35,0.55)] leading-loose max-w-md mx-auto">
            不是宗教的束縛，而是生命的祝福
            <br />
            在這裡，每一份心意都被輕柔地承接
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative p-2 md:p-3 mb-10"
        >
          <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[rgba(138,109,65,0.18)] to-transparent pointer-events-none hidden md:block" />
          <p className="text-[10px] tracking-[0.34em] uppercase text-[rgba(120,90,45,0.45)] mb-4 text-center">
            Prayer Flow
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              "立願：安住當下，確認你想護念的人事物",
              "點燈：選擇祈願形式，讓心意有具體承接",
              "回向：將善念回向家人與眾生，願福慧增長",
            ].map((item, i) => (
                <div key={item} className="relative border border-[rgba(138,109,65,0.12)] bg-[rgba(252,248,242,0.68)] backdrop-blur-sm px-4 py-3 md:py-4">
                <p className="font-serif-tc text-[11px] tracking-[0.16em] text-[rgba(70,50,20,0.82)] mb-1">0{i + 1}</p>
                <p className="text-[12px] tracking-[0.05em] text-[rgba(100,75,35,0.55)] leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Service grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => setHovered(service.id)}
              onMouseLeave={() => setHovered(null)}
              className="relative px-5 py-5 md:px-6 md:py-6 cursor-default group border-l border-[rgba(138,109,65,0.2)] bg-gradient-to-r from-[rgba(252,248,242,0.6)] to-transparent"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="text-[18px] transition-colors duration-400"
                    style={{
                      color: hovered === service.id ? "rgba(138,109,65,0.85)" : "rgba(138,109,65,0.35)",
                    }}
                  >
                    {service.icon}
                  </span>
                  <h3 className="font-serif-tc text-[15px] tracking-[0.18em] text-[rgba(55,38,12,0.82)] group-hover:text-[rgba(100,72,28,1)] transition-colors duration-400">
                    {service.title}
                  </h3>
                </div>
                <div
                  className="w-8 h-px transition-all duration-500 group-hover:w-16"
                  style={{
                    background: "linear-gradient(90deg, rgba(138,109,65,0.4), transparent)",
                  }}
                />
                <p className="text-[12px] tracking-[0.06em] text-[rgba(100,75,35,0.52)] leading-relaxed">
                  {service.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-12 flex justify-center"
        >
          <a href="/qinian-hall" className="btn-zen text-[13px] px-10 py-3.5 tracking-[0.2em]">
            進入祈願殿
          </a>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(250,247,242,1))" }}
      />
    </section>
  );
}
