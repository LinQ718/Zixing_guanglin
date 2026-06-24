"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import Image from "next/image";
import lanternSeaBackground from "./Logo/lantern Sea.png";
import lanternSeaModalBackground from "./Logo/Lantern Sea2.png";
import lanternImage from "./Logo/lantern.png";

type Lamp = {
  id: string;
  name: string;
  description: string;
};

type LampCategory = {
  id: string;
  title: string;
  lamps: Lamp[];
};

type LightingState = "idle" | "confirming" | "lighting" | "completed";

type LitLantern = {
  key: string;
  lampName: string;
  wish: string;
};

type LanternLayout = {
  x: number;
  y: number;
  scale: number;
};

const LAMP_CATEGORIES: LampCategory[] = [
  {
    id: "peace-guard",
    title: "平安守護",
    lamps: [
      { id: "peace-lamp", name: "平安燈", description: "願您與家人日日平安、生活順心，幸福常伴左右" },
      { id: "tai-sui-lamp", name: "太歲燈", description: "願新的一年平安順心，大小事情都能逢凶化吉、順利安穩" },
      { id: "disaster-relief-lamp", name: "消災燈", description: "願煩憂漸漸遠離、生活更加安定，平安喜樂常相伴" },
      { id: "longevity-lamp", name: "延壽燈", description: "願身心輕安自在、精神飽滿，日日健康有活力" },
      { id: "health-lamp", name: "健康燈", description: "願身體平衡安康、心情愉快，每天都充滿元氣" },
    ],
  },
  {
    id: "wisdom-study",
    title: "智慧學業",
    lamps: [
      { id: "wenchang-lamp", name: "文昌燈", description: "願學習更加順利、思緒清晰，考試與目標都能有好成果" },
      { id: "wisdom-lamp", name: "智慧燈", description: "願內心更加清明、有力量，做每個決定都更有智慧" },
      { id: "top-scholar-lamp", name: "狀元燈", description: "願努力都被看見、一步一步達成理想，迎向美好未來" },
    ],
  },
  {
    id: "fortune-career",
    title: "財富事業",
    lamps: [
      { id: "light-lamp", name: "光明燈", description: "願前路光亮順遂、工作事業穩步向前，迎來更多好機會" },
      { id: "wealth-god-lamp", name: "財神燈", description: "願財運漸漸豐盛、收入穩定增長，生活富足安心" },
      { id: "career-lamp", name: "事業燈", description: "願工作順利穩定、貴人相助，朝著理想一步步前進" },
      { id: "fortune-attract-lamp", name: "招財燈", description: "願財氣與好運慢慢匯聚，生活越來越豐盛踏實" },
    ],
  },
  {
    id: "kind-connections",
    title: "人際善緣",
    lamps: [
      { id: "mentor-lamp", name: "貴人燈", description: "願一路遇見善良的人，在需要時總有人陪伴與幫助" },
      { id: "relationship-lamp", name: "姻緣燈", description: "願遇見真心相待的人，收穫溫暖幸福的緣分" },
      { id: "harmony-lamp", name: "和合燈", description: "願家人朋友彼此理解包容，關係更加和睦溫暖" },
    ],
  },
  {
    id: "mind-practice",
    title: "心願修行",
    lamps: [
      { id: "auspicious-lamp", name: "吉祥燈", description: "願好運常在身邊、事事圓滿順利，每一天都安心喜樂" },
      { id: "wish-lamp", name: "心願燈", description: "願心中所想慢慢實現，每一天都更接近理想生活" },
      { id: "zen-heart-lamp", name: "禪心燈", description: "願內心慢慢安定下來，在忙碌中也能感受到平靜與自在" },
      { id: "bodhi-lamp", name: "菩提燈", description: "願心中常有光亮與善念，活出更自在圓滿的人生" },
      { id: "calm-lamp", name: "靜心燈", description: "願放下疲憊與煩惱，讓心重新找回平靜與力量" },
      { id: "fortune-wisdom-lamp", name: "福慧燈", description: "願福氣與智慧同行，生活越來越安穩圓滿" },
    ],
  },
];

