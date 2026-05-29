"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Icons } from "@/components/Icons";

const practiceRecords = [
  {
    id: 1,
    date: "2026-05-19",
    dayOfWeek: "一",
    title: "晨課修行",
    practices: [
      { name: "觀息", duration: 15, status: "completed" },
      { name: "禮讚經文", duration: 10, status: "completed" },
      { name: "善願冥想", duration: 10, status: "completed" },
    ],
    notes: "心境平穩，呼吸節奏順暢。下午仍感內心安定。",
    dedication: "回向給所有正在修行的眾生",
    mood: "peaceful",
  },
  {
    id: 2,
    date: "2026-05-18",
    dayOfWeek: "日",
    title: "完整修課",
    practices: [
      { name: "晨課靜坐", duration: 20, status: "completed" },
      { name: "經文研習", duration: 30, status: "completed" },
      { name: "晚課迴向", duration: 15, status: "completed" },
    ],
    notes: "參與了祈年殿的下午經文研習，對般若經文有新的領悟。",
    dedication: "迴向給所有受苦的眾生，願他們得到安樂",
    mood: "grateful",
  },
  {
    id: 3,
    date: "2026-05-17",
    dayOfWeek: "六",
    title: "日常修行",
    practices: [
      { name: "觀息", duration: 10, status: "completed" },
      { name: "善語冥想", duration: 8, status: "completed" },
    ],
    notes: "工作繁忙，但堅持完成最基本的修行。發現即使短時間的靜心也能帶來平靜。",
    dedication: "回向給今天幫助過我的所有人",
    mood: "balanced",
  },
];

const achievementBadges = [
  { id: 1, name: "初心者", desc: "完成7天修行", icon: "seedling", unlocked: true },
  { id: 2, name: "堅持者", desc: "完成30天修行", icon: "leaf", unlocked: true },
  { id: 3, name: "定課達人", desc: "完成100次定課", icon: "lotus", unlocked: true },
  { id: 4, name: "善心大使", desc: "完成50次迴向", icon: "heart", unlocked: false },
  { id: 5, name: "光明引路人", desc: "邀請3位朋友加入", icon: "star", unlocked: false },
  { id: 6, name: "修心智者", desc: "參與20場經文研習", icon: "temple", unlocked: false },
];

const stats = [
  { label: "連續修行天數", value: 28, unit: "天", icon: Icons.CalendarIcon },
  { label: "完成定課次數", value: 340, unit: "次", icon: Icons.CheckmarkIcon },
  { label: "累計修行時長", value: 156, unit: "小時", icon: Icons.LotusIcon },
  { label: "善願迴向次數", value: 92, unit: "次", icon: Icons.HandsIcon },
];

function MoodIcon({ mood }: { mood: string }) {
  if (mood === "peaceful") return <Icons.LotusIcon />;
  if (mood === "grateful") return <Icons.HandsIcon />;
  if (mood === "balanced") return <Icons.TempleIcon />;
  return null;
}

function AchievementIcon({ type }: { type: string }) {
  switch (type) {
    case "seedling":
      return "🌱";
    case "leaf":
      return "🌿";
    case "lotus":
      return <Icons.LotusIcon />;
    case "heart":
      return <Icons.HeartIcon />;
    case "star":
      return <Icons.StarIcon />;
    case "temple":
      return <Icons.TempleIcon />;
    default:
      return null;
  }
}

