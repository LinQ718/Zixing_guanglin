import Link from "next/link";
import type { Product } from "@/lib/admin/types";
import db from "@/data/admin-db.json";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductDetailClient from "./product-detail-client";

export async function generateStaticParams() {
  return db.products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = (db.products.find((p) => p.id === id) ?? null) as Product | null;

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

  return (
    <>
      <Navigation />
      <ProductDetailClient product={product} />
      <Footer />
    </>
  );
}