const BG_PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  left: `${8 + ((i * 11.2) % 84)}%`,
  top: `${10 + ((i * 8.6) % 74)}%`,
  size: 1.2 + (i % 3) * 0.8,
  duration: 54 + (i % 5) * 8,
  driftX: ((i % 2 === 0 ? 1 : -1) * (12 + (i % 4) * 4)),
  driftY: -18 - (i % 4) * 3,
  delay: (i % 6) * 0.45,
}));

const LIGHTING_PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  x: -72 + (i % 8) * 20,
  y: 18 + Math.floor(i / 8) * 18,
  delay: (i % 5) * 0.08,
  size: 2 + (i % 3),
}));

function hashString(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function buildLanternLayouts(lanterns: LitLantern[]) {
  const layouts: Record<string, LanternLayout> = {};
  const placed: LanternLayout[] = [];

  lanterns.forEach((item, index) => {
    const baseSeed = hashString(item.key);
    let picked: LanternLayout | null = null;
    let spacingFactor = 1;

    for (let attempt = 0; attempt < 120 && !picked; attempt += 1) {
      if (attempt > 0 && attempt % 30 === 0) {
        spacingFactor *= 0.93;
      }

      const seed = baseSeed + attempt * 131 + index * 17;
      const candidate: LanternLayout = {
        x: 9 + seededRandom(seed + 1) * 82,
        y: 16 + seededRandom(seed + 2) * 62,
        scale: 0.72 + seededRandom(seed + 3) * 0.38,
      };

      const overlaps = placed.some((existing) => {
        const avgScale = ((candidate.scale + existing.scale) / 2) * spacingFactor;
        const radiusX = 3.6 * avgScale;
        const radiusY = 7.2 * avgScale;
        const dx = candidate.x - existing.x;
        const dy = candidate.y - existing.y;
        return (dx * dx) / (radiusX * radiusX) + (dy * dy) / (radiusY * radiusY) < 1;
      });

      if (!overlaps) {
        picked = candidate;
      }
    }

    if (!picked) {
      const col = index % 7;
      const row = Math.floor(index / 7);
      picked = {
        x: Math.min(91, Math.max(9, 12 + col * 12 + seededRandom(baseSeed + 97) * 2.8)),
        y: Math.min(78, Math.max(16, 20 + row * 10 + seededRandom(baseSeed + 131) * 2.6)),
        scale: 0.74 + seededRandom(baseSeed + 199) * 0.28,
      };
    }

    placed.push(picked);
    layouts[item.key] = picked;
  });

  return layouts;
}

function SeedLantern({
  lit,
  size,
  reduceMotion,
}: {
  lit: boolean;
  size: "sm" | "lg";
  reduceMotion: boolean;
}) {
  const isLarge = size === "lg";
  const lanternW = isLarge ? 84 : 32;
  const lanternH = isLarge ? 126 : 48;

  return (
    <motion.div
      className="relative shrink-0"
      animate={
        reduceMotion || !lit
          ? undefined
          : {
              scale: [1, 1.03, 1],
              filter: [
                "drop-shadow(0 0 8px rgba(201,178,124,0.22))",
                "drop-shadow(0 0 14px rgba(201,178,124,0.34))",
                "drop-shadow(0 0 8px rgba(201,178,124,0.22))",
              ],
            }
      }
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      style={{ width: lanternW, height: lanternH + (isLarge ? 8 : 5) }}
    >
      <Image
        src={lanternImage}
        alt="祈願燈籠"
        width={lanternW}
        height={lanternH}
        className="relative z-10 object-contain"
        priority={false}
      />

      <span
        className="pointer-events-none absolute left-1/2 top-[86%] -z-0 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: isLarge ? 64 : 24,
          height: isLarge ? 16 : 8,
          background: "rgba(72,54,30,0.22)",
          filter: "blur(6px)",
        }}
      />

      {lit && (
        <span
          className="pointer-events-none absolute left-1/2 top-[56%] -z-0 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: isLarge ? 98 : 40,
            height: isLarge ? 78 : 30,
            background:
              "radial-gradient(circle, rgba(255,236,184,0.42) 0%, rgba(255,236,184,0.16) 54%, rgba(255,236,184,0) 78%)",
            filter: "blur(1px)",
          }}
        />
      )}
    </motion.div>
  );
}

