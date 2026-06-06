export interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
}

export const categories: Category[] = [
  {
    id: "repair",
    title: "تعمیرات تخصصی",
    description: "عیب‌یابی و تعمیر انواع دستگاه لیزر پوست",
    icon: "🔧",
    href: "/services",
  },
  {
    id: "periodic",
    title: "سرویس دوره‌ای",
    description: "نگهداری پیشگیرانه و افزایش عمر دستگاه",
    icon: "📋",
    href: "/services",
  },
  {
    id: "parts",
    title: "قطعات یدکی",
    description: "تأمین قطعات اصلی و استاندارد",
    icon: "⚙️",
    href: "/services",
  },
  {
    id: "calibration",
    title: "کالیبراسیون",
    description: "تنظیم دقیق انرژی و پارامترهای لیزر",
    icon: "🎯",
    href: "/services",
  },
  {
    id: "training",
    title: "آموزش اپراتور",
    description: "آموزش ایمن و حرفه‌ای کار با دستگاه",
    icon: "📚",
    href: "/services",
  },
];
