"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import type { Product } from "@/lib/admin/types";
import {
  getCategoryPill,
  getContexts,
  getMeritAmount,
  getMoodTags,
  getPoeticSubtitle,
  isLightPatchCategory,
} from "@/lib/products/experience";

const accents = ["rgba(220,200,163", "rgba(184,155,94", "rgba(206,186,146", "rgba(172,152,126"];

type ProductView = Product & {
  accent: string;
  subtitle: string;
  moodTags: string[];
};

function getAtmosphere(product: ProductView) {
  const key = `${product.name} ${product.category}`;

  if (/回向|願心/.test(key)) {
    return {
      background:
        "radial-gradient(circle at 48% 36%, rgba(245,235,208,0.95) 0%, rgba(220,200,163,0.28) 34%, rgba(220,200,163,0) 72%), radial-gradient(120% 92% at 48% 72%, rgba(247,242,232,0.95) 0%, rgba(239,231,215,0.75) 46%, rgba(220,200,163,0.2) 100%)",
      overlays: [
        "linear-gradient(115deg, rgba(220,200,163,0) 0%, rgba(220,200,163,0.22) 45%, rgba(220,200,163,0) 100%)",
      ],
      symbol: "願",
    };
  }
  if (/經文扇|扇/.test(key)) {
    return {
      background:
        "radial-gradient(130% 100% at 20% 18%, rgba(247,242,232,0.98) 0%, rgba(239,231,215,0.76) 48%, rgba(220,200,163,0.22) 100%)",
      overlays: [
        "repeating-radial-gradient(circle at 18% 68%, rgba(184,155,94,0.22) 0 2px, rgba(184,155,94,0) 2px 26px)",
      ],
      symbol: "風",
    };
  }
  if (/觀息|禪香|香/.test(key)) {
    return {
      background:
        "radial-gradient(140% 100% at 52% 8%, rgba(247,242,232,0.95) 0%, rgba(239,231,215,0.78) 40%, rgba(220,200,163,0.24) 100%)",
      overlays: [
        "radial-gradient(70% 55% at 58% 62%, rgba(184,155,94,0.2) 0%, rgba(184,155,94,0) 78%)",
      ],
      symbol: "息",
    };
  }
  if (/檀香|安神/.test(key)) {
    return {
      background:
        "radial-gradient(circle at 52% 18%, rgba(245,228,188,0.92) 0%, rgba(220,200,163,0.34) 34%, rgba(64,46,24,0.16) 100%), linear-gradient(180deg, rgba(239,231,215,0.88) 0%, rgba(220,200,163,0.42) 100%)",
      overlays: [
        "radial-gradient(70% 52% at 48% 82%, rgba(220,200,163,0.2) 0%, rgba(220,200,163,0) 72%)",
      ],
      symbol: "寧",
    };
  }
  if (/穩根|光貼|七輪/.test(key)) {
    return {
      background:
        "radial-gradient(140% 96% at 50% 0%, rgba(247,242,232,0.96) 0%, rgba(239,231,215,0.72) 40%, rgba(184,155,94,0.18) 100%)",
      overlays: [
        "repeating-linear-gradient(108deg, rgba(184,155,94,0.15) 0 1px, rgba(184,155,94,0) 1px 18px)",
      ],
      symbol: "根",
    };
  }

  return {
    background:
      "radial-gradient(130% 96% at 18% 10%, rgba(247,242,232,1) 0%, rgba(239,231,215,0.78) 50%, rgba(220,200,163,0.2) 100%)",
    overlays: ["radial-gradient(circle at 72% 66%, rgba(184,155,94,0.16) 0%, rgba(184,155,94,0) 72%)"],
    symbol: "心",
  };
}

function getActionLabel(product: ProductView) {
  if (isLightPatchCategory(product.category)) return "與法物同行";
  if (product.category.includes("香")) return "閱讀法物故事";
  return "了解此法物";
}

type FavoriteItem = {
  id: string;
  name: string;
  kind: "法物" | "香品" | "光貼" | "課程";
};

