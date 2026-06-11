"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import { ArrowLeft, Search } from "lucide-react";

const HERO_IMAGE = "/images/laser-service-hero.png";

export default function HeroSection() {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e4976] via-primary to-sky-700" />
      {!imageError && (
        <Image
          src={HERO_IMAGE}
          alt="خدمات پس از فروش لیزر پوست"
          fill
          priority
          className="object-cover opacity-40"
          onError={() => setImageError(true)}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-l from-primary/90 via-primary/75 to-primary/50" />

      <Container className="relative py-16 sm:py-20 lg:py-28">
        <div className="max-w-2xl">
          <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
            سیستم خدمات پس از فروش دستگاه لیزر پوست
          </span>
          <h1 className="mb-5 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
            تخصصی‌ترین خدمات پس از فروش لیزر پوست
          </h1>
          <p className="mb-8 text-base leading-relaxed text-white/85 sm:text-lg">
            تعمیر، سرویس دوره‌ای، تأمین قطعات یدکی و کالیبراسیون انواع دستگاه‌های
            لیزر پوست با گارانتی خدمات
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/customer/requests/new"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-primary shadow-lg transition hover:bg-sky-50"
            >
              درخواست سرویس
              <ArrowLeft size={18} />
            </Link>
            <Link
              href="/customer/requests"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <Search size={18} />
              پیگیری درخواست
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
