// app/services/device-repair/page.tsx

import Link from "next/link";
import Image from "next/image";

export default function DeviceRepairPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4">
        
        {/* عنوان صفحه */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">انتخاب دستگاه جهت تعمیر</h1>
          <p className="text-gray-600 mt-2">لطفاً دستگاه مورد نظر خود را برای شروع فرآیند تعمیر انتخاب کنید.</p>
        </div>

        {/* کارت‌های انتخاب دستگاه */}
        <div className="grid gap-8 md:grid-cols-2">
          
          {/* کارت ۱: کلارا */}
          <Link
            href="/services/device-repair/clara"
            className="group block rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative w-full h-80 overflow-hidden rounded-xl">
              <Image
                src="/images/clara.png" 
                alt="تعمیرات کلارا"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mt-4 text-center">
              تعمیرات کلارا
            </h2>
          </Link>

          {/* کارت ۲: کلارا پرو */}
          <Link
            href="/services/device-repair/clara-pro"
            className="group block rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative w-full h-80 overflow-hidden rounded-xl">
              <Image
                src="/images/clara-pro.png" 
                alt="تعمیرات کلارا پرو"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mt-4 text-center">
              تعمیرات کلارا پرو
            </h2>
          </Link>

        </div>
      </div>
    </main>
  );
}
