import type { Product } from "@/lib/admin/types";

export type EnergyKey = "安定" | "智慧" | "專注" | "療癒" | "平衡";

export const CATEGORY_PILL: Record<string, string> = {
  清心雅物: "✦ 清心雅物",
  光林雅藏: "✦ 光林雅藏",
  自性香品: "✦ 自性香品",
  光之能貼片系列: "✦ 光之能貼片系列",
  "七輪平衡・光能守護": "✦ 七輪平衡・光能守護",
};

const TAG_POOL: Record<string, string[]> = {
  清心雅物: ["#安定", "#覺察", "#清明"],
  光林雅藏: ["#智慧", "#專注", "#清明"],
  自性香品: ["#療癒", "#安定", "#平衡"],
  光之能貼片系列: ["#平衡", "#療癒", "#專注"],
  "七輪平衡・光能守護": ["#平衡", "#安定", "#覺察"],
};

const CONTEXT_POOL: Record<string, string[]> = {
  清心雅物: ["晨起靜坐", "閱讀經文", "睡前安定", "情緒整理"],
  光林雅藏: ["書寫心記", "長時專注", "茶席沉澱", "儀式靜心"],
  自性香品: ["冥想練習", "空間淨化", "夜間放鬆", "呼吸覺察"],
  光之能貼片系列: ["工作沉澱", "日常調息", "步行覺察", "午間充電"],
  "七輪平衡・光能守護": ["晨起靜坐", "能量整理", "瑜伽修練", "睡前回歸"],
};

const REFLECTION_POOL: Record<string, string> = {
  清心雅物: "此刻的你，是否正在追趕某個答案？願這件法物提醒你，先把心安放，再讓路自然展開。",
  光林雅藏: "每一次凝視與觸碰，都是一次向內回返。當你慢下來，智慧就不再遙遠。",
  自性香品: "香氣不為遮掩，而是提醒。提醒你回到呼吸，回到身體，回到仍然柔軟的自己。",
  光之能貼片系列: "能量不是用力獲得，而是透過平衡被喚回。願你在日常裡重新聽見身心的訊號。",
  "七輪平衡・光能守護": "當七輪逐漸回到協調，內在會出現一種安靜的力量。這份力量，會陪你穩穩走下去。",
};

const ENERGY_POOL: Record<string, Record<EnergyKey, number>> = {
  清心雅物: { 安定: 5, 智慧: 3, 專注: 4, 療癒: 4, 平衡: 4 },
  光林雅藏: { 安定: 4, 智慧: 5, 專注: 4, 療癒: 3, 平衡: 4 },
  自性香品: { 安定: 4, 智慧: 3, 專注: 3, 療癒: 5, 平衡: 4 },
  光之能貼片系列: { 安定: 4, 智慧: 3, 專注: 4, 療癒: 4, 平衡: 5 },
  "七輪平衡・光能守護": { 安定: 5, 智慧: 4, 專注: 3, 療癒: 4, 平衡: 5 },
};

export function getCategoryPill(category: string) {
  return CATEGORY_PILL[category] || `✦ ${category || "法物"}`;
}

export function getMoodTags(category: string, name: string, description: string) {
  const base = TAG_POOL[category] || ["#安定", "#覺察", "#平衡"];
  const text = `${name} ${description}`;
  if (/香|薰|檀/.test(text)) return ["#療癒", "#安定", "#清明"];
  if (/貼|輪|能量/.test(text)) return ["#平衡", "#專注", "#療癒"];
  if (/扇|書|經|念/.test(text)) return ["#智慧", "#覺察", "#專注"];
  return base;
}

export function getPoeticSubtitle(description: string) {
  const trimmed = description.trim();
  if (!trimmed) return "「讓身心回到安住之地。」";
  const sentence = trimmed.split(/[。！？]/).find((s) => s.trim().length > 0)?.trim() || trimmed;
  const short = sentence.length > 20 ? `${sentence.slice(0, 20)}…` : sentence;
  return `「${short}」`;
}

export function getMeritAmount(product: Product) {
  return product.meritPrice ?? product.meritAmount ?? product.price;
}

export function getContexts(category: string) {
  return CONTEXT_POOL[category] || ["晨起靜坐", "閱讀經文", "睡前安定", "情緒整理"];
}

export function getReflection(category: string) {
  return REFLECTION_POOL[category] || "當你願意停下來聆聽，法物便不只是物件，而是陪伴你安住此刻的提醒。";
}

export function getEnergy(category: string) {
  return ENERGY_POOL[category] || { 安定: 4, 智慧: 3, 專注: 3, 療癒: 4, 平衡: 4 };
}

export function isLightPatchCategory(category: string) {
  return category === "光之能貼片系列" || category === "七輪平衡・光能守護";
}
