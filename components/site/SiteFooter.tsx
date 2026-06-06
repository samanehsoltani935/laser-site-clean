import Link from "next/link";
import Container from "@/components/Container";

const quickLinks = [
  { label: "خانه", href: "/" },
  { label: "ثبت درخواست خدمات", href: "/support/request" },
  { label: "پیگیری درخواست", href: "/support/tracking" },
  { label: "استعلام گارانتی", href: "/support/warranty" },
  { label: "قطعات و مصرفی‌ها", href: "/parts" },
  { label: "آموزش", href: "/training" },
  { label: "تماس با ما", href: "/contact" },
];

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50">
      <Container className="py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <span className="font-roboto text-xs font-bold text-white">CT</span>
              </div>
              <div>
                <p className="text-lg font-extrabold text-primary">کابوک طب</p>
                <p className="font-roboto text-[10px] tracking-widest text-gray-400">CABOK TEB</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-600">
              تخصصی‌ترین مرکز خدمات پس از فروش، تعمیر، کالیبراسیون و نگهداری
              دستگاه‌های لیزر پوست
            </p>
          </div>

          <div>
            <p className="mb-4 text-sm font-bold text-gray-900">دسترسی سریع</p>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-sm font-bold text-gray-900">تماس با ما</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                تلفن:{" "}
                <a href="tel:02172153000" className="font-bold text-primary" dir="ltr">
                  021-72153000
                </a>
              </li>
              <li>ایمیل: info@kabookteb.ir</li>
              <li>ساعات پشتیبانی: شنبه تا چهارشنبه ۸ تا ۱۷ — پنج‌شنبه ۸ تا ۱۳</li>
              <li>آدرس: پارک فناوری پردیس – فاز ۳ – خیابان کارآفرندی ۱۱ – شرکت کابوک طب</li>
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-gray-200 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} کابوک طب — تمامی حقوق محفوظ است.
        </p>
      </Container>
    </footer>
  );
}
