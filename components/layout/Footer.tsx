import Link from "next/link";
import Container from "@/components/Container";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-primary bg-white">
      <Container className="py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="mb-2 text-lg font-extrabold text-primary">کابوک طب</p>
            <p className="text-sm leading-relaxed text-primary">
              تخصصی‌ترین مرکز خدمات پس از فروش، تعمیر و نگهداری دستگاه‌های لیزر پوست
            </p>
          </div>
          <div>
            <p className="mb-3 text-sm font-bold text-primary">دسترسی سریع</p>
            <ul className="space-y-2 text-sm text-primary">
              <li>
                <Link href="/" className="transition-opacity hover:opacity-70">
                  خانه
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="transition-opacity hover:opacity-70"
                >
                  خدمات
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition-opacity hover:opacity-70"
                >
                  تماس با ما
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-bold text-primary">تماس</p>
            <ul className="space-y-2 text-sm text-primary">
              <li>021-76523000 تلفن:</li>
              <li>ایمیل: info@kabookteb.ir</li>
              <li>آدرس: پارک فناوری پردیس – فاز 3 – خیابان کارآفرینی 11 – شرکت کابوک طب</li>
            </ul>
          </div>
        </div>
        <p className="mt-8 border-t border-primary pt-6 text-center text-xs text-primary">
          © {new Date().getFullYear()} کابوک طب — تمامی حقوق محفوظ است.
        </p>
      </Container>
    </footer>
  );
}
