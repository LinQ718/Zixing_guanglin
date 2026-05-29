"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

const CORE_VALUES = [
  {
    title: "日日一念",
    desc: "用一段静心时间，把散乱收回，把注意力还给当下。",
    tag: "Meditation",
  },
  {
    title: "善愿同行",
    desc: "写下今日愿心，让祝福从一句话开始，慢慢照亮生活。",
    tag: "Blessing",
  },
  {
    title: "修心有路",
    desc: "从简单练习累计内在稳定，建立属于你的温柔节奏。",
    tag: "Practice",
  },
];

const DAILY_FLOW = [
  { step: "01", text: "读一句今日心语" },
  { step: "02", text: "完成一项修心小练习" },
  { step: "03", text: "写下一则善念纪录" },
];

const PRACTICE_RHYTHM = [
  { label: "晨課", hint: "觀息 10 分鐘" },
  { label: "日課", hint: "善語一則" },
  { label: "晚課", hint: "回向與感恩" },
];

const LEAVES = [
  { id: 1, left: "12%", size: 9, duration: 13, drift: 45 },
  { id: 2, left: "20%", size: 7, duration: 11, drift: 38 },
  { id: 3, left: "28%", size: 10, duration: 14, drift: 52 },
  { id: 4, left: "36%", size: 6, duration: 10, drift: 35 },
  { id: 5, left: "44%", size: 8, duration: 12, drift: 42 },
  { id: 6, left: "56%", size: 9, duration: 13, drift: 46 },
  { id: 7, left: "64%", size: 7, duration: 11, drift: 37 },
  { id: 8, left: "72%", size: 10, duration: 14, drift: 50 },
  { id: 9, left: "82%", size: 8, duration: 12, drift: 41 },
];

