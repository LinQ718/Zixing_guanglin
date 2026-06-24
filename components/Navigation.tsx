"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import zixingLogo from "./Logo/zixinglogo.png";

const navLinks = [
  { label: "今日心語", href: "/#wisdom" },
  { label: "日日修心", href: "/#practice" },
  { label: "一念燈海", href: "/#lantern" },
  { label: "光林祈願", href: "/#blessing" },
  { label: "光林結緣", href: "/#products" },
];

const secondaryLinks = [
  { label: "修行薄", href: "/practice-notebook" },
  { label: "噔噔", href: "/deng-deng" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
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

  const navShellClass = scrolled
    ? "bg-[rgba(250,247,242,0.84)] border-[rgba(138,109,65,0.1)] shadow-[0_14px_36px_rgba(138,109,65,0.08)]"
    : "bg-[rgba(250,247,242,0.36)] border-[rgba(138,109,65,0.06)] shadow-[0_10px_28px_rgba(138,109,65,0.04)]";

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 pt-3 md:pt-4"
    >
      <div
        className={`mx-auto max-w-7xl rounded-[1.4rem] border backdrop-blur-[16px] transition-all duration-700 ${navShellClass}`}
      >
        <div className="px-4 sm:px-6 md:px-8 py-4 md:py-4.5 flex items-center gap-4 md:gap-6">
          <Link
            href="/"
            aria-label="自性光林首頁"
            className="flex items-center gap-3 shrink-0 min-w-0 group"
          >
            <Image
              src={zixingLogo}
              alt="自性光林 Logo"
              priority
              className="h-auto w-[46px] md:w-[50px] drop-shadow-[0_2px_6px_rgba(138,109,65,0.12)] transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <span className="hidden sm:flex flex-col min-w-0">
              <span className="font-serif-tc text-[15px] md:text-[16px] tracking-[0.22em] text-[rgba(86,64,28,0.95)] whitespace-nowrap">
                自性光林
              </span>
              <span className="mt-1 text-[9px] tracking-[0.3em] uppercase text-[rgba(138,109,65,0.46)] whitespace-nowrap">
                Inner Calm Sanctuary
              </span>
            </span>
          </Link>

          <div className="hidden lg:flex flex-1 items-center justify-center">
            <div className="flex items-center gap-1 rounded-full border border-[rgba(138,109,65,0.08)] bg-[rgba(255,252,248,0.26)] px-2 py-1.5 shadow-[0_8px_20px_rgba(138,109,65,0.03)]">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative rounded-full px-3.5 py-2 text-[11px] tracking-[0.18em] text-[rgba(74,54,22,0.68)] transition-all duration-300 hover:bg-[rgba(255,255,255,0.42)] hover:text-[rgba(100,72,28,0.98)]"
                >
                  {link.label}
                  <span className="absolute left-3.5 right-3.5 -bottom-0.5 h-px scale-x-0 bg-gradient-to-r from-[rgba(200,185,154,0.78)] to-transparent transition-transform duration-300 hover:scale-x-100" />
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {secondaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-[11px] tracking-[0.16em] text-[rgba(96,70,30,0.72)] transition-colors duration-300 hover:text-[rgba(100,72,28,1)]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/join"
              className="rounded-full border border-[rgba(138,109,65,0.18)] bg-[linear-gradient(135deg,rgba(214,184,114,0.14),rgba(250,247,242,0.78))] px-5 py-2.5 text-[12px] tracking-[0.18em] text-[rgba(88,62,25,0.96)] shadow-[0_6px_16px_rgba(138,109,65,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(138,109,65,0.1)]"
            >
              進入光林
            </Link>
          </div>

          <div className="ml-auto lg:hidden flex items-center gap-2">
            <Link
              href="/join"
              className="hidden sm:inline-flex rounded-full border border-[rgba(138,109,65,0.14)] bg-[rgba(255,252,248,0.28)] px-4 py-2 text-[12px] tracking-[0.18em] text-[rgba(88,62,25,0.92)]"
            >
              進入光林
            </Link>
            <button
              className="flex flex-col gap-1.5 rounded-full border border-[rgba(138,109,65,0.08)] bg-[rgba(255,252,248,0.28)] p-2.5 backdrop-blur-md"
              onClick={() => setMenuOpen((current) => !current)}
              aria-label="Menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-menu"
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`block h-px bg-[rgba(138,109,65,0.72)] transition-all duration-300 ${
                    i === 0
                      ? menuOpen ? "w-6 translate-y-2.5 rotate-45" : "w-6"
                      : i === 1
                      ? menuOpen ? "w-0 opacity-0" : "w-4"
                      : menuOpen ? "w-6 -translate-y-2.5 -rotate-45" : "w-5"
                  }`}
                />
              ))}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav-menu"
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="mt-3 mx-auto max-w-7xl overflow-hidden rounded-[1.4rem] border border-[rgba(138,109,65,0.08)] bg-[rgba(250,247,242,0.92)] backdrop-blur-[16px] shadow-[0_18px_34px_rgba(138,109,65,0.08)] lg:hidden"
          >
            <div className="px-5 py-6">
              <div className="grid grid-cols-2 gap-2">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-2xl border border-[rgba(138,109,65,0.08)] bg-[rgba(255,255,255,0.35)] px-4 py-4 text-[13px] tracking-[0.14em] text-[rgba(74,54,22,0.78)] transition-colors duration-300 hover:text-[rgba(100,72,28,1)]"
                  >
                    {link.label}
                  </motion.a>
                ))}
                {secondaryLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (navLinks.length + i) * 0.05 }}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-2xl border border-[rgba(138,109,65,0.08)] bg-[rgba(255,255,255,0.28)] px-4 py-4 text-[13px] tracking-[0.14em] text-[rgba(74,54,22,0.72)] transition-colors duration-300 hover:text-[rgba(100,72,28,1)]"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>

              <Link
                href="/join"
                onClick={() => setMenuOpen(false)}
                className="mt-4 flex w-full items-center justify-center rounded-full border border-[rgba(138,109,65,0.18)] bg-[linear-gradient(135deg,rgba(214,184,114,0.14),rgba(250,247,242,0.8))] px-5 py-3 text-[12px] tracking-[0.2em] text-[rgba(88,62,25,0.96)]"
              >
                進入光林
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
