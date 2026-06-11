"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";

const PHONE_DISPLAY = "021-72153000";

const supportLinks = [
  { label: "ثبت درخواست خدمات", href: "/customer/requests/new" },
  { label: "پیگیری درخواست", href: "/customer/requests" },
  { label: "استعلام گارانتی", href: "/customer/devices" },
];

const navLinks = [
  { label: "خانه", href: "/" },
  { label: "قطعات و مصرفی‌ها", href: "/parts" },
  { label: "آموزش", href: "/training" },
  { label: "تماس با ما", href: "/contact" },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center transition-opacity hover:opacity-90">
      <Image
        src="/images/logo2.png"
        alt="کابوک طب"
        width={160}
        height={40}
        className="h-10 w-auto object-contain sm:h-12"
        priority
      />
    </Link>
  );
}

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-header backdrop-blur-md">
      <Container>
        <div className="flex items-center justify-between gap-4 py-3">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="منوی اصلی">
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-sky-50 hover:text-primary"
            >
              خانه
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setSupportOpen(true)}
              onMouseLeave={() => setSupportOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-sky-50 hover:text-primary"
                aria-expanded={supportOpen}
                aria-haspopup="true"
              >
                پشتیبانی
                <ChevronDown
                  size={14}
                  className={cn("opacity-60 transition-transform", supportOpen && "rotate-180")}
                />
              </button>
              {supportOpen && (
                <div className="absolute right-0 top-full z-50 min-w-[220px] rounded-xl border border-gray-100 bg-white py-2 shadow-2xl">
                  {supportLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2.5 text-sm text-gray-600 transition hover:bg-sky-50 hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navLinks.slice(1).map((link) => (
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
              className="phone-attention-pulse hidden items-center gap-2 rounded-full border border-primary/50 bg-sky-100 px-3.5 py-2 text-sm font-bold text-primary transition hover:bg-sky-50 sm:flex"
            >
              <Phone size={15} />
              <span dir="ltr">{PHONE_DISPLAY}</span>
            </a>

            <Link
              href="/login"
              className="hidden rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 sm:inline-flex"
            >
              پنل مشتریان
            </Link>

            <button
              type="button"
              className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "بستن منو" : "باز کردن منو"}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav
            className="border-t border-gray-100 py-4 lg:hidden"
            aria-label="منوی موبایل"
          >
            <div className="space-y-1">
              <Link
                href="/"
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-sky-50"
                onClick={() => setMobileOpen(false)}
              >
                خانه
              </Link>
              <p className="px-3 pt-2 text-xs font-bold text-gray-400">پشتیبانی</p>
              {supportLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-lg px-5 py-2.5 text-sm text-gray-600 hover:bg-sky-50"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {navLinks.slice(1).map((link) => (
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
                className="phone-attention-pulse mt-3 flex items-center gap-2 rounded-full border border-primary/50 bg-sky-100 px-3.5 py-2.5 text-sm font-bold text-primary transition hover:bg-sky-50"
              >
                <Phone size={16} />
                <span dir="ltr">{PHONE_DISPLAY}</span>
              </a>
              <Link
                href="/login"
                className="mt-2 block rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white"
                onClick={() => setMobileOpen(false)}
              >
                پنل مشتریان
              </Link>
            </div>
          </nav>
        )}
      </Container>
    </header>
  );
}
