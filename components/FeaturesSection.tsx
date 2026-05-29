"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  Icons
} from "./Icons";

const features = [
  {
    id: 1,
    title: "修行薄",
    subtitle: "Practice Notebook",
    desc: "記錄每日修行進程，追蹤修心成長",
    href: "/practice-notebook",
    icon: Icons.NotebookIcon,
    accent: "rgba(200,185,154",
    details: ["修行紀錄", "成就徽章", "修行統計"],
  },
  {
    id: 2,
    title: "祈年殿",
    subtitle: "Qinian Hall",
    desc: "進入修行聖地，體驗靜心與修行",
    href: "/qinian-hall",
    icon: Icons.TempleIcon,
    accent: "rgba(180,210,170",
    details: ["日日課程", "聖地殿堂", "修行活動"],
  },
  {
    id: 3,
    title: "會員加入",
    subtitle: "Membership",
    desc: "加入光林社群，開始修行之旅",
    href: "/join",
    icon: Icons.HandsIcon,
    accent: "rgba(210,185,220",
    details: ["社群互動", "學習資源", "獨享福利"],
  },
  {
    id: 4,
    title: "噔噔",
    subtitle: "Ding Ding",
    desc: "修行社群的心靈交流空間",
    href: "/deng-deng",
    icon: Icons.BellIcon,
    accent: "rgba(220,200,150",
    details: ["修心時刻", "社群通知", "智慧分享"],
  },
];

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      ref={ref}
      className="py-28 px-6 md:px-12 bg-gradient-to-b from-transparent to-[rgba(200,185,154,0.02)]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <h2 className="font-serif-tc text-4xl md:text-5xl tracking-[0.15em] text-[rgba(55,40,14,0.95)] mb-4">
            光林修行功能
          </h2>
          <p className="text-[rgba(55,40,14,0.6)] text-lg tracking-[0.08em] leading-relaxed">
            完整的修行生態，陪伴您在靜心的路上持續前進
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link href={feature.href}>
                <div className="card-zen p-6 h-full flex flex-col hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  {/* Icon */}
                  <div className="mb-4 group-hover:scale-110 transition-transform duration-300" style={{ color: `${feature.accent},0.8)` }}>
                    <feature.icon />
                  </div>

                  {/* Title */}
                  <h3 className="font-serif-tc text-xl tracking-[0.12em] text-[rgba(55,40,14,0.95)] mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs tracking-[0.12em] text-[rgba(138,109,65,0.5)] uppercase mb-4">
                    {feature.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-[rgba(55,40,14,0.6)] tracking-[0.08em] leading-relaxed mb-6 flex-1">
                    {feature.desc}
                  </p>

                  {/* Details */}
                  <div className="space-y-2 pt-4 border-t border-[rgba(200,185,154,0.2)]">
                    {feature.details.map((detail, j) => (
                      <p
                        key={j}
                        className="text-xs text-[rgba(138,109,65,0.5)] tracking-[0.08em] flex items-center gap-2"
                      >
                        <span
                          className="inline-block w-1.5 h-1.5 rounded-full"
                          style={{ background: `${feature.accent},0.6)` }}
                        />
                        {detail}
                      </p>
                    ))}
                  </div>

                  {/* CTA */}
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="mt-6 flex items-center gap-2 text-sm tracking-[0.1em]"
                    style={{ color: `${feature.accent},0.8)` }}
                  >
                    <span className="font-serif-tc">進入</span>
                    <span>→</span>
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