function FallingLeaves() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
      {LEAVES.map((leaf) => (
        <motion.span
          key={leaf.id}
          className="absolute rounded-[45%_55%_50%_50%]"
          style={{
            left: leaf.left,
            top: "-6%",
            width: leaf.size,
            height: leaf.size * 1.35,
            background:
              "linear-gradient(165deg, rgba(185,158,110,0.42), rgba(135,168,120,0.26))",
            boxShadow: "0 0 8px rgba(138,109,65,0.12)",
          }}
          animate={{
            y: ["-10%", "112%"],
            x: [0, leaf.drift, -leaf.drift * 0.35, leaf.drift * 0.22],
            rotate: [0, 35, -20, 12],
            opacity: [0, 0.7, 0.55, 0],
          }}
          transition={{
            duration: leaf.duration,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
}

export default function HeroSection() {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const parallaxX = useSpring(pointerX, { stiffness: 60, damping: 18 });
  const parallaxY = useSpring(pointerY, { stiffness: 60, damping: 18 });
  const parallaxXSoft = useSpring(pointerX, { stiffness: 50, damping: 20 });
  const parallaxYSoft = useSpring(pointerY, { stiffness: 50, damping: 20 });

  const handleMove = (event: React.MouseEvent<HTMLElement>) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    pointerX.set((x / rect.width) * 16);
    pointerY.set((y / rect.height) * 12);
  };

  const resetParallax = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28"
      onMouseMove={handleMove}
      onMouseLeave={resetParallax}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 10% 0%, rgba(204,226,212,0.45) 0%, rgba(250,247,242,1) 55%), radial-gradient(100% 80% at 100% 100%, rgba(229,213,179,0.24) 0%, rgba(250,247,242,0) 65%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.16] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(138,109,65,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(138,109,65,0.08) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 65%, transparent 100%)",
        }}
      />

      <motion.div
        className="absolute -left-[20%] top-[28%] w-[70%] h-[22%] pointer-events-none"
        style={{
          background:
            "linear-gradient(110deg, rgba(255,255,255,0), rgba(255,244,214,0.32), rgba(255,255,255,0))",
          filter: "blur(12px)",
          transform: "rotate(-8deg)",
          x: parallaxX,
          y: parallaxY,
        }}
        animate={reduceMotion ? undefined : { x: ["-8%", "12%", "-8%"] }}
        transition={{ duration: 14, ease: "easeInOut", repeat: Infinity }}
      />

      <motion.div
        className="absolute -right-[12%] top-[8%] w-[42vw] h-[42vw] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,243,214,0.24) 0%, rgba(255,243,214,0) 70%)",
          filter: "blur(10px)",
          x: parallaxXSoft,
          y: parallaxYSoft,
        }}
        animate={reduceMotion ? undefined : { scale: [1, 1.03, 1] }}
        transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
      />

      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 18%, rgba(138,109,65,0.18) 0.7px, transparent 0.9px), radial-gradient(circle at 74% 38%, rgba(138,109,65,0.16) 0.7px, transparent 1px), radial-gradient(circle at 58% 74%, rgba(138,109,65,0.14) 0.6px, transparent 0.9px)",
          backgroundSize: "120px 120px, 180px 180px, 150px 150px",
        }}
      />

      <div
        className="absolute right-[6%] top-[18%] w-[180px] h-[180px] rounded-full pointer-events-none opacity-[0.16]"
        style={{
          border: "1px solid rgba(138,109,65,0.22)",
          boxShadow: "inset 0 0 0 16px rgba(138,109,65,0.02)",
        }}
      />

      <div
        className="absolute left-[8%] bottom-[18%] w-[220px] h-[80px] pointer-events-none opacity-[0.1]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(138,109,65,0.28), rgba(138,109,65,0) 70%)",
          filter: "blur(10px)",
        }}
      />

      <FallingLeaves />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <span className="h-px w-10 bg-[rgba(138,109,65,0.35)]" />
              <span className="text-[11px] tracking-[0.45em] uppercase text-[rgba(120,90,45,0.58)]">
                Zixing Guanglin
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.82, ease: "easeOut" }}
              className="font-serif-tc text-[clamp(2rem,5.5vw,4rem)] leading-[1.35] tracking-[0.16em] text-gold-gradient"
            >
              讓心慢下來，
              <br />
              把光留在日常裡。
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
              className="mt-7 max-w-2xl text-[clamp(0.95rem,2vw,1.1rem)] leading-8 tracking-[0.08em] text-[rgba(60,45,20,0.72)]"
            >
              在纷扰世界里，我们以静心、祝福与修心练习，
              陪你重建稳定、温柔而清明的内在秩序。
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mt-7 flex flex-wrap items-center gap-3"
            >
              {PRACTICE_RHYTHM.map((item) => (
                <div
                  key={item.label}
                  className="px-4 py-2 rounded-full border border-[rgba(138,109,65,0.2)] bg-[rgba(252,248,242,0.55)] backdrop-blur-sm"
                >
                  <span className="font-serif-tc text-[12px] tracking-[0.14em] text-[rgba(70,52,22,0.8)]">
                    {item.label}
                  </span>
                  <span className="mx-2 text-[rgba(138,109,65,0.35)]">·</span>
                  <span className="text-[11px] tracking-[0.08em] text-[rgba(100,75,35,0.62)]">
                    {item.hint}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <a href="/#practice" className="btn-zen text-[13px] px-8 py-3 tracking-[0.2em] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[rgba(138,109,65,0.6)]" />
                开始今日修心
              </a>
              <a
                href="/#blessing"
                className="btn-zen text-[13px] px-8 py-3 tracking-[0.2em] flex items-center gap-2"
                style={{
                  background: "rgba(44,30,12,0.03)",
                  borderColor: "rgba(138,109,65,0.22)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[rgba(138,109,65,0.35)]" />
                进入善愿点灯
              </a>
            </motion.div>
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="lg:col-span-5 relative"
          >
            <motion.div
              className="card-zen rounded-2xl p-6 md:p-7 border-[rgba(138,109,65,0.18)] relative z-10 overflow-hidden"
              animate={
                reduceMotion
                  ? undefined
                  : {
                      boxShadow: [
                        "0 8px 30px rgba(138,109,65,0.06)",
                        "0 12px 40px rgba(138,109,65,0.12)",
                        "0 8px 30px rgba(138,109,65,0.06)",
                      ],
                      borderColor: [
                        "rgba(138,109,65,0.18)",
                        "rgba(138,109,65,0.34)",
                        "rgba(138,109,65,0.18)",
                      ],
                    }
              }
              transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
            >
              <div
                className="absolute right-4 bottom-3 text-[36px] leading-none font-serif-tc text-[rgba(138,109,65,0.06)]"
                aria-hidden="true"
              >
                禪
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5 pr-2">
                  <p className="text-[10px] uppercase tracking-[0.38em] text-[rgba(120,90,45,0.5)]">
                    Today Flow
                  </p>
                  <span className="text-[10px] tracking-[0.15em] text-[rgba(120,90,45,0.45)]">
                    每日定課
                  </span>
                </div>

                <div className="space-y-4">
                  {DAILY_FLOW.map((item) => (
                    <motion.div
                      key={item.step}
                      className="flex items-start gap-4 pb-4 border-b last:border-0 border-[rgba(138,109,65,0.12)]"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, ease: "easeOut" }}
                    >
                      <span className="font-serif-tc text-[15px] tracking-[0.18em] text-[rgba(120,90,45,0.7)] w-8">
                        {item.step}
                      </span>
                      <p className="text-[14px] leading-7 tracking-[0.04em] text-[rgba(55,40,14,0.74)]">
                        {item.text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.aside>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {CORE_VALUES.map((item, index) => (
            <motion.article
              key={item.title}
              className="card-zen rounded-2xl p-6 md:p-7 relative overflow-hidden"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              whileHover={{ y: -4 }}
            >
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(138,109,65,0.35), transparent)",
                }}
              />
              <p className="text-[10px] uppercase tracking-[0.35em] text-[rgba(120,90,45,0.48)] mb-3">
                {item.tag}
              </p>
              <h3 className="font-serif-tc text-[1.25rem] tracking-[0.12em] text-[rgba(65,45,18,0.88)] mb-3">
                {item.title}
              </h3>
              <p className="text-[14px] leading-7 tracking-[0.04em] text-[rgba(70,55,30,0.72)]">
                {item.desc}
              </p>
              <span className="absolute right-5 bottom-4 text-[40px] leading-none text-[rgba(138,109,65,0.08)] font-serif-tc">
                {index + 1}
              </span>
            </motion.article>
          ))}
        </motion.div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(250,247,242,0), rgba(250,247,242,0.96) 78%)",
        }}
      />
    </section>
  );
}