function PracticeRecord({
  record,
  index,
}: {
  record: (typeof practiceRecords)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="card-zen p-6 md:p-8"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h3 className="font-serif-tc text-xl tracking-[0.12em] text-[rgba(55,40,14,0.95)]">
              {record.title}
            </h3>
            <span className="w-8 h-8 text-[rgba(200,185,154,0.8)]">
              <MoodIcon mood={record.mood} />
            </span>
          </div>
          <p className="text-sm text-[rgba(138,109,65,0.5)] tracking-[0.08em]">
            {record.date} （星期{record.dayOfWeek}）
          </p>
        </div>
      </div>

      {/* Practices */}
      <div className="space-y-3 mb-6">
        {record.practices.map((practice, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 rounded-lg bg-[rgba(250,247,242,0.6)] border border-[rgba(200,185,154,0.2)]"
          >
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 text-[rgba(100,140,80,0.8)] flex-shrink-0">
                <Icons.CheckmarkIcon />
              </div>
              <span className="font-serif-tc text-sm tracking-[0.08em] text-[rgba(55,40,14,0.8)]">
                {practice.name}
              </span>
            </div>
            <span className="text-xs text-[rgba(138,109,65,0.5)] tracking-[0.08em]">
              {practice.duration} 分鐘
            </span>
          </div>
        ))}
      </div>

      {/* Notes Section */}
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-[rgba(200,185,154,0.05)] border border-[rgba(200,185,154,0.15)]">
          <p className="text-xs font-serif-tc tracking-[0.08em] text-[rgba(138,109,65,0.6)] mb-2 uppercase">
            修行筆記
          </p>
          <p className="text-sm text-[rgba(55,40,14,0.7)] tracking-[0.08em] leading-relaxed">
            {record.notes}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-[rgba(180,210,170,0.05)] border border-[rgba(180,210,170,0.15)]">
          <p className="text-xs font-serif-tc tracking-[0.08em] text-[rgba(100,140,80,0.6)] mb-2 uppercase">
            今日迴向
          </p>
          <p className="text-sm text-[rgba(55,40,14,0.7)] tracking-[0.08em] leading-relaxed">
            {record.dedication}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function PracticeNotebook() {
  const [activeTab, setActiveTab] = useState<"records" | "achievements" | "stats">("records");

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#faf7f2] pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <h1 className="font-serif-tc text-4xl md:text-5xl tracking-[0.15em] text-[rgba(55,40,14,0.95)] mb-4">
              修行薄
            </h1>
            <p className="text-[rgba(55,40,14,0.6)] text-lg tracking-[0.08em] leading-relaxed">
              記錄每日修行進程，見證內心的成長與蛻變
            </p>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="card-zen p-4 text-center bg-gradient-to-br from-[rgba(200,185,154,0.05)] to-transparent"
              >
                <div className="w-8 h-8 mx-auto mb-2 text-[rgba(200,185,154,0.8)]">
                  <stat.icon />
                </div>
                <div className="font-serif-tc text-2xl tracking-[0.1em] text-[rgba(55,40,14,0.95)] mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-[rgba(138,109,65,0.5)] tracking-[0.08em]">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex gap-2 mb-8 border-b border-[rgba(200,185,154,0.2)]"
          >
            {[
              { id: "records", label: "修行紀錄" },
              { id: "achievements", label: "成就徽章" },
              { id: "stats", label: "修行統計" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-4 font-serif-tc text-sm tracking-[0.12em] border-b-2 transition-all duration-300 ${
                  activeTab === tab.id
                    ? "text-[rgba(55,40,14,0.95)] border-[rgba(200,185,154,0.8)]"
                    : "text-[rgba(138,109,65,0.5)] border-transparent hover:text-[rgba(55,40,14,0.7)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Tab Content */}
          <div>
            {/* Records Tab */}
            {activeTab === "records" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {practiceRecords.map((record, i) => (
                  <PracticeRecord key={record.id} record={record} index={i} />
                ))}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-zen py-4 text-base tracking-[0.12em]"
                >
                  + 新增今日修行紀錄
                </motion.button>
              </motion.div>
            )}

            {/* Achievements Tab */}
            {activeTab === "achievements" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid md:grid-cols-3 gap-6"
              >
                {achievementBadges.map((badge, i) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className={`card-zen p-8 text-center transition-all duration-300 ${
                      badge.unlocked
                        ? "bg-gradient-to-br from-[rgba(200,185,154,0.08)] to-transparent"
                        : "bg-[rgba(250,247,242,0.4)] opacity-60"
                    }`}
                  >
                    <div className={`text-5xl mb-4 ${!badge.unlocked && "grayscale opacity-50"} flex items-center justify-center`}>
                      {typeof badge.icon === "string" ? (
                        badge.icon
                      ) : (
                        <AchievementIcon type={badge.icon} />
                      )}
                    </div>
                    <h3 className="font-serif-tc text-lg tracking-[0.12em] text-[rgba(55,40,14,0.95)] mb-2">
                      {badge.name}
                    </h3>
                    <p className="text-xs text-[rgba(138,109,65,0.5)] tracking-[0.08em]">
                      {badge.desc}
                    </p>
                    {badge.unlocked && (
                      <div className="mt-4 text-xs text-[rgba(100,140,80,0.7)] tracking-[0.08em] font-serif-tc">
                        ✓ 已解鎖
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Stats Tab */}
            {activeTab === "stats" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                {/* Practice Distribution */}
                <div className="card-zen p-8">
                  <h3 className="font-serif-tc text-xl tracking-[0.12em] text-[rgba(55,40,14,0.95)] mb-6">
                    修行類型分布
                  </h3>
                  <div className="space-y-4">
                    {[
                      { type: "靜坐冥想", percentage: 45, color: "rgba(200,185,154" },
                      { type: "經文研習", percentage: 25, color: "rgba(180,210,170" },
                      { type: "善願迴向", percentage: 20, color: "rgba(210,185,220" },
                      { type: "日常修心", percentage: 10, color: "rgba(220,200,150" },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-[rgba(55,40,14,0.8)] tracking-[0.08em]">
                            {item.type}
                          </span>
                          <span className="text-sm font-serif-tc text-[rgba(55,40,14,0.6)]">
                            {item.percentage}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-[rgba(250,247,242,0.8)] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percentage}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ background: `${item.color},0.6)` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly Summary */}
                <div className="card-zen p-8">
                  <h3 className="font-serif-tc text-xl tracking-[0.12em] text-[rgba(55,40,14,0.95)] mb-6">
                    本週修行記錄
                  </h3>
                  <div className="flex items-end justify-around gap-2 h-48">
                    {["一", "二", "三", "四", "五", "六", "日"].map((day, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(i + 1) * 28}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className="w-full rounded-t-lg mb-2"
                          style={{
                            background: `linear-gradient(to top, rgba(200,185,154,0.6), rgba(200,185,154,0.3))`,
                          }}
                        />
                        <span className="text-xs text-[rgba(138,109,65,0.5)] tracking-[0.08em]">
                          {day}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
