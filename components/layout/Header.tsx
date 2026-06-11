"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import {
  Phone,
  ChevronDown,
  User,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react";

type NavItem = {
  label: string;
  href?: string;
  children?: NavItem[];
};

const navItems: NavItem[] = [
  { label: "خانه", href: "/" },
  {
    label: "پشتیبانی",
    children: [
      { label: "ثبت درخواست خدمات", href: "/customer/requests/new" },
      { label: "پیگیری درخواست", href: "/customer/requests" },
      { label: "استعلام گارانتی", href: "/customer/devices" }, 
    ],
  },
  {
    label: "قطعات و مصرفی‌ها",
    children: [
      { label: "درخواست قطعه یدکی", href: "/parts/spare" },
      { label: "لوازم مصرفی کلینیک", href: "/parts/consumables" },
    ],
  },
  {
    label: "آموزش",
    children: [
      { label: "ویدیوهای آموزشی", href: "/training/videos" },
      { label: "دفترچه راهنما (PDF)", href: "/training/manuals" },
      { label: "نگهداری پیشگیرانه", href: "/training/maintenance" },
    ],
  },
  { label: "تماس با ما", href: "/contact" },
];

function DesktopMenuItem({ item }: { item: NavItem }) {
  const hasChildren = item.children && item.children.length > 0;

  if (!hasChildren && item.href) {
    return (
      <Link
        href={item.href}
        className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-primary whitespace-nowrap"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="relative group">
      <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-primary whitespace-nowrap">
        {item.label}
        <ChevronDown
          size={14}
          className="transition-transform group-hover:rotate-180 opacity-60"
        />
      </button>

      <div className="absolute right-0 top-full hidden pt-2 group-hover:block z-50">
        <div className="min-w-[200px] rounded-xl border border-gray-100 bg-white shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {item.children?.map((child) => (
            <Link
              key={child.label}
              href={child.href || "#"}
              className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
            >
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const PHONE_NUMBER = "02172153000";
const PHONE_DISPLAY = "021-72153000";

export default function Header() {
  // فعلاً برای دیدن تغییرات روی true گذاشته شده
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md shadow-sm">
        <Container>
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6 py-3">
            {/* راست — لوگو */}
            <Link
              href="/"
              className="flex items-center transition-opacity hover:opacity-90"
            >
              <Image
                src="/images/logo2.png"
                alt="کابوک طب"
                width={160}
                height={40}
                className="h-10 w-auto object-contain sm:h-12"
                priority
              />
            </Link>

            {/* مرکز — منو */}
            <nav className="hidden lg:flex items-center justify-center gap-1">
              {navItems.map((item) => (
                <DesktopMenuItem key={item.label} item={item} />
              ))}
            </nav>

            {/* چپ — اکشن‌ها */}
            <div className="flex items-center gap-4">
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="phone-pulse flex items-center gap-2 px-3.5 py-2 text-sm font-bold text-primary bg-primary/5 rounded-full hover:bg-primary/10 transition-all border border-primary/10"
              >
                <span dir="ltr">{PHONE_DISPLAY}</span>
                <Phone size={16} className="text-primary" />
              </a>

              <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

              {!isLoggedIn ? (
                <div className="flex items-center gap-1 border border-gray-200/80 bg-gray-50/50 p-1 rounded-xl">
                  <Link
                    href="/login"
                    className="px-4 py-1.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-white hover:text-primary transition-all"
                  >
                    ورود
                  </Link>

                  <Link
                    href="/register"
                    className="px-4 py-1.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-all shadow-sm"
                  >
                    ثبت‌نام
                  </Link>
                </div>
              ) : (
                /* منوی پروفایل هوشمند */
                <div className="relative group">
                  <button className="flex items-center gap-2 p-1 pl-3 border border-gray-200 rounded-full hover:border-primary/30 hover:bg-gray-50 transition-all">
                    <div className="bg-primary/10 p-1.5 rounded-full text-primary">
                      <User size={18} />
                    </div>

                    <span className="text-xs font-bold text-gray-700 hidden md:block">
                      پنل مشتریان
                    </span>

                    <ChevronDown
                      size={14}
                      className="opacity-40 group-hover:rotate-180 transition-transform"
                    />
                  </button>

                  <div className="absolute left-0 top-full hidden pt-2 group-hover:block z-50">
                    <div className="min-w-[210px] rounded-2xl border border-gray-100 bg-white shadow-2xl py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-gray-50 mb-1">
                        <p className="text-[10px] text-gray-400 font-medium">
                          خوش آمدید
                        </p>
                        <p className="text-sm font-bold text-gray-800 truncate">
                          کلینیک تخصصی سما
                        </p>
                      </div>

                      <Link
                        href="/dashboard"
                        className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <LayoutDashboard size={16} />
                          <span>میز کار (داشبورد)</span>
                        </div>
                        <ChevronLeft size={14} className="opacity-40" />
                      </Link>

                      <Link
                        href="/dashboard/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                      >
                        <Settings size={16} />
                        <span>تنظیمات کلینیک</span>
                      </Link>

                      <div className="h-px bg-gray-50 my-1"></div>

                      <button
                        onClick={() => setIsLoggedIn(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} />
                        <span>خروج از حساب</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </header>

      <style jsx global>{`
        @keyframes phonePulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(47, 99, 134, 0.36);
          }

          50% {
            transform: scale(1.045);
            box-shadow: 0 0 0 9px rgba(47, 99, 134, 0);
          }

          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(47, 99, 134, 0);
          }
        }

        .phone-pulse {
          animation: phonePulse 1.7s ease-in-out infinite;
          will-change: transform, box-shadow;
        }

        .phone-pulse:hover {
          animation-play-state: paused;
        }
      `}</style>
    </>
  );
}