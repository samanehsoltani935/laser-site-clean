"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Phone, X } from "lucide-react";

const PHONE_DISPLAY = "021-72153000";

const navLinks = [
  { label: "خانه", href: "/" },
  { label: "ثبت درخواست خدمات", href: "/customer/requests/new" },
  { label: "پیگیری درخواست", href: "/customer/requests" },
  { label: "استعلام گارانتی", href: "/customer/devices" },
  { label: "قطعات و مصرفی‌ها", href: "/parts" },
  { label: "آموزش", href: "/training" },
  { label: "تماس با ما", href: "/contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between gap-4 py-3">
          <Link href="/" className="flex items-center transition hover:opacity-90">
            <Image
              src="/images/logo2.png"
              alt="کابوک طب"
              width={160}
              height={40}
              className="h-10 w-auto object-contain sm:h-12"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="منوی اصلی">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-sky-50 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="tel:02172153000"
              className="hidden items-center gap-2 rounded-full border border-primary/50 bg-sky-100 px-3.5 py-2 text-sm font-bold text-primary transition hover:bg-sky-50 sm:flex"
            >
              <Phone size={15} />
              <span dir="ltr">{PHONE_DISPLAY}</span>
            </a>

            <Link
              href="/login"
              className="hidden rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 sm:inline-flex"
            >
              ورود اعضا
            </Link>

            <button
              type="button"
              className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 lg:hidden"
              onClick={() => setMobileOpen((value) => !value)}
              aria-label={mobileOpen ? "بستن منو" : "باز کردن منو"}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="border-t border-gray-100 py-4 lg:hidden" aria-label="منوی موبایل">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-sky-50"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <a
                href="tel:02172153000"
                className="mt-3 flex items-center gap-2 rounded-full border border-primary/50 bg-sky-100 px-3.5 py-2.5 text-sm font-bold text-primary transition hover:bg-sky-50"
              >
                <Phone size={16} />
                <span dir="ltr">{PHONE_DISPLAY}</span>
              </a>

              <Link
                href="/login"
                className="mt-2 block rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white"
                onClick={() => setMobileOpen(false)}
              >
                ورود اعضا
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}