const FAVORITES_KEY = "zixing-favorites";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductView[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as FavoriteItem[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    fetch("/api/public/products")
      .then((res) => res.json())
      .then((data) => {
        const rows = (data.rows || []) as Product[];
        setProducts(
          rows.map((row, i) => ({
            ...row,
            accent: accents[i % accents.length],
            subtitle: row.subtitle || row.shortDescription || getPoeticSubtitle(row.description),
            moodTags: (row.moodTags && row.moodTags.length > 0) ? row.moodTags : getMoodTags(row.category, row.name, row.description),
          }))
        );
      })
      .catch(() => setProducts([]));
  }, []);

  const soldOutSet = useMemo(
    () => new Set(products.filter((x) => x.stock <= 0 || x.status === "sold_out").map((x) => x.id)),
    [products]
  );

  const favoriteSet = useMemo(() => new Set(favorites.map((item) => item.id)), [favorites]);

  const saveFavorites = (next: FavoriteItem[]) => {
    setFavorites(next);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  };

  const toggleFavorite = (product: ProductView) => {
    const exists = favorites.some((f) => f.id === product.id);
    if (exists) {
      saveFavorites(favorites.filter((f) => f.id !== product.id));
      return;
    }

    const kind: FavoriteItem["kind"] = isLightPatchCategory(product.category)
      ? "光貼"
      : product.category.includes("香")
      ? "香品"
      : "法物";
    saveFavorites([{ id: product.id, name: product.name, kind }, ...favorites]);
  };

  return (
    <>
      <Navigation />
      <main className="relative min-h-screen pt-32 pb-24 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 10% 8%, rgba(247,242,232,1) 0%, rgba(239,231,215,0.9) 56%, rgba(247,242,232,1) 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 15% 22%, rgba(220,200,163,0.16) 0%, rgba(220,200,163,0) 45%), radial-gradient(circle at 85% 72%, rgba(184,155,94,0.12) 0%, rgba(184,155,94,0) 44%)",
          }}
        />

        <div className="relative z-10 max-w-[1320px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-14"
          >
            <h1 className="font-serif-tc text-4xl md:text-5xl tracking-[0.15em] text-[rgba(55,40,14,0.93)] mb-4">
              光林法物
            </h1>
            <p className="text-[rgba(122,104,82,0.78)] text-[15px] md:text-[16px] tracking-[0.08em] leading-relaxed max-w-3xl mx-auto">
              這不是購物清單，而是一份可以慢慢閱讀的修行手札。
              <br />
              每一件法物，陪你在日常裡安住身心，回到自性之光。
            </p>
          </motion.div>

          <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="flex flex-wrap items-center gap-2.5">
              {[
                "清心雅物",
                "光林雅藏",
                "自性香品",
                "光之能貼片系列",
                "七輪平衡・光能守護",
              ].map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1.5 rounded-full text-[11px] tracking-[0.12em] border"
                  style={{
                    borderColor: "rgba(184,155,94,0.32)",
                    background: "rgba(247,242,232,0.7)",
                    color: "rgba(122,104,82,0.85)",
                  }}
                >
                  ✦ {cat}
                </span>
              ))}
            </div>

            <Link
              href="/products/light-patch"
              className="self-start md:self-auto px-5 py-2.5 rounded-full border text-[12px] tracking-[0.14em]"
              style={{
                borderColor: "rgba(184,155,94,0.42)",
                color: "rgba(122,104,82,0.86)",
                background: "rgba(247,242,232,0.9)",
              }}
            >
              進入光能貼片專區
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 justify-items-center">
            {products.map((product, i) => (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group w-full md:w-[420px] md:h-[620px] rounded-[32px] border overflow-hidden relative flex flex-col"
                style={{
                  borderColor: "rgba(184,155,94,0.24)",
                  background: "rgba(247,242,232,0.82)",
                  boxShadow: "0 18px 48px rgba(96,72,36,0.08)",
                }}
                whileHover={{ y: -8 }}
              >
                {(() => {
                  const atmosphere = getAtmosphere(product);
                  const contexts = (product.useCases && product.useCases.length > 0 ? product.useCases : getContexts(product.category)).slice(0, 3);

                  return (
                    <>
                <div
                  className="relative overflow-hidden h-[55%] min-h-[300px]"
                  style={{
                    background: atmosphere.background,
                  }}
                >
                  {product.imageUrl ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(35,24,8,0.14)] via-transparent to-transparent" />
                    </>
                  ) : null}

                  {atmosphere.overlays.map((overlay, idx) => (
                    <div key={idx} className="absolute inset-0 pointer-events-none" style={{ background: overlay }} />
                  ))}

                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{ opacity: [0.14, 0.24, 0.14] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    style={{ background: `radial-gradient(circle at 50% 40%, ${product.accent},0.2) 0%, rgba(220,200,163,0) 72%)` }}
                  />

                  <div className="absolute top-4 left-4">
                    <span
                      className="px-3 py-1.5 rounded-full text-[11px] tracking-[0.12em] border"
                      style={{
                        borderColor: "rgba(184,155,94,0.36)",
                        background: "rgba(247,242,232,0.8)",
                        color: "rgba(122,104,82,0.88)",
                      }}
                    >
                      {getCategoryPill(product.category)}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleFavorite(product)}
                    className="absolute top-4 right-4 h-9 w-9 rounded-full border flex items-center justify-center text-[15px]"
                    style={{
                      borderColor: favoriteSet.has(product.id) ? "rgba(184,155,94,0.62)" : "rgba(184,155,94,0.26)",
                      background: "rgba(247,242,232,0.82)",
                      color: favoriteSet.has(product.id) ? "rgba(184,155,94,0.95)" : "rgba(122,104,82,0.72)",
                    }}
                    aria-label="收藏法物"
                  >
                    {favoriteSet.has(product.id) ? "♥" : "♡"}
                  </button>

                  <div className="absolute inset-x-0 bottom-8 flex flex-col items-center">
                    <div
                      className="h-16 w-16 rounded-full flex items-center justify-center border"
                      style={{
                        borderColor: "rgba(184,155,94,0.34)",
                        background: "rgba(247,242,232,0.66)",
                        color: "rgba(122,104,82,0.86)",
                        boxShadow: "0 8px 24px rgba(96,72,36,0.08)",
                      }}
                    >
                      <span className="font-serif-tc text-[24px] tracking-[0.08em]">{atmosphere.symbol}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.moodTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full text-[11px] tracking-[0.08em]"
                        style={{
                          background: "rgba(239,231,215,0.85)",
                          color: "rgba(122,104,82,0.78)",
                          border: "1px solid rgba(184,155,94,0.2)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-serif-tc text-[34px] leading-[1.2] tracking-[0.12em] text-[rgba(56,44,29,0.92)] line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="mt-3 text-[15px] leading-8 tracking-[0.06em] text-[rgba(122,104,82,0.84)] line-clamp-2">
                    {product.subtitle}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="text-[12px] tracking-[0.12em] text-[rgba(122,104,82,0.7)]">適合：</span>
                    {contexts.map((ctx) => (
                      <span
                        key={ctx}
                        className="text-[12px] tracking-[0.08em]"
                        style={{
                          color: "rgba(122,104,82,0.82)",
                        }}
                      >
                        ✓ {ctx}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                    <div>
                      <p className="text-[11px] tracking-[0.18em] text-[rgba(122,104,82,0.62)] uppercase">護持功德金</p>
                      <p className="font-serif-tc text-[22px] tracking-[0.08em] text-[rgba(122,104,82,0.92)]">
                        NT${getMeritAmount(product)}
                      </p>
                    </div>

                    <Link
                      href={`/products/${product.id}`}
                      className="relative overflow-hidden px-4 py-2.5 rounded-full text-[12px] tracking-[0.12em] border group/btn"
                      style={{
                        borderColor: soldOutSet.has(product.id) ? "rgba(184,155,94,0.2)" : "rgba(184,155,94,0.42)",
                        color: soldOutSet.has(product.id) ? "rgba(122,104,82,0.45)" : "rgba(86,63,30,0.88)",
                        background: "rgba(247,242,232,0.9)",
                        pointerEvents: soldOutSet.has(product.id) ? "none" : "auto",
                      }}
                    >
                      <span className="relative z-10">{getActionLabel(product)}</span>
                      <span
                        className="absolute inset-y-0 -left-[42%] w-[40%] -skew-x-12 opacity-0 group-hover/btn:opacity-100 group-hover/btn:left-[120%] transition-all duration-700"
                        style={{ background: "linear-gradient(90deg, transparent, rgba(220,200,163,0.6), transparent)" }}
                      />
                    </Link>
                  </div>
                </div>
                    </>
                  );
                })()}
              </motion.article>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border p-6 md:p-7"
            style={{ borderColor: "rgba(184,155,94,0.2)", background: "rgba(247,242,232,0.62)" }}
          >
            <h2 className="font-serif-tc text-[24px] tracking-[0.14em] text-[rgba(86,63,30,0.9)]">我的光林收藏</h2>
            <p className="mt-2 text-[13px] tracking-[0.08em] text-[rgba(122,104,82,0.72)]">
              ♡ 收藏法物後可在此查看。登入會員後，可跨裝置同步你的香品、法物、光貼與課程收藏。
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {["香品", "法物", "光貼", "課程"].map((kind) => (
                <span
                  key={kind}
                  className="px-3 py-1.5 rounded-full text-[11px] tracking-[0.1em]"
                  style={{
                    background: "rgba(239,231,215,0.82)",
                    color: "rgba(122,104,82,0.78)",
                    border: "1px solid rgba(184,155,94,0.2)",
                  }}
                >
                  {kind}
                </span>
              ))}
            </div>

            {favorites.length === 0 ? (
              <p className="mt-5 text-[13px] tracking-[0.08em] text-[rgba(122,104,82,0.68)]">尚未收藏法物。</p>
            ) : (
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                {favorites.slice(0, 8).map((item) => (
                  <div
                    key={item.id}
                    className="px-4 py-3 rounded-xl border flex items-center justify-between"
                    style={{ borderColor: "rgba(184,155,94,0.2)", background: "rgba(247,242,232,0.82)" }}
                  >
                    <div>
                      <p className="font-serif-tc text-[15px] tracking-[0.08em] text-[rgba(86,63,30,0.9)]">{item.name}</p>
                      <p className="text-[11px] tracking-[0.12em] text-[rgba(122,104,82,0.62)]">{item.kind}</p>
                    </div>
                    <button
                      onClick={() => saveFavorites(favorites.filter((f) => f.id !== item.id))}
                      className="text-[12px] tracking-[0.08em]"
                      style={{ color: "rgba(122,104,82,0.68)" }}
                    >
                      移除
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
