"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Icons } from "@/components/Icons";
import type { Notice } from "@/lib/admin/types";

export default function DengDeng() {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    fetch("/api/public/notices")
      .then((res) => res.json())
      .then((data) => setNotices((data.rows || []) as Notice[]))
      .catch(() => setNotices([]));
  }, []);

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#faf7f2] pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 text-[rgba(200,185,154,0.8)]">
                <Icons.BellIcon />
              </div>
              <h1 className="font-serif-tc text-4xl md:text-5xl tracking-[0.15em] text-[rgba(55,40,14,0.95)]">噔噔</h1>
            </div>
            <p className="text-[rgba(55,40,14,0.6)] text-lg tracking-[0.08em] leading-relaxed">
              通知由後台發布後即時同步到前台
            </p>
          </motion.div>

          <div className="space-y-4">
            {notices.map((notice, i) => (
              <motion.a
                key={notice.id}
                href={notice.link || "#"}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="card-zen p-6 border-l-4 border-[rgba(200,185,154,0.8)] block"
              >
                <div className="flex gap-4">
                  <div className="w-8 h-8 flex-shrink-0 text-[rgba(200,185,154,0.8)]">
                    <Icons.CommentIcon />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif-tc text-lg tracking-[0.12em] text-[rgba(55,40,14,0.95)]">{notice.title}</h3>
                    <p className="text-[rgba(55,40,14,0.6)] text-sm tracking-[0.08em] leading-relaxed mt-2">{notice.content}</p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
