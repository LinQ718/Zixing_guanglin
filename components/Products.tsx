"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { Product } from "@/lib/admin/types";

const accents = ["rgba(200,185,154", "rgba(180,210,170", "rgba(210,185,220", "rgba(220,200,150"];

type ProductView = Product & {
  subtitle: string;
  tag: string;
  accent: string;
};

function ProductCard({
  product,
  index,
  inView,
}: {
  product: ProductView;
  index: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.1, delay: 0.12 * index, ease: [0.22, 1, 0.36, 1] }}
      className="card-zen group cursor-default overflow-hidden"
    >
      {/* Product image placeholder */}
      <div
        className="relative overflow-hidden"
        style={{ paddingBottom: "70%", background: "rgba(235,228,218,0.7)" }}
      >
        {product.imageUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.imageUrl}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(35,24,8,0.2)] via-transparent to-transparent" />
          </>
        ) : null}

        {/* Simulated product backdrop */}
        <div
          className={`absolute inset-0 flex items-center justify-center ${product.imageUrl ? "opacity-0 group-hover:opacity-100 transition-opacity duration-500" : ""}`}
          style={{
            background: `radial-gradient(ellipse at 40% 35%, ${product.accent},0.07) 0%, transparent 70%)`,
          }}
        >
          {/* Wood grain texture hint */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                transparent 0px,
                transparent 20px,
                rgba(138,109,65,0.12) 20px,
                rgba(138,109,65,0.12) 21px
              )`,
            }}
          />
          {/* Product icon */}
          <div className="relative z-10 flex flex-col items-center gap-3">
            <svg width="48" height="48" viewBox="0 0 100 100" fill="none" className="opacity-25 group-hover:opacity-45 transition-opacity duration-500">
              {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                <ellipse
                  key={i}
                  cx="50"
                  cy="28"
                  rx="8"
                  ry="17"
                  transform={`rotate(${deg}, 50, 50)`}
                  fill={`${product.accent},0.15)`}
                  stroke={`${product.accent},0.5)`}
                  strokeWidth="0.7"
                />
              ))}
              <circle cx="50" cy="50" r="7" fill={`${product.accent},0.4)`} stroke={`${product.accent},0.6)`} strokeWidth="0.8" />
            </svg>
            {/* Natural light streak */}
            <div
              className="absolute top-4 right-8 w-px h-12 opacity-20 group-hover:opacity-35 transition-opacity duration-500"
              style={{ background: `linear-gradient(to bottom, ${product.accent},0.8), transparent)` }}
            />
          </div>
        </div>

        {/* Tag */}
        <div className="absolute top-3 right-3 z-10">
          <span
            className="text-[9px] tracking-[0.3em] px-2 py-1 uppercase"
            style={{
              background: "rgba(235,228,218,0.7)",
              border: `1px solid ${product.accent},0.25)`,
              color: `${product.accent},0.7)`,
            }}
          >
            {product.tag}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-serif-tc text-[15px] tracking-[0.15em] text-[rgba(50,35,10,0.85)] group-hover:text-[rgba(100,72,28,1)] transition-colors duration-400">
              {product.name}
            </h3>
            <p className="text-[10px] tracking-[0.25em] text-[rgba(120,90,45,0.45)] mt-0.5 uppercase">
              {product.subtitle}
            </p>
          </div>
          <div
            className="w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400"
          >
            <span className="text-[rgba(138,109,65,0.6)] text-[10px]">→</span>
          </div>
        </div>
        <div
          className="w-8 h-px mb-3 transition-all duration-500 group-hover:w-14"
          style={{ background: `linear-gradient(90deg, ${product.accent},0.4), transparent)` }}
        />
        <p className="text-[11.5px] tracking-[0.04em] text-[rgba(100,75,35,0.52)] leading-relaxed">
          {product.desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function Products() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const [products, setProducts] = useState<ProductView[]>([]);

  useEffect(() => {
    fetch("/api/public/products")
      .then((res) => res.json())
      .then((data) => {
        const rows = (data.rows || []) as Product[];
        setProducts(
          rows.map((row, index) => ({
            ...row,
            subtitle: row.category || "Practice Item",
            tag: row.category || "法物",
            accent: accents[index % accents.length],
          }))
        );
      })
      .catch(() => setProducts([]));
  }, []);

  return (
    <section
      id="products"
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-28"
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 60% 50%, rgba(210,235,215,0.3) 0%, rgba(250,247,242,1) 65%)",
        }}
      />

      {/* Linen texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent 0px, transparent 2px,
            rgba(138,109,65,0.08) 2px, rgba(138,109,65,0.08) 3px
          ), repeating-linear-gradient(
            90deg,
            transparent 0px, transparent 4px,
            rgba(138,109,65,0.04) 4px, rgba(138,109,65,0.04) 5px
          )`,
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2 }}
          className="text-center mb-16"
        >
          <span className="text-[10px] tracking-[0.5em] text-[rgba(120,90,45,0.45)] uppercase">
            Practice Tools
          </span>
          <div className="divider-zen my-4" />
          <h2 className="font-serif-tc text-[clamp(1.8rem,4.5vw,2.8rem)] font-light tracking-[0.25em] text-gold-gradient">
            修持法物
          </h2>
          <p className="mt-4 text-[13px] tracking-[0.1em] text-[rgba(100,75,35,0.55)] leading-loose max-w-md mx-auto">
            每一件法物，都是日常修行的提醒
            <br />
            讓願行與定心，可以被實際練習
          </p>
        </motion.div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} inView={inView} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-12 flex justify-center"
        >
          <a href="/products" className="btn-zen text-[13px] px-10 py-3.5 tracking-[0.2em]">
            查看全部修持法物
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
