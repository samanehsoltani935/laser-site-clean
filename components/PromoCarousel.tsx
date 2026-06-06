"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef } from "react";
import { promoServices } from "@/data/services";

const MOCK_COUNTDOWN = { days: 2, hours: 14, minutes: 35, seconds: 48 };

const SCROLL_AMOUNT = 300;

export default function PromoCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((direction: "prev" | "next") => {
    const el = scrollRef.current;
    if (!el) return;
    const offset = direction === "next" ? -SCROLL_AMOUNT : SCROLL_AMOUNT;
    el.scrollBy({ left: offset, behavior: "smooth" });
  }, []);

  return (
    <section
      className="bg-primary py-10 lg:py-12"
      aria-label="تخفیف خدمات ویژه"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-lg font-extrabold text-white sm:text-xl">
            تخفیف خدمات ویژه
          </h2>
          <div
            className="flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2"
            aria-label="زمان باقی‌مانده تخفیف"
          >
            {[
              { label: "روز", value: MOCK_COUNTDOWN.days },
              { label: "ساعت", value: MOCK_COUNTDOWN.hours },
              { label: "دقیقه", value: MOCK_COUNTDOWN.minutes },
              { label: "ثانیه", value: MOCK_COUNTDOWN.seconds },
            ].map((unit) => (
              <div key={unit.label} className="min-w-[2.5rem] text-center">
                <span className="block text-lg font-bold text-white">
                  {String(unit.value).padStart(2, "0")}
                </span>
                <span className="text-[10px] text-white/70">{unit.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => scroll("prev")}
            className="absolute -right-2 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow-sm transition hover:bg-white sm:flex"
            aria-label="مشاهده پیشنهادهای قبلی"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scroll("next")}
            className="absolute -left-2 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow-sm transition hover:bg-white sm:flex"
            aria-label="مشاهده پیشنهادهای بعدی"
          >
            ›
          </button>

          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scroll-smooth pb-1 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="list"
            aria-label="پیشنهادهای ویژه"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") scroll("prev");
              if (e.key === "ArrowLeft") scroll("next");
            }}
          >
            {promoServices.map((item) => (
              <Link
                key={item.id}
                href="/contact"
                role="listitem"
                className="group w-[240px] shrink-0 snap-start overflow-hidden rounded-xl bg-white transition-all duration-300 hover:scale-[1.02] hover:opacity-95 sm:w-[260px]"
                aria-label={item.title}
              >
                <div className="relative h-24 overflow-hidden sm:h-28">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="260px"
                  />
                </div>
                <div className="p-3">
                  <h3 className="mb-1 line-clamp-1 text-sm font-bold text-gray-800">
                    {item.title}
                  </h3>
                  <p className="mb-2 line-clamp-2 text-xs leading-relaxed text-brand-gray">
                    {item.description}
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-bold text-primary">
                      {item.price}
                    </span>
                    <span className="text-[10px] text-brand-gray line-through">
                      {item.originalPrice}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
