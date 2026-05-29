"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import zixingLogo from "./Logo/zixinglogo.png";

export default function Footer() {
  return (
    <footer className="relative py-20 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(250,247,242,1) 0%, rgba(244,240,232,1) 100%)",
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(138,109,65,0.2), transparent)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex justify-center">
            <Image
              src={zixingLogo}
              alt="自性光林 Logo"
              className="h-auto w-[150px] md:w-[170px] opacity-90"
            />
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="font-serif-tc text-[13px] tracking-[0.2em] text-[rgba(120,90,45,0.4)] leading-loose mb-10"
        >
          每日修持，日日照見
        </motion.p>

        {/* Nav links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6 mb-10"
        >
          {["今日心語", "日日修心", "一念燈海", "光林祈願", "修持法物", "我的修行樹"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-[11px] tracking-[0.2em] text-[rgba(120,90,45,0.35)] hover:text-[rgba(100,72,28,0.7)] transition-colors duration-300"
            >
              {item}
            </a>
          ))}
        </motion.div>

        <div
          className="w-full max-w-xs mx-auto h-px mb-8"
          style={{ background: "linear-gradient(90deg, transparent, rgba(200,185,154,0.12), transparent)" }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          viewport={{ once: true }}
          className="text-[10px] tracking-[0.2em] text-[rgba(120,90,45,0.3)]"
        >
          © 2026 自性光林 Zixing Guanglin · All Rights Reserved
        </motion.p>
      </div>
    </footer>
  );
}
