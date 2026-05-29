import type { Metadata } from "next";
import { Noto_Serif_TC, Noto_Sans_TC } from "next/font/google";
import "./globals.css";

const notoSerifTC = Noto_Serif_TC({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "自性光林｜讓心慢下來的地方",
  description: "一念清淨，自有光明。在紛擾世界裡，留一處讓心安靜的地方。透過靜心、祝福、善念與修心的日常，重新感受內在平衡與生命流動。",
  keywords: "禪意,靜心,修心,祝福,光明,蓮花,善念,內在平衡",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-TW"
      className={`${notoSerifTC.variable} ${notoSansTC.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[#faf7f2]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
