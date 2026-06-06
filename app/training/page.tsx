import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/site/PageHeader";
import Container from "@/components/Container";
import {
  AlertTriangle,
  BookOpen,
  CalendarClock,
  Download,
  GraduationCap,
  Wrench,
} from "lucide-react";

export const metadata: Metadata = {
  title: "آموزش و نگهداری | کابوک طب",
  description: "آموزش کاربری، نگهداری و سرویس دوره‌ای دستگاه‌های لیزر پوست",
};

const sections = [
  {
    title: "آموزش کاربری دستگاه",
    description:
      "آشنایی با پنل کاربری، تنظیمات پارامترها، انتخاب پروتکل درمانی و نکات ایمنی برای اپراتور.",
    icon: GraduationCap,
    items: ["راه‌اندازی اولیه", "تنظیم انرژی و فرکانس", "پروتکل‌های درمانی"],
  },
  {
    title: "نکات نگهداری روزانه",
    description:
      "اقدامات ساده روزانه برای افزایش عمر دستگاه و جلوگیری از خرابی‌های پیش‌بینی‌نشده.",
    icon: BookOpen,
    items: ["بررسی سطح آب", "تمیزکاری هندپیس", "کنترل فیلترها"],
  },
  {
    title: "سرویس دوره‌ای",
    description:
      "برنامه سرویس پیشگیرانه طبق توصیه سازنده — کالیبراسیون، تعویض فیلتر و بازرسی کامل.",
    icon: CalendarClock,
    items: ["سرویس ۶ ماهه", "سرویس سالانه", "کالیبراسیون توان"],
  },
  {
    title: "خطاهای رایج دستگاه",
    description:
      "شناسایی کدهای خطا و اقدامات اولیه قبل از تماس با پشتیبانی فنی.",
    icon: AlertTriangle,
    items: ["خطای دمای بالا", "خطای جریان آب", "هشدار سطح انرژی"],
  },
  {
    title: "دانلود راهنما",
    description:
      "دفترچه راهنمای فارسی و فنی دستگاه‌های Clara و Clara Pro.",
    icon: Download,
    items: ["راهنمای کاربری PDF", "راهنمای سرویس فنی", "چک‌لیست نگهداری"],
  },
];

export default function TrainingPage() {
  return (
    <>
      <PageHeader
        title="آموزش و نگهداری دستگاه"
        subtitle="منابع آموزشی برای اپراتورها و مدیران فنی کلینیک — استفاده صحیح، نگهداری و عیب‌یابی اولیه."
      />

      <section className="py-10 lg:py-14">
        <Container>
          <div className="mb-10 flex items-center gap-4 rounded-2xl border border-sky-100 bg-sky-50 p-6">
            <div className="rounded-xl bg-primary p-3 text-white">
              <Wrench size={28} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">مرکز آموزش کابوک طب</h2>
              <p className="mt-1 text-sm text-gray-600">
                برای دوره‌های حضوری و آنلاین با واحد آموزش تماس بگیرید:{" "}
                <a href="tel:02172153000" className="font-bold text-primary" dir="ltr">
                  021-72153000
                </a>
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <article
                  key={section.title}
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card sm:p-8"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="inline-flex shrink-0 rounded-xl bg-sky-50 p-3 text-primary">
                      <Icon size={26} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-500">
                        {section.description}
                      </p>
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {section.items.map((item) => (
                          <li
                            key={item}
                            className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            فایل‌های PDF به‌زودی در این بخش قابل دانلود خواهند بود.{" "}
            <Link href="/contact" className="font-semibold text-primary hover:underline">
              درخواست راهنما
            </Link>
          </p>
        </Container>
      </section>
    </>
  );
}
