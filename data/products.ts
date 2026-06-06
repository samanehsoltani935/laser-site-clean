export type BadgeType = "new" | "special" | "sale" | null;

export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  badge: BadgeType;
  badgeLabel?: string;
}

export const products: Product[] = [
  {
    id: "p1",
    title: "سرویس کامل دستگاه الکس",
    description: "شامل تعویض فیلتر، کالیبراسیون و تست ایمنی",
    price: "۳,۵۰۰,۰۰۰",
    image: "/images/service-alex.png",
    badge: "new",
    badgeLabel: "جدید",
  },
  {
    id: "p2",
    title: "هندپیس دیود ۸۰۸",
    description: "قطعه اصلی با گارانتی ۶ ماهه",
    price: "۱۲,۰۰۰,۰۰۰",
    image: "/images/diode-handpiece.png",
    badge: "special",
    badgeLabel: "پیشنهاد ویژه",
  },
  {
    id: "p3",
    title: "پکیج نگهداری سالانه",
    description: "۴ بار سرویس دوره‌ای در طول سال",
    price: "۹,۸۰۰,۰۰۰",
    image: "/images/annual-maintenance.png",
    badge: "sale",
    badgeLabel: "تخفیف",
  },
  {
    id: "p4",
    title: "کارتریج خنک‌کننده",
    description: "مناسب دستگاه‌های CO2 و فرکشنال",
    price: "۲,۱۰۰,۰۰۰",
    image: "/images/cooling-cartridge.png",
    badge: "new",
    badgeLabel: "جدید",
  },
  {
    id: "p5",
    title: "لنز اپتیک لیزر",
    description: "ضد انعکاس با پوشش محافظ",
    price: "۴,۵۰۰,۰۰۰",
    image: "/images/clara-blue.png",
    badge: null,
  },
  {
    id: "p6",
    title: "دوره آموزش ایمنی",
    description: "۲ روز حضوری + گواهینامه معتبر",
    price: "۱,۵۰۰,۰۰۰",
    image: "/images/clara.png",
    badge: "special",
    badgeLabel: "پیشنهاد ویژه",
  },
];
