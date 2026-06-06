"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Wrench, Zap } from "lucide-react";
import Container from "@/components/Container";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden" aria-label="بنر اصلی">
      <div className="relative min-h-[320px] sm:min-h-[400px] lg:min-h-[460px]">
        <Image
          src="/images/laser-service-hero.png"
          alt="تجهیزات لیزر پوست در کلینیک"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        
        <motion.div
          className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/50 to-black/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        
        <Container className="relative z-10 flex min-h-[320px] items-center sm:min-h-[400px] lg:min-h-[460px]">
          <motion.div
            className="max-w-xl py-12 text-white"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="mb-2 text-sm font-medium text-white/90">
              کابوک طب — خدمات پس از فروش لیزر پوست
            </p>

            <h1 className="mb-4 text-2xl font-extrabold leading-tight text-balance sm:text-3xl lg:text-4xl">
              <span className="inline-flex items-center gap-2">
                <Zap className="size-6 text-yellow-400" />
                تخصصی‌ترین خدمات پس از فروش لیزر پوست
              </span>
            </h1>

            <p className="mb-6 text-sm leading-relaxed text-white/80 sm:text-base">
              تعمیر، سرویس دوره‌ای، تأمین قطعات یدکی و کالیبراسیون انواع دستگاه‌های
              لیزر پوست با گارانتی خدمات
            </p>

            <Link
              href="/services/request"
              className="inline-flex items-center gap-2 rounded-xl border border-primary bg-primary px-8 py-3 text-sm font-bold text-white shadow-md transition-all duration-300 hover:opacity-90 hover:shadow-lg"
              aria-label="درخواست سرویس"
            >
              <Wrench className="size-4" />
              درخواست سرویس
            </Link>
          </motion.div>
        </Container>
      </div>
    </section>
  );
}