export default function LanternSea() {
  const ref = useRef<HTMLDivElement>(null);
  const lightingTimersRef = useRef<number[]>([]);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const reduceMotion = useReducedMotion() ?? false;

  const [activeCategoryId, setActiveCategoryId] = useState(LAMP_CATEGORIES[0].id);
  const [selectedLamp, setSelectedLamp] = useState<Lamp | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lightingState, setLightingState] = useState<LightingState>("idle");
  const [name, setName] = useState("");
  const [wishText, setWishText] = useState("");
  const [litLanterns, setLitLanterns] = useState<LitLantern[]>([]);

  const lanternLayouts = useMemo(() => buildLanternLayouts(litLanterns), [litLanterns]);

  const activeCategory = useMemo(
    () => LAMP_CATEGORIES.find((category) => category.id === activeCategoryId) ?? LAMP_CATEGORIES[0],
    [activeCategoryId]
  );

  const clearLightingTimers = () => {
    lightingTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    lightingTimersRef.current = [];
  };

  useEffect(() => {
    return () => clearLightingTimers();
  }, []);

  const openConfirm = (lamp: Lamp) => {
    clearLightingTimers();
    setSelectedLamp(lamp);
    setLightingState("confirming");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    clearLightingTimers();
    setIsModalOpen(false);
    setLightingState("idle");
  };

  const confirmLighting = () => {
    if (!selectedLamp) return;

    clearLightingTimers();
    setLightingState("lighting");

    const completeTimer = window.setTimeout(() => {
      const entryKey = `${selectedLamp.id}-${Date.now()}`;
      setLitLanterns((prev) => [
        {
          key: entryKey,
          lampName: selectedLamp.name,
          wish: wishText.trim(),
        },
        ...prev,
      ].slice(0, 36));
      setLightingState("completed");
    }, reduceMotion ? 900 : 3000);

    const closeTimer = window.setTimeout(() => {
      setIsModalOpen(false);
      setLightingState("idle");
      setName("");
      setWishText("");
    }, reduceMotion ? 1500 : 3900);

    lightingTimersRef.current = [completeTimer, closeTimer];
  };

  return (
    <section id="lantern" ref={ref} className="relative overflow-hidden py-20 md:py-24">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 12% 6%, rgba(245,242,232,1) 0%, rgba(247,242,232,1) 55%), radial-gradient(95% 70% at 90% 15%, rgba(201,178,124,0.16) 0%, rgba(247,242,232,0.35) 58%, rgba(247,242,232,0.15) 100%)",
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 16% 24%, rgba(201,178,124,0.12) 0%, rgba(201,178,124,0) 44%), radial-gradient(circle at 84% 70%, rgba(184,155,94,0.1) 0%, rgba(184,155,94,0) 46%)",
        }}
      />

      {!reduceMotion && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {BG_PARTICLES.map((particle, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{
                left: particle.left,
                top: particle.top,
                width: particle.size,
                height: particle.size,
                background: "rgba(184,155,94,0.24)",
              }}
              animate={{
                opacity: [0.05, 0.18, 0.08, 0.16, 0.05],
                x: [0, particle.driftX, 0],
                y: [0, particle.driftY, 0],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-10 md:mb-12"
        >
          <span className="text-[10px] tracking-[0.5em] uppercase text-[rgba(120,90,45,0.45)]">Lantern Sea</span>
          <div className="divider-zen my-3" />
          <h2 className="font-serif-tc text-[clamp(1.75rem,4.3vw,2.9rem)] tracking-[0.25em] text-gold-gradient">一念燈海</h2>
          <p className="mt-4 font-serif-tc text-[clamp(1rem,2.1vw,1.2rem)] tracking-[0.12em] text-[rgba(96,72,36,0.62)]">
            選擇一盞燈，為心中所願點上一道光。
          </p>
        </motion.div>

        <div className="mb-6 lg:hidden overflow-x-auto pb-2">
          <div className="flex min-w-max gap-2.5">
            {LAMP_CATEGORIES.map((category) => {
              const active = category.id === activeCategoryId;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategoryId(category.id)}
                  className="px-4 py-2.5 rounded-full text-[12px] tracking-[0.12em] border transition-all duration-300 whitespace-nowrap"
                  style={{
                    borderColor: active ? "rgba(184,155,94,0.46)" : "rgba(184,155,94,0.2)",
                    background: active ? "rgba(201,178,124,0.16)" : "rgba(252,248,242,0.7)",
                    color: active ? "rgba(85,65,34,0.95)" : "rgba(96,72,36,0.62)",
                    boxShadow: active ? "0 8px 26px rgba(184,155,94,0.12)" : "none",
                  }}
                >
                  {category.title}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <aside className="hidden lg:block lg:col-span-3">
            <div className="rounded-2xl border border-[rgba(201,178,124,0.22)] bg-[rgba(252,248,242,0.72)] backdrop-blur-sm p-3">
              {LAMP_CATEGORIES.map((category) => {
                const active = category.id === activeCategoryId;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategoryId(category.id)}
                    className="w-full text-left rounded-xl px-4 py-3 mb-1.5 last:mb-0 border transition-all duration-300"
                    style={{
                      borderColor: active ? "rgba(184,155,94,0.4)" : "rgba(184,155,94,0.06)",
                      background: active ? "rgba(201,178,124,0.14)" : "rgba(247,242,232,0.36)",
                      color: active ? "rgba(78,58,28,0.94)" : "rgba(96,72,36,0.66)",
                      boxShadow: active ? "0 10px 28px rgba(184,155,94,0.12)" : "none",
                    }}
                  >
                    <span className="text-[14px] tracking-[0.13em] font-serif-tc">{category.title}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="lg:col-span-9">
            <motion.div
              key={activeCategory.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5"
            >
              {activeCategory.lamps.map((lamp) => {
                const isSelected = selectedLamp?.id === lamp.id;
                return (
                  <motion.article
                    key={lamp.id}
                    whileHover={reduceMotion ? undefined : { y: -4 }}
                    className="relative flex h-full flex-col rounded-2xl border bg-[rgba(252,248,242,0.8)] p-5 backdrop-blur-sm transition-all duration-300 md:p-6"
                    style={{
                      borderColor: isSelected ? "rgba(184,155,94,0.54)" : "rgba(201,178,124,0.24)",
                      boxShadow: isSelected
                        ? "0 0 0 1px rgba(201,178,124,0.28), 0 12px 34px rgba(184,155,94,0.14)"
                        : "0 8px 22px rgba(105,80,40,0.06)",
                    }}
                  >
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(circle at 12% 24%, rgba(201,178,124,0.16) 0%, rgba(201,178,124,0) 44%)",
                      }}
                    />

                    <div className="relative flex items-start gap-3">
                      <div className="flex w-7 justify-center pt-0.5">
                        <SeedLantern lit={isSelected} size="sm" reduceMotion={reduceMotion} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif-tc text-[1.08rem] tracking-[0.12em] text-[rgba(66,48,23,0.9)]">{lamp.name}</h3>
                        <p className="mt-2 min-h-[84px] text-[0.92rem] leading-7 tracking-[0.05em] text-[rgba(96,72,36,0.7)] md:min-h-[98px]">
                          {lamp.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 md:mt-auto">
                      <button
                        onClick={() => openConfirm(lamp)}
                        className="w-full md:w-auto px-5 py-2.5 text-[13px] tracking-[0.14em] border rounded-full transition-all duration-300"
                        style={{
                          borderColor: "rgba(184,155,94,0.42)",
                          background: "rgba(247,242,232,0.9)",
                          color: "rgba(86,63,30,0.9)",
                        }}
                      >
                        點亮此燈
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          </div>
        </div>

        <div className="mt-14 md:mt-16 rounded-2xl border border-[rgba(182,166,134,0.24)] bg-[linear-gradient(160deg,rgba(249,247,243,0.86),rgba(243,240,234,0.8))] p-5 md:p-7 shadow-[0_18px_46px_rgba(94,82,58,0.08)]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-serif-tc text-[clamp(1.2rem,2.8vw,1.6rem)] tracking-[0.16em] text-[rgba(86,63,30,0.88)]">
              已點亮的燈海
            </h3>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-[rgba(167,148,113,0.24)] bg-[rgba(252,250,245,0.72)] px-3 py-1 text-[11px] tracking-[0.12em] text-[rgba(90,73,42,0.68)]">
                當前燈數 {litLanterns.length}
              </span>
              <span className="rounded-full border border-[rgba(167,148,113,0.2)] bg-[rgba(252,250,245,0.62)] px-3 py-1 text-[11px] tracking-[0.12em] text-[rgba(90,73,42,0.58)]">
                靜心觀想
              </span>
            </div>
          </div>
          {litLanterns.length === 0 ? (
            <p className="text-[13px] tracking-[0.08em] text-[rgba(96,72,36,0.58)] leading-relaxed">
              尚未點亮燈盞，點選上方「點亮此燈」開始祈願。
            </p>
          ) : (
            <div className="relative h-[300px] sm:h-[330px] md:h-[360px] rounded-xl overflow-hidden isolate border border-[rgba(182,166,134,0.24)]">
              <Image
                src={lanternSeaBackground}
                alt="已點亮燈海背景"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 900px"
                priority={false}
              />

              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(248,247,243,0.28) 0%, rgba(245,243,238,0.12) 42%, rgba(241,238,232,0.3) 100%), radial-gradient(110% 95% at 50% 92%, rgba(146,132,104,0.16) 0%, rgba(146,132,104,0.05) 46%, rgba(247,242,232,0) 80%)",
                }}
              />

              <div
                className="pointer-events-none absolute inset-0 opacity-[0.2]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(152,135,106,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(152,135,106,0.06) 1px, transparent 1px)",
                  backgroundSize: "42px 42px",
                  maskImage:
                    "radial-gradient(ellipse at 50% 64%, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.22) 72%, transparent 100%)",
                }}
              />

              <div
                className="pointer-events-none absolute left-[8%] top-[10%] h-14 w-14 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,245,220,0.68) 0%, rgba(255,245,220,0.18) 52%, rgba(255,245,220,0) 74%)",
                }}
              />

              {!reduceMotion && (
                <>
                  {Array.from({ length: 10 }, (_, i) => ({
                    left: `${10 + (i * 9) % 82}%`,
                    top: `${12 + (i * 7) % 50}%`,
                    delay: i * 0.32,
                  })).map((spark, i) => (
                    <motion.span
                      key={`lit-spark-${i}`}
                      className="pointer-events-none absolute h-[3px] w-[3px] rounded-full bg-[rgba(229,207,152,0.78)]"
                      style={{ left: spark.left, top: spark.top }}
                      animate={{ opacity: [0.1, 0.75, 0.12], scale: [0.8, 1.18, 0.8] }}
                      transition={{ duration: 3.8, delay: spark.delay, repeat: Infinity, ease: "easeInOut" }}
                    />
                  ))}
                </>
              )}

              {litLanterns.map((item) => {
                const layout = lanternLayouts[item.key];
                if (!layout) return null;
                const { x, y, scale } = layout;
                return (
                  <motion.div
                    key={item.key}
                    className="absolute group z-10"
                    style={{ left: `${x}%`, top: `${y}%` }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                  >
                    <motion.div
                      className="relative"
                      whileHover={reduceMotion ? undefined : { y: -8, rotate: 1, scale: scale * 1.02 }}
                      animate={
                        reduceMotion
                          ? { scale }
                          : {
                              x: [0, 0.8, -0.6, 0],
                              y: [0, -1.6, 0.9, 0],
                              scale: [scale, scale * 1.04, scale],
                              opacity: [0.82, 1, 0.82],
                            }
                      }
                      transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
                      style={{ transform: `translate(-50%, -50%)` }}
                    >
                      <SeedLantern lit size="sm" reduceMotion={reduceMotion} />
                      <span
                        className="absolute z-30 left-1/2 -top-9 -translate-x-1/2 px-2 py-1 text-[10px] tracking-[0.08em] text-[rgba(78,58,28,0.9)] bg-[rgba(247,242,232,0.98)] border border-[rgba(201,178,124,0.3)] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-250 whitespace-nowrap pointer-events-none shadow-[0_4px_16px_rgba(112,86,48,0.12)]"
                      >
                        {item.lampName}
                      </span>
                      {item.wish ? (
                        <span
                          className="absolute z-30 left-1/2 top-full mt-2 -translate-x-1/2 px-2 py-1 text-[10px] tracking-[0.06em] text-[rgba(78,58,28,0.82)] bg-[rgba(247,242,232,0.98)] border border-[rgba(201,178,124,0.26)] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-250 whitespace-nowrap pointer-events-none max-w-[170px] truncate shadow-[0_4px_16px_rgba(112,86,48,0.1)]"
                        >
                          {item.wish}
                        </span>
                      ) : null}
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(250,247,242,1))" }}
      />

      <AnimatePresence>
        {isModalOpen && selectedLamp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center px-4"
            style={{
              background:
                lightingState === "lighting" || lightingState === "completed"
                  ? "rgba(56,44,24,0.34)"
                  : "rgba(50,37,18,0.26)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="w-full max-w-xl rounded-2xl border border-[rgba(201,178,124,0.32)] bg-[rgba(252,248,242,0.97)] p-6 md:p-7 shadow-[0_22px_80px_rgba(85,64,29,0.22)]"
            >
              {lightingState === "confirming" && (
                <>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <h4 className="font-serif-tc text-[1.18rem] tracking-[0.14em] text-[rgba(74,54,24,0.92)]">確認點燈</h4>
                    <button
                      onClick={closeModal}
                      className="text-[12px] tracking-[0.12em] text-[rgba(96,72,36,0.58)] hover:text-[rgba(96,72,36,0.9)]"
                    >
                      關閉
                    </button>
                  </div>

                  <div className="rounded-xl border border-[rgba(201,178,124,0.24)] bg-[rgba(247,242,232,0.65)] p-4">
                    <p className="font-serif-tc text-[1rem] tracking-[0.12em] text-[rgba(74,54,24,0.9)]">{selectedLamp.name}</p>
                    <p className="mt-2 text-[14px] leading-7 tracking-[0.04em] text-[rgba(96,72,36,0.72)]">{selectedLamp.description}</p>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3">
                    <label className="text-[12px] tracking-[0.1em] text-[rgba(96,72,36,0.72)]">
                      姓名
                      <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="mt-1.5 w-full px-3 py-2.5 rounded-lg border border-[rgba(201,178,124,0.34)] bg-[rgba(255,255,255,0.76)] text-[14px] text-[rgba(66,48,23,0.88)] outline-none focus:border-[rgba(184,155,94,0.55)]"
                        placeholder="請輸入姓名"
                      />
                    </label>

                    <label className="text-[12px] tracking-[0.1em] text-[rgba(96,72,36,0.72)]">
                      祈願內容
                      <textarea
                        value={wishText}
                        onChange={(event) => setWishText(event.target.value)}
                        className="mt-1.5 w-full px-3 py-2.5 rounded-lg border border-[rgba(201,178,124,0.34)] bg-[rgba(255,255,255,0.76)] text-[14px] text-[rgba(66,48,23,0.88)] outline-none focus:border-[rgba(184,155,94,0.55)] min-h-[110px] resize-y"
                        placeholder="寫下你的祈願"
                      />
                    </label>
                  </div>

                  <button
                    onClick={confirmLighting}
                    className="mt-5 w-full py-3 rounded-full border text-[14px] tracking-[0.14em] transition-all duration-300"
                    style={{
                      borderColor: "rgba(184,155,94,0.5)",
                      background: "linear-gradient(90deg, rgba(247,242,232,1) 0%, rgba(201,178,124,0.22) 100%)",
                      color: "rgba(74,54,24,0.92)",
                    }}
                  >
                    確認點燈
                  </button>
                </>
              )}

              {(lightingState === "lighting" || lightingState === "completed") && (
                <div className="relative min-h-[330px] overflow-hidden rounded-xl border border-[rgba(201,178,124,0.25)] bg-[rgba(247,242,232,0.64)] p-4 md:p-5">
                  <Image
                    src={lanternSeaModalBackground}
                    alt="點燈視窗背景"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 92vw, 560px"
                    priority={false}
                  />

                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(247,242,232,0.14) 0%, rgba(247,242,232,0.22) 100%), radial-gradient(circle at 50% 38%, rgba(201,178,124,0.14) 0%, rgba(201,178,124,0.04) 48%, rgba(247,242,232,0.12) 100%)",
                    }}
                  />

                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 38%, rgba(201,178,124,0.16) 0%, rgba(201,178,124,0.03) 48%, rgba(247,242,232,0.12) 100%)",
                    }}
                  />

                  {!reduceMotion && (
                    <div className="absolute inset-0 pointer-events-none">
                      {LIGHTING_PARTICLES.map((particle, index) => (
                        <motion.span
                          key={index}
                          className="absolute rounded-full"
                          style={{
                            left: `calc(50% + ${particle.x}px)`,
                            top: `calc(58% + ${particle.y}px)`,
                            width: particle.size,
                            height: particle.size,
                            background: "rgba(201,178,124,0.65)",
                          }}
                          initial={{ opacity: 0, y: 0, scale: 0.6 }}
                          animate={
                            lightingState === "lighting"
                              ? { opacity: [0, 0.62, 0], y: [0, -72], x: [0, index % 2 === 0 ? -12 : 12], scale: [0.6, 1, 0.42] }
                              : { opacity: 0 }
                          }
                          transition={{
                            duration: 1.5,
                            delay: particle.delay,
                            repeat: lightingState === "lighting" ? Infinity : 0,
                            ease: "easeOut",
                          }}
                        />
                      ))}
                    </div>
                  )}

                  <motion.div
                    className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2"
                    initial={false}
                    animate={
                      lightingState === "lighting"
                        ? {
                            rotate: [0, 4, -4, 3, -2, 0, 0],
                            x: [0, 0, 0, 0, 0, 20, 92],
                            y: [0, 0, 0, 0, 0, -22, -86],
                            scale: [1, 1, 1, 1, 1, 0.92, 0.7],
                          }
                        : { rotate: 0, x: 92, y: -86, scale: 0.7 }
                    }
                    transition={{
                      duration: reduceMotion ? 0.8 : 3.1,
                      ease: "easeInOut",
                      times: [0, 0.08, 0.16, 0.24, 0.32, 0.74, 1],
                    }}
                  >
                    <SeedLantern
                      lit={lightingState === "lighting" || lightingState === "completed"}
                      size="lg"
                      reduceMotion={reduceMotion}
                    />

                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={lightingState === "completed" ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="absolute bottom-5 left-1/2 -translate-x-1/2 text-center font-serif-tc text-[15px] tracking-[0.16em] text-[rgba(86,63,30,0.88)] whitespace-nowrap"
                  >
                    一念已明，願光常在。
                  </motion.p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
