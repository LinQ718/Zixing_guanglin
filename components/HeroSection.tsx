"use client";

import Link from "next/link";
import {
  motion,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import heroBackground from "./Logo/Hero Background.png";

function AmbientPulse({
  className,
  delay,
}: {
  className: string;
  delay: number;
}) {
  return (
    <motion.div
      aria-hidden
      className={className}
      initial={{ opacity: 0.15, scale: 0.94 }}
      animate={{ opacity: 0.32, scale: 1.04 }}
      transition={{
        duration: 8.5,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
        delay,
      }}
    />
  );
}

export default function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full overflow-hidden bg-[rgb(247,241,231)]"
    >
      {/* Background image and atmosphere */}
      <div className="absolute inset-0">
        <Image
          src={heroBackground}
          alt="自性光林禪意湖景"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(108deg, rgba(248,241,229,0.72) 0%, rgba(248,241,229,0.5) 30%, rgba(248,241,229,0.2) 56%, rgba(248,241,229,0.07) 74%, rgba(248,241,229,0.03) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 82% 20%, rgba(117,92,54,0.12) 0%, rgba(117,92,54,0.05) 30%, transparent 62%)",
          }}
        />
      </div>

      {!reduceMotion && (
        <>
          <AmbientPulse
            delay={0}
            className="pointer-events-none absolute -left-16 top-[-9rem] h-[18rem] w-[18rem] rounded-full bg-[radial-gradient(circle,rgba(213,181,125,0.17),rgba(213,181,125,0.03)_62%,transparent_70%)] blur-sm"
          />
          <AmbientPulse
            delay={0.8}
            className="pointer-events-none absolute right-[-5rem] top-[26%] h-[14rem] w-[14rem] rounded-full bg-[radial-gradient(circle,rgba(92,130,109,0.15),rgba(92,130,109,0.04)_62%,transparent_70%)]"
          />
        </>
      )}

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 pb-14 pt-28 md:px-10 lg:px-14">
        <div className="grid w-full items-end gap-8 lg:gap-14">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: "easeOut", delay: 0.05 }}
              className="mb-6 inline-flex items-center gap-3 rounded-full border border-[rgba(120,94,54,0.26)] bg-[rgba(255,252,246,0.62)] px-4 py-2 text-[11px] tracking-[0.34em] text-[rgba(90,64,28,0.82)] shadow-[0_8px_26px_rgba(90,64,28,0.07)]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[rgba(134,102,57,0.65)]" />
              ZIXING GUANGLIN
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.05, ease: "easeOut" }}
              className="font-serif-tc text-[clamp(2.55rem,7.8vw,5.4rem)] leading-[1.07] tracking-[0.08em] text-[rgba(44,27,7,0.96)]"
              style={{
                textShadow: "0 8px 24px rgba(70,44,18,0.13)",
              }}
            >
              讓心慢下來
              <br />
              把光留進呼吸
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.82, ease: "easeOut", delay: 0.2 }}
              className="my-8 h-px w-28 bg-gradient-to-r from-[rgba(176,136,76,0.84)] via-[rgba(176,136,76,0.35)] to-transparent"
              style={{ transformOrigin: "left" }}
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="mb-10 max-w-xl text-[1rem] font-light leading-[1.95] tracking-[0.03em] text-[rgba(60,39,14,0.92)] md:text-[1.14rem]"
            >
              在紛擾之中，
              <br />
              用靜心、祝福與修行的節律，
              <br />
              陪你把溫柔與清明，安放回日常。
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
              className="mb-11 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/#practice"
                className="relative flex items-center gap-2 overflow-hidden rounded-full border border-[rgba(176,137,76,0.56)] bg-[linear-gradient(132deg,rgba(194,152,86,0.98),rgba(150,112,56,0.98))] px-8 py-3 text-[12px] tracking-[0.24em] text-[rgba(255,248,234,0.98)] shadow-[0_14px_30px_rgba(111,77,33,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(111,77,33,0.34)]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[rgba(255,248,230,0.95)]" />
                開始修心
              </Link>

              <Link
                href="/#blessing"
                className="flex items-center gap-2 rounded-full border border-[rgba(123,95,57,0.24)] bg-[rgba(255,252,248,0.52)] px-7 py-3 text-[12px] tracking-[0.22em] text-[rgba(75,53,24,0.9)] backdrop-blur-md transition-all duration-300 hover:bg-[rgba(255,252,248,0.74)]"
                style={{
                  borderColor: "rgba(138,109,65,0.28)",
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[rgba(138,109,65,0.42)]" />
                點燈祈福
              </Link>
            </motion.div>

          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(248,241,231,0), rgba(248,241,231,0.4) 70%, rgba(248,241,231,0.92) 100%)",
        }}
      />
    </section>
  );
}
