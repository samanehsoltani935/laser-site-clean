import Link from "next/link";
import Container from "@/components/Container";
import {
  ClipboardList,
  Package,
  Search,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

type Feature = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

const features: Feature[] = [
  {
    title: "ثبت درخواست آنلاین",
    description: "ثبت سریع درخواست تعمیر و سرویس از طریق فرم آنلاین",
    href: "/support/request",
    icon: ClipboardList,
  },
  {
    title: "پیگیری وضعیت سرویس",
    description: "مشاهده لحظه‌ای مراحل رسیدگی به درخواست شما",
    href: "/support/tracking",
    icon: Search,
  },
  {
    title: "مدیریت گارانتی",
    description: "استعلام وضعیت گارانتی دستگاه با شماره سریال",
    href: "/support/warranty",
    icon: ShieldCheck,
  },
  {
    title: "تأمین قطعات یدکی",
    description: "سفارش قطعات اصلی و مصرفی دستگاه‌های لیزر",
    href: "/parts",
    icon: Package,
  },
];

export default function FeatureCards() {
  return (
    <section className="py-14 lg:py-20" aria-label="خدمات اصلی">
      <Container>
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
            خدمات یکپارچه پس از فروش
          </h2>
          <p className="mt-3 text-sm text-gray-500 sm:text-base">
            تمام نیازهای فنی و پشتیبانی کلینیک شما در یک سامانه
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg"
              >
                <div className="mb-4 inline-flex rounded-xl bg-sky-50 p-3 text-primary transition group-hover:bg-primary group-hover:text-white">
                  <Icon size={24} />
                </div>
                <h3 className="mb-2 text-base font-bold text-gray-900">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{feature.description}</p>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
