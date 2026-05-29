"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function JoinMember() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    practice: "",
    motivation: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 模擬提交
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", phone: "", practice: "", motivation: "" });
    }, 3000);
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#faf7f2] pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <h1 className="font-serif-tc text-4xl md:text-5xl tracking-[0.15em] text-[rgba(55,40,14,0.95)] mb-4">
              歡迎加入光林
            </h1>
            <p className="text-[rgba(55,40,14,0.6)] text-lg tracking-[0.08em] leading-relaxed">
              一起在靜心修行的路上，互相陪伴、互相成長
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="card-zen p-8 md:p-12 bg-white/60 backdrop-blur-sm"
          >
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block font-serif-tc text-[rgba(55,40,14,0.8)] mb-3">
                    姓名
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[rgba(200,185,154,0.3)] rounded-lg bg-[rgba(250,247,242,0.8)] text-[rgba(55,40,14,0.8)] placeholder-[rgba(138,109,65,0.3)] focus:outline-none focus:border-[rgba(200,185,154,0.8)] focus:ring-1 focus:ring-[rgba(200,185,154,0.2)] transition-all duration-300"
                    placeholder="請輸入您的姓名"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block font-serif-tc text-[rgba(55,40,14,0.8)] mb-3">
                    電郵地址
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[rgba(200,185,154,0.3)] rounded-lg bg-[rgba(250,247,242,0.8)] text-[rgba(55,40,14,0.8)] placeholder-[rgba(138,109,65,0.3)] focus:outline-none focus:border-[rgba(200,185,154,0.8)] focus:ring-1 focus:ring-[rgba(200,185,154,0.2)] transition-all duration-300"
                    placeholder="example@email.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block font-serif-tc text-[rgba(55,40,14,0.8)] mb-3">
                    電話號碼
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[rgba(200,185,154,0.3)] rounded-lg bg-[rgba(250,247,242,0.8)] text-[rgba(55,40,14,0.8)] placeholder-[rgba(138,109,65,0.3)] focus:outline-none focus:border-[rgba(200,185,154,0.8)] focus:ring-1 focus:ring-[rgba(200,185,154,0.2)] transition-all duration-300"
                    placeholder="請輸入電話號碼"
                  />
                </div>

                {/* Practice Focus */}
                <div>
                  <label htmlFor="practice" className="block font-serif-tc text-[rgba(55,40,14,0.8)] mb-3">
                    修行重點
                  </label>
                  <select
                    id="practice"
                    name="practice"
                    value={formData.practice}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[rgba(200,185,154,0.3)] rounded-lg bg-[rgba(250,247,242,0.8)] text-[rgba(55,40,14,0.8)] focus:outline-none focus:border-[rgba(200,185,154,0.8)] focus:ring-1 focus:ring-[rgba(200,185,154,0.2)] transition-all duration-300"
                  >
                    <option value="">請選擇</option>
                    <option value="meditation">靜坐冥想</option>
                    <option value="breathing">觀息調息</option>
                    <option value="mindfulness">正念修心</option>
                    <option value="dedication">善願回向</option>
                    <option value="general">日常修行</option>
                  </select>
                </div>

                {/* Motivation */}
                <div>
                  <label htmlFor="motivation" className="block font-serif-tc text-[rgba(55,40,14,0.8)] mb-3">
                    想對我們說的話
                  </label>
                  <textarea
                    id="motivation"
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-[rgba(200,185,154,0.3)] rounded-lg bg-[rgba(250,247,242,0.8)] text-[rgba(55,40,14,0.8)] placeholder-[rgba(138,109,65,0.3)] focus:outline-none focus:border-[rgba(200,185,154,0.8)] focus:ring-1 focus:ring-[rgba(200,185,154,0.2)] transition-all duration-300 resize-none"
                    placeholder="分享您的修行願景或任何想法..."
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full btn-zen py-4 text-lg tracking-[0.12em] font-serif-tc"
                >
                  確認加入光林
                </motion.button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="text-5xl mb-6">🙏</div>
                <h2 className="font-serif-tc text-2xl tracking-[0.15em] text-[rgba(55,40,14,0.9)] mb-4">
                  感謝您的加入
                </h2>
                <p className="text-[rgba(55,40,14,0.6)] tracking-[0.08em] leading-relaxed max-w-sm mx-auto">
                  我們已收到您的申請，將在 24 小時內與您聯繫。歡迎您加入光林修行的大家庭。
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-20 grid md:grid-cols-3 gap-8"
          >
            {[
              { title: "修行社群", desc: "與志同道合的修行者相聚，互相支持與啟發" },
              { title: "學習資源", desc: "獲得專業教學、經文指引與定課建議" },
              { title: "獨享福利", desc: "會員專享商品折扣、活動邀請與靜修營機會" },
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                className="text-center p-6 rounded-lg bg-gradient-to-br from-[rgba(200,185,154,0.05)] to-[rgba(180,210,170,0.05)]"
              >
                <h3 className="font-serif-tc text-lg tracking-[0.12em] text-[rgba(55,40,14,0.9)] mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-[rgba(55,40,14,0.6)] tracking-[0.08em] leading-relaxed">
                  {benefit.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
