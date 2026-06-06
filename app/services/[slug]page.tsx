import React from "react";

// این یک لیست ساده برای دیتای صفحات
const serviceData: any = {
  "training": { title: "آموزش اپراتور", desc: "آموزش‌های تخصصی کار با دستگاه‌های لیزر" },
  "calibration": { title: "کالیبراسیون", desc: "تنظیم دقیق انرژی و پارامترهای دستگاه" },
  "parts": { title: "قطعات یدکی", desc: "تأمین قطعات اصلی و استاندارد" },
  "maintenance": { title: "سرویس دوره‌ای", desc: "نگهداری پیشگیرانه و افزایش طول عمر" },
  "repair": { title: "تعمیرات تخصصی", desc: "عیب‌یابی و تعمیر انواع دستگاه‌های لیزر" },
};

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = serviceData[params.slug] || { title: "خدمات", desc: "در حال آماده‌سازی..." };

  return (
    <div className="max-w-4xl mx-auto py-20 px-6 text-center">
      <h1 className="text-4xl font-bold text-[#123e62] mb-6">{service.title}</h1>
      <p className="text-lg text-gray-600 mb-10">{service.desc}</p>
      
      <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">جزئیات این خدمت به زودی بارگذاری می‌شود</h2>
        <p className="text-gray-500 mb-6">برای مشاوره فوری و دریافت اطلاعات تخصصی با تیم فنی کابوک طب تماس بگیرید.</p>
        <a href="tel:+98..." className="bg-[#123e62] text-white px-8 py-3 rounded-full font-bold">تماس با پشتیبانی</a>
      </div>
    </div>
  );
}
