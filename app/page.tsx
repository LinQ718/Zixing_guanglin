"use client";

import dynamic from "next/dynamic";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import DailyWisdom from "@/components/DailyWisdom";
import FeaturesSection from "@/components/FeaturesSection";
const DailyPractice = dynamic(() => import("@/components/DailyPractice"));
const LanternSea = dynamic(() => import("@/components/LanternSea"));
const Blessings = dynamic(() => import("@/components/Blessings"));
const Products = dynamic(() => import("@/components/Products"));
const MemberTree = dynamic(() => import("@/components/MemberTree"));
const Footer = dynamic(() => import("@/components/Footer"));

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <DailyWisdom />
        <DailyPractice />
        <LanternSea />
        <Blessings />
        <FeaturesSection />
        <Products />
        <MemberTree />
      </main>
      <Footer />
    </>
  );
}
