import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/site/PageHeader";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "قطعات و مصرفی‌ها | کابوک طب",
  description: "سفارش قطعات یدکی و مواد مصرفی دستگاه‌های لیزر پوست",
};

const parts = [
  {
    title: "هندپیس",
    description: "هندپیس دیود و قطعات مرتبط با اپلیکاتور لیزر",
    image: "/images/diode-handpiece.png",
  },
  {
    title: "فیلتر",
    description: "فیلترهای آب و گرد و غبار سیستم خنک‌کننده",
    image: "/images/cooling-cartridge.png",
  },
  {
    title: "لامپ",
    description: "لامپ پمپ و نشانگرهای اپتیکی دستگاه",
    image: "/images/clara.png",
  },
  {
    title: "قطعات خنک‌کننده",
    description: "پمپ، رادیاتور، کارtridge خنک‌کننده",
    image: "/images/cooling-cartridge.png",
  },
  {
    title: "کابل و اتصالات",
    description: "کابل برق، فیبر و کانکتورهای تخصصی",
    image: "/images/clara-blue.png",
  },
  {
    title: "مواد مصرفی سرویس",
    description: "الکل، ژل، پد و مواد مورد نیاز سرویس دوره‌ای",
    image: "/images/annual-maintenance.png",
  },
];

const devices = [
  { title: "Clara", image: "/images/clara.png" },
  { title: "Clara Blue", image: "/images/clara-blue.png" },
  { title: "Clara Pro", image: "/images/clara-pro.png" },
  { title: "Clara Pro Gray", image: "/images/clara pro-gray.png" },
];

export default function PartsPage() {
  return (
    <>
      <PageHeader
        title="قطعات و مصرفی‌ها"
        subtitle="قطعات اصلی و مصرفی دستگاه‌های لیزر پوست با ضمانت اصالت — برای سفارش با واحد پشتیبانی تماس بگیرید یا درخواست ثبت کنید."
      />

      <section className="py-10 lg:py-14">
        <Container>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {parts.map((part) => (
              <article
                key={part.title}
                className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card transition hover:border-primary/20 hover:shadow-lg"
              >
                <div className="relative h-44 w-full bg-gray-50">
                  <Image
                    src={part.image}
                    alt={part.title}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="mb-2 text-lg font-bold text-gray-900">{part.title}</h2>
                  <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-500">
                    {part.description}
                  </p>
                  <Link
                    href="/support/request"
                    className="inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    درخواست قطعه
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-14">
            <h2 className="mb-6 text-center text-xl font-extrabold text-gray-900">
              مدل‌های پشتیبانی‌شده
            </h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {devices.map((device) => (
                <div
                  key={device.title}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card"
                >
                  <div className="relative h-40 bg-gray-50">
                    <Image
                      src={device.image}
                      alt={device.title}
                      fill
                      className="object-contain p-3"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <p className="py-3 text-center text-sm font-bold text-gray-800">
                    {device.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 rounded-2xl bg-gradient-to-l from-primary to-sky-800 p-8 text-center text-white">
            <h3 className="text-xl font-bold">نیاز به مشاوره فنی دارید؟</h3>
            <p className="mt-2 text-sm text-white/80">
              کارشناسان ما در انتخاب قطعه مناسب برای مدل دستگاه شما راهنمایی می‌کنند.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-sky-50 px-6 py-3 text-base font-semibold text-primary transition hover:bg-sky-100"
            >
              تماس با واحد فروش قطعات
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
