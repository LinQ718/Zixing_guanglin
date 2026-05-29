"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import type { Course } from "@/lib/admin/types";

export default function QinianHall() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetch("/api/public/courses")
      .then((res) => res.json())
      .then((data) => setCourses((data.rows || []) as Course[]))
      .catch(() => setCourses([]));
  }, []);

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#faf7f2] pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="font-serif-tc text-4xl md:text-5xl tracking-[0.15em] text-[rgba(55,40,14,0.95)] mb-4">
              祈年殿・日日行課程
            </h1>
            <p className="text-[rgba(55,40,14,0.6)] text-base tracking-[0.08em]">課程內容由後台即時管理與同步</p>
          </motion.div>

          <div className="space-y-4">
            {courses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: i * 0.06 }}
                className="card-zen p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
              >
                <div className="flex-1">
                  <h3 className="font-serif-tc text-xl tracking-[0.12em] text-[rgba(55,40,14,0.9)] mb-2">{course.title}</h3>
                  <p className="text-[rgba(55,40,14,0.6)] text-sm tracking-[0.08em] leading-relaxed">{course.description}</p>
                  <p className="text-xs text-[rgba(76,62,41,0.66)] mt-3">講師：{course.teacher}</p>
                </div>
                <div className="md:text-right">
                  <span className="inline-block px-4 py-2 rounded-full bg-[rgba(200,185,154,0.1)] text-[rgba(55,40,14,0.7)] text-sm tracking-[0.08em] font-serif-tc whitespace-nowrap">
                    {course.date} {course.time}
                  </span>
                  <p className="text-xs text-[rgba(76,62,41,0.66)] mt-2">名額：{course.maxStudents}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
