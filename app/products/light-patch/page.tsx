"use client";

import { useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

type ChakraKey =
  | "root"
  | "sacral"
  | "solar"
  | "heart"
  | "throat"
  | "third-eye"
  | "crown";

type ChakraInfo = {
  id: ChakraKey;
  name: string;
  intro: string;
  patch: string;
  scenario: string;
  usage: string;
};

const CHAKRAS: ChakraInfo[] = [
  {
    id: "root",
    name: "海底輪",
    intro: "與安定感、身體安全感相關。當你容易焦慮漂浮，海底輪需要被溫柔照顧。",
    patch: "穩根光貼",
    scenario: "適用情境：工作壓力大、容易心慌、生活節奏混亂。",
    usage: "使用方式：貼於下腹或腰薦區，搭配深呼吸 5 分鐘。",
  },
  {
    id: "sacral",
    name: "臍輪",
    intro: "與情緒流動、創造力與人際感受相關。",
    patch: "暖流光貼",
    scenario: "適用情境：情緒卡住、提不起勁、創造力低落。",
    usage: "使用方式：貼於肚臍下方，靜坐時輕觀呼吸。",
  },
  {
    id: "solar",
    name: "太陽神經叢",
    intro: "與意志、行動力、自我邊界有關。",
    patch: "自信光貼",
    scenario: "適用情境：想法很多卻難以行動、容易自我懷疑。",
    usage: "使用方式：貼於胃部上方，專注當日一件最重要的事。",
  },
  {
    id: "heart",
    name: "心輪",
    intro: "與愛、連結、接納與內在療癒相關。",
    patch: "柔心光貼",
    scenario: "適用情境：關係壓力、情緒敏感、需要安撫內心。",
    usage: "使用方式：貼於胸口中央，搭配溫柔觀照語。",
  },
  {
    id: "throat",
    name: "喉輪",
    intro: "與表達、真實說話、內外一致相關。",
    patch: "清聲光貼",
    scenario: "適用情境：難以說出心聲、溝通卡頓。",
    usage: "使用方式：貼於鎖骨間，先寫下想說的一句話。",
  },
  {
    id: "third-eye",
    name: "眉心輪",
    intro: "與洞察力、直覺與清明判斷相關。",
    patch: "靜觀光貼",
    scenario: "適用情境：腦內雜訊多、難以聚焦。",
    usage: "使用方式：貼於眉心上方，閉眼觀息 3 分鐘。",
  },
  {
    id: "crown",
    name: "頂輪",
    intro: "與高層次連結、開放與整體和諧相關。",
    patch: "明冠光貼",
    scenario: "適用情境：心神散亂、缺乏整體感。",
    usage: "使用方式：貼於頭頂後方，靜心後再進入日常。",
  },
];

const QUIZ_MAP: Record<string, string[]> = {
  我想安定: ["穩根光貼", "安定光貼"],
  我想專注: ["靜觀光貼", "專注光貼"],
  我想放鬆: ["柔心光貼", "舒緩光貼"],
  我想改善睡眠: ["安眠光貼", "靜心光貼"],
  我想提升能量: ["明冠光貼", "活力光貼"],
  我想增加自信: ["自信光貼", "太陽光貼"],
};

export default function LightPatchPage() {
  const [activeChakra, setActiveChakra] = useState<ChakraKey>("heart");
  const [quizAnswer, setQuizAnswer] = useState<string>("");

  const chakra = useMemo(() => CHAKRAS.find((item) => item.id === activeChakra) ?? CHAKRAS[0], [activeChakra]);
  const quizResult = quizAnswer ? QUIZ_MAP[quizAnswer] || [] : [];

  return (
    <>
      <Navigation />
      <main className="relative min-h-screen pt-32 pb-24 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 8% 8%, rgba(247,242,232,1) 0%, rgba(239,231,215,0.9) 58%, rgba(247,242,232,1) 100%)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 space-y-14">
          <section className="text-center">
            <h1 className="font-serif-tc text-[clamp(2rem,5vw,3rem)] tracking-[0.14em] text-[rgba(86,63,30,0.9)]">光能貼片專區</h1>
            <p className="mt-4 text-[15px] tracking-[0.08em] text-[rgba(122,104,82,0.78)] max-w-3xl mx-auto leading-8">
              七輪平衡，不是追求神祕，而是讓身心重新回到有秩序的流動。
            </p>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 rounded-2xl border border-[rgba(184,155,94,0.22)] bg-[rgba(247,242,232,0.72)] p-6">
              <p className="text-[12px] tracking-[0.16em] text-[rgba(122,104,82,0.72)]">七輪互動區</p>

              <div className="mt-5 mx-auto w-[180px] h-[420px] relative">
                <div className="absolute left-1/2 top-5 bottom-5 w-px -translate-x-1/2 bg-[rgba(184,155,94,0.2)]" />
                {CHAKRAS.map((item, index) => {
                  const active = item.id === activeChakra;
                  const top = 20 + index * 58;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveChakra(item.id)}
                      className="absolute left-1/2 -translate-x-1/2 rounded-full border transition-all duration-300"
                      style={{
                        top,
                        width: 28,
                        height: 28,
                        borderColor: active ? "rgba(184,155,94,0.58)" : "rgba(184,155,94,0.26)",
                        background: active ? "rgba(220,200,163,0.4)" : "rgba(247,242,232,0.72)",
                        boxShadow: active ? "0 0 16px rgba(184,155,94,0.28)" : "none",
                      }}
                      aria-label={item.name}
                    />
                  );
                })}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {CHAKRAS.map((item) => {
                  const active = item.id === activeChakra;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveChakra(item.id)}
                      className="text-left px-3 py-2 rounded-lg border text-[12px] tracking-[0.1em]"
                      style={{
                        borderColor: active ? "rgba(184,155,94,0.46)" : "rgba(184,155,94,0.18)",
                        background: active ? "rgba(220,200,163,0.2)" : "rgba(247,242,232,0.8)",
                        color: active ? "rgba(86,63,30,0.9)" : "rgba(122,104,82,0.78)",
                      }}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-7 rounded-2xl border border-[rgba(184,155,94,0.22)] bg-[rgba(247,242,232,0.72)] p-6 md:p-7">
              <h2 className="font-serif-tc text-[24px] tracking-[0.14em] text-[rgba(86,63,30,0.9)]">{chakra.name}</h2>
              <p className="mt-4 text-[15px] leading-8 tracking-[0.08em] text-[rgba(122,104,82,0.82)]">{chakra.intro}</p>
              <div className="mt-6 space-y-3 text-[14px] leading-7 tracking-[0.08em] text-[rgba(122,104,82,0.8)]">
                <p>對應光貼：{chakra.patch}</p>
                <p>{chakra.scenario}</p>
                <p>{chakra.usage}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[rgba(184,155,94,0.24)] bg-[rgba(247,242,232,0.72)] p-6 md:p-8">
            <h2 className="font-serif-tc text-[24px] tracking-[0.14em] text-[rgba(86,63,30,0.9)]">今天的你最需要什麼？</h2>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.keys(QUIZ_MAP).map((option) => (
                <button
                  key={option}
                  onClick={() => setQuizAnswer(option)}
                  className="text-left px-4 py-3 rounded-xl border text-[13px] tracking-[0.1em]"
                  style={{
                    borderColor: quizAnswer === option ? "rgba(184,155,94,0.52)" : "rgba(184,155,94,0.2)",
                    background: quizAnswer === option ? "rgba(220,200,163,0.22)" : "rgba(247,242,232,0.86)",
                    color: quizAnswer === option ? "rgba(86,63,30,0.9)" : "rgba(122,104,82,0.8)",
                  }}
                >
                  {option}
                </button>
              ))}
            </div>

            {quizResult.length > 0 ? (
              <div className="mt-6 rounded-xl border border-[rgba(184,155,94,0.24)] bg-[rgba(247,242,232,0.9)] px-4 py-4">
                <p className="text-[12px] tracking-[0.14em] text-[rgba(122,104,82,0.72)]">推薦：</p>
                <p className="mt-2 font-serif-tc text-[18px] tracking-[0.1em] text-[rgba(86,63,30,0.9)]">{quizResult.join("、")}</p>
              </div>
            ) : null}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
