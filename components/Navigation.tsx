"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import zixingLogo from "./Logo/zixinglogo.png";

const navLinks = [
  { label: "今日心語", href: "/#wisdom" },
  { label: "日日修心", href: "/#practice" },
  { label: "一念燈海", href: "/#lantern" },
  { label: "光林祈願", href: "/#blessing" },
  { label: "光林結緣", href: "/#products" },
  { label: "修行薄", href: "/practice-notebook" },
  { label: "噔噔", href: "/deng-deng" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    handleScroll(); // Check initial scroll position
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "bg-[rgba(250,247,242,0.96)] backdrop-blur-xl border-b border-[rgba(138,109,65,0.1)] shadow-[0_1px_20px_rgba(138,109,65,0.05)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center group" aria-label="自性光林首頁">
          <Image
            src={zixingLogo}
            alt="自性光林 Logo"
            priority
            className="h-auto w-[124px] md:w-[138px]"
          />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[13px] tracking-[0.12em] text-[rgba(55,40,14,0.6)] hover:text-[rgba(100,72,28,1)] transition-colors duration-300 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-[rgba(200,185,154,0.8)] to-transparent group-hover:w-full transition-all duration-400" />
            </a>
          ))}
          <a href="/join" className="btn-zen text-[13px] px-5 py-2">
            進入光林
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`block h-px bg-[rgba(200,185,154,0.6)] transition-all duration-300 ${
                i === 0
                  ? menuOpen ? "w-6 translate-y-2.5 rotate-45" : "w-6"
                  : i === 1
                  ? menuOpen ? "opacity-0 w-4" : "w-4"
                  : menuOpen ? "w-6 -translate-y-2.5 -rotate-45" : "w-5"
              }`}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-[rgba(250,247,242,0.98)] backdrop-blur-xl border-t border-[rgba(138,109,65,0.1)]"
          >
            <div className="flex flex-col items-center gap-6 py-8 px-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setMenuOpen(false)}
                  className="text-[15px] tracking-[0.15em] text-[rgba(55,40,14,0.65)] hover:text-[rgba(100,72,28,1)] transition-colors duration-300"
                >
                  {link.label}
                </motion.a>
              ))}
              <a href="/join" className="btn-zen mt-2 text-[14px] px-8 py-3">
                進入光林
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
