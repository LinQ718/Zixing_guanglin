"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import type { Product } from "@/lib/admin/types";
import {
  getCategoryPill,
  getContexts,
  getEnergy,
  getMeritAmount,
  getPoeticSubtitle,
  getReflection,
  getMoodTags,
  isLightPatchCategory,
} from "@/lib/products/experience";

type FavoriteItem = {
  id: string;
  name: string;
  kind: "法物" | "香品" | "光貼" | "課程";
};

const FAVORITES_KEY = "zixing-favorites";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    fetch("/api/public/products")
      .then((res) => res.json())
      .then((data) => setProducts((data.rows || []) as Product[]))
      .catch(() => setProducts([]));

    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as FavoriteItem[];
      setFavorites(Array.isArray(parsed) ? parsed : []);
    } catch {
      setFavorites([]);
    }
  }, []);

  const product = useMemo(() => products.find((item) => item.id === params.id) ?? null, [products, params.id]);

  const related = useMemo(() => {
    if (!product) return [];
    if (product.relatedProductIds && product.relatedProductIds.length > 0) {
      return product.relatedProductIds
        .map((id) => products.find((item) => item.id === id))
        .filter((item): item is Product => Boolean(item))
        .slice(0, 6);
    }
    return products.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 3);
  }, [product, products]);

  const isFavorite = useMemo(() => {
    if (!product) return false;
    return favorites.some((item) => item.id === product.id);
  }, [favorites, product]);

  const toggleFavorite = () => {
    if (!product) return;
    if (isFavorite) {
      const next = favorites.filter((item) => item.id !== product.id);
      setFavorites(next);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return;
    }

    const kind: FavoriteItem["kind"] = isLightPatchCategory(product.category)
      ? "光貼"
      : product.category.includes("香")
      ? "香品"
      : "法物";
    const next = [{ id: product.id, name: product.name, kind }, ...favorites];
    setFavorites(next);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  };

  if (!product) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen pt-32 pb-24 bg-[#F7F2E8]">
          <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
            <h1 className="font-serif-tc text-3xl tracking-[0.12em] text-[rgba(86,63,30,0.9)]">法物整理中</h1>
            <p className="mt-4 text-[rgba(122,104,82,0.75)] tracking-[0.08em]">暫時找不到這件法物，請回到法物總覽繼續探索。</p>
            <Link href="/products" className="inline-block mt-8 px-5 py-2.5 rounded-full border border-[rgba(184,155,94,0.42)] text-[rgba(86,63,30,0.9)]">
              返回法物總覽
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const subtitle = product.subtitle || product.shortDescription || getPoeticSubtitle(product.description);
  const moodTags = (product.moodTags && product.moodTags.length > 0)
    ? product.moodTags
    : getMoodTags(product.category, product.name, product.description);
  const contexts = (product.useCases && product.useCases.length > 0) ? product.useCases : getContexts(product.category);
  const reflection = product.practiceMeaning || getReflection(product.category);
  const meaning = product.meaning || product.description;
  const practiceSteps = (product.practiceSteps && product.practiceSteps.length > 0) ? product.practiceSteps : [];
  const contemplation = product.contemplation || "尚未設定今日觀照。";
  const dedication = product.dedicationText || "尚未設定此法物流轉善念文案。";
  const energy = product.energyAttributes || (() => {
    const legacy = getEnergy(product.category);
    return {
      stability: legacy.安定,
      wisdom: legacy.智慧,
      focus: legacy.專注,
      healing: legacy.療癒,
      balance: legacy.平衡,
    };
  })();
  const energyItems = [
    { key: "stability", label: "安定" },
    { key: "wisdom", label: "智慧" },
    { key: "focus", label: "專注" },
    { key: "healing", label: "療癒" },
    { key: "balance", label: "平衡" },
  ] as const;

  return (
    <>
      <Navigation />
      <main className="relative min-h-screen pt-32 pb-24 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(110% 85% at 10% 8%, rgba(247,242,232,1) 0%, rgba(239,231,215,0.9) 55%, rgba(247,242,232,1) 100%)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 space-y-16 md:space-y-20">
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6"
            >
              <div
                className="rounded-3xl overflow-hidden border"
                style={{ borderColor: "rgba(184,155,94,0.24)", boxShadow: "0 20px 56px rgba(96,72,36,0.1)" }}
              >
                <div className="relative" style={{ aspectRatio: "4 / 5", background: "rgba(239,231,215,0.56)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.imageUrl || "/placeholder-image.svg"} alt={product.name} className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(35,24,8,0.16)] to-transparent" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08 }}
              className="lg:col-span-6"
            >
              <span className="px-3 py-1.5 rounded-full text-[11px] tracking-[0.12em] border border-[rgba(184,155,94,0.34)] bg-[rgba(247,242,232,0.8)] text-[rgba(122,104,82,0.86)]">
                {getCategoryPill(product.category)}
              </span>
              <h1 className="mt-5 font-serif-tc text-[clamp(2rem,5vw,3rem)] tracking-[0.14em] text-[rgba(56,44,29,0.92)]">{product.name}</h1>
              <p className="mt-4 text-[15px] md:text-[16px] tracking-[0.08em] leading-8 text-[rgba(122,104,82,0.82)]">{subtitle}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {moodTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full text-[11px] tracking-[0.08em] border border-[rgba(184,155,94,0.22)] bg-[rgba(239,231,215,0.8)] text-[rgba(122,104,82,0.78)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-7">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[rgba(122,104,82,0.62)]">護持功德金</p>
                <p className="font-serif-tc text-[30px] tracking-[0.08em] text-[rgba(86,63,30,0.92)]">NT${getMeritAmount(product)}</p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  className="px-6 py-3 rounded-full border border-[rgba(184,155,94,0.44)] bg-[rgba(247,242,232,0.92)] text-[rgba(86,63,30,0.92)] text-[13px] tracking-[0.12em]"
                >
                  立即請回
                </button>
                <button
                  onClick={toggleFavorite}
                  className="px-6 py-3 rounded-full border border-[rgba(184,155,94,0.3)] bg-[rgba(247,242,232,0.8)] text-[rgba(122,104,82,0.85)] text-[13px] tracking-[0.12em]"
                >
                  {isFavorite ? "♥ 已收藏法物" : "♡ 收藏法物"}
                </button>
              </div>
            </motion.div>
          </section>

          <section>
            <h2 className="font-serif-tc text-[28px] tracking-[0.14em] text-[rgba(86,63,30,0.9)]">此法物的意涵</h2>
            <p className="mt-6 max-w-4xl text-[16px] leading-9 tracking-[0.08em] text-[rgba(122,104,82,0.82)]">
              {meaning}
            </p>
          </section>

          <section>
            <h2 className="font-serif-tc text-[28px] tracking-[0.14em] text-[rgba(86,63,30,0.9)]">修行意義</h2>
            <p className="mt-6 max-w-4xl text-[16px] leading-9 tracking-[0.08em] text-[rgba(122,104,82,0.82)]">
              {reflection}
            </p>
          </section>

          <section>
            <h2 className="font-serif-tc text-[28px] tracking-[0.14em] text-[rgba(86,63,30,0.9)]">適合使用情境</h2>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {contexts.map((ctx) => (
                <div
                  key={ctx}
                  className="rounded-xl border px-4 py-4"
                  style={{ borderColor: "rgba(184,155,94,0.22)", background: "rgba(247,242,232,0.76)" }}
                >
                  <p className="text-[13px] tracking-[0.1em] text-[rgba(122,104,82,0.86)]">{ctx}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-serif-tc text-[28px] tracking-[0.14em] text-[rgba(86,63,30,0.9)]">修持方式</h2>
            <div className="mt-6 rounded-2xl border border-[rgba(184,155,94,0.24)] bg-[rgba(247,242,232,0.72)] p-6 md:p-8 space-y-4">
              {practiceSteps.length === 0 ? (
                <p className="text-[14px] tracking-[0.08em] text-[rgba(122,104,82,0.72)]">此法物尚未設定修持步驟。</p>
              ) : (
                practiceSteps.map((step, idx) => (
                  <div key={`${idx}-${step}`} className="flex items-start gap-3">
                    <span className="mt-0.5 h-6 w-6 rounded-full border border-[rgba(184,155,94,0.36)] bg-[rgba(239,231,215,0.82)] text-[12px] text-[rgba(122,104,82,0.82)] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <p className="text-[15px] leading-8 tracking-[0.08em] text-[rgba(122,104,82,0.84)]">{step}</p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-2xl border p-6 md:p-8" style={{ borderColor: "rgba(184,155,94,0.24)", background: "rgba(247,242,232,0.7)" }}>
            <h2 className="font-serif-tc text-[26px] tracking-[0.14em] text-[rgba(86,63,30,0.9)]">今日觀照</h2>
            <p className="mt-5 text-[16px] leading-9 tracking-[0.08em] text-[rgba(122,104,82,0.84)] whitespace-pre-line">{contemplation}</p>
          </section>

          <section>
            <h2 className="font-serif-tc text-[28px] tracking-[0.14em] text-[rgba(86,63,30,0.9)]">能量屬性</h2>
            <div className="mt-6 max-w-3xl space-y-4">
              {energyItems.map((item) => (
                <div key={item.key} className="flex items-center gap-5">
                  <span className="w-16 text-[14px] tracking-[0.1em] text-[rgba(122,104,82,0.82)]">{item.label}</span>
                  <div className="flex gap-1.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className="h-2.5 w-8 rounded-full"
                        style={{
                          background: i < energy[item.key] ? "rgba(184,155,94,0.66)" : "rgba(184,155,94,0.2)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-serif-tc text-[28px] tracking-[0.14em] text-[rgba(86,63,30,0.9)]">與此法物同行</h2>
            {related.length === 0 ? (
              <p className="mt-4 text-[14px] tracking-[0.08em] text-[rgba(122,104,82,0.72)]">目前尚無同分類法物，稍後再來看看。</p>
            ) : (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/products/${item.id}`}
                    className="rounded-xl border p-4 transition-all duration-300 hover:-translate-y-1"
                    style={{ borderColor: "rgba(184,155,94,0.24)", background: "rgba(247,242,232,0.76)" }}
                  >
                    <p className="font-serif-tc text-[18px] tracking-[0.1em] text-[rgba(86,63,30,0.9)]">{item.name}</p>
                    <p className="mt-2 text-[13px] tracking-[0.08em] text-[rgba(122,104,82,0.72)]">護持功德金 NT${getMeritAmount(item)}</p>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border p-6 md:p-8" style={{ borderColor: "rgba(184,155,94,0.24)", background: "rgba(247,242,232,0.7)" }}>
            <h2 className="font-serif-tc text-[24px] tracking-[0.14em] text-[rgba(86,63,30,0.9)]">此法物流轉的善念</h2>
            <p className="mt-4 text-[15px] leading-8 tracking-[0.08em] text-[rgba(122,104,82,0.82)] whitespace-pre-line">{dedication}</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
