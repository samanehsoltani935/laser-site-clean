export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export const services: Service[] = [
  {
    id: "laser-repair",
    title: "تعمیر دستگاه لیزر پوست",
    description:
      "عیب‌یابی تخصصی، تعویض قطعات معیوب و بازگردانی دستگاه به حالت عملیاتی استاندارد توسط تکنسین‌های مجرب.",
    icon: "🔧",
    features: ["عیب‌یابی رایگان", "گارانتی تعمیر", "قطعات اصلی"],
  },
  {
    id: "parts-supply",
    title: "تأمین و تعویض قطعات",
    description:
      "تأمین قطعات یدکی اصلی برای انواع برندهای لیزر پوست با ضمانت اصالت و نصب توسط کارشناسان.",
    icon: "⚙️",
    features: ["قطعات اورجینال", "ارسال سریع", "نصب حرفه‌ای"],
  },
  {
    id: "maintenance",
    title: "سرویس و نگهداری دوره‌ای",
    description:
      "برنامه‌ریزی سرویس‌های دوره‌ای برای جلوگیری از خرابی‌های ناگهانی و حفظ کارایی بهینه دستگاه.",
    icon: "📋",
    features: ["قرارداد سالانه", "گزارش سرویس", "یادآوری خودکار"],
  },
  {
    id: "calibration",
    title: "کالیبراسیون دستگاه",
    description:
      "تنظیم دقیق پارامترهای انرژی، پالس و خنک‌کننده مطابق استانداردهای سازنده برای ایمنی بیمار.",
    icon: "🎯",
    features: ["گواهی کالیبراسیون", "تجهیزات پیشرفته", "مستندسازی کامل"],
  },
  {
    id: "support",
    title: "پشتیبانی فنی",
    description:
      "پشتیبانی تلفنی و حضوری برای حل مشکلات عملیاتی، آموزش اپراتور و مشاوره تخصصی.",
    icon: "📞",
    features: ["پاسخگویی ۲۴/۷", "مشاوره رایگان", "آموزش آنلاین"],
  },
];

export interface PromoItem {
  id: string;
  title: string;
  description: string;
  price: string;
  originalPrice: string;
  image: string;
}

export const promoServices: PromoItem[] = [
  {
    id: "promo-1",
    title: "پکیج سرویس فصلی",
    description: "سرویس کامل، تعویض فیلتر و تست ایمنی دستگاه",
    price: "۲,۵۰۰,۰۰۰",
    originalPrice: "۳,۲۰۰,۰۰۰",
    image: "/images/annual-maintenance.png",
  },
  {
    id: "promo-2",
    title: "تعویض هندپیس الکس",
    description: "قطعه اصلی با نصب و گارانتی ۶ ماهه",
    price: "۸,۹۰۰,۰۰۰",
    originalPrice: "۱۰,۵۰۰,۰۰۰",
    image: "/images/service-alex.png",
  },
  {
    id: "promo-3",
    title: "کالیبراسیون کامل",
    description: "تنظیم انرژی و صدور گواهی استاندارد",
    price: "۱,۸۰۰,۰۰۰",
    originalPrice: "۲,۴۰۰,۰۰۰",
    image: "/images/clara-pro.png",
  },
  {
    id: "promo-4",
    title: "آموزش اپراتور VIP",
    description: "دوره ۲ روزه حضوری با گواهینامه معتبر",
    price: "۱,۲۰۰,۰۰۰",
    originalPrice: "۱,۶۰۰,۰۰۰",
    image: "/images/clara-blue.png",
  },
  {
    id: "promo-5",
    title: "قرارداد نگهداری سالانه",
    description: "۴ سرویس دوره‌ای + پشتیبانی تلفنی رایگان",
    price: "۹,۸۰۰,۰۰۰",
    originalPrice: "۱۲,۵۰۰,۰۰۰",
    image: "/images/annual-maintenance.png",
  },
];
