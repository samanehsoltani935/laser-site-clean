"use client";

import { useState } from "react";
import { ArrowRight, Camera, Cpu, Hash, MapPin } from "lucide-react";
import Link from "next/link";

export default function NewDevicePage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // اینجا بعدا API Call می‌زنیم سما جان
    setTimeout(() => {
      setLoading(false);
      alert("دستگاه با موفقیت ثبت شد (تست)");
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/devices" className="p-2 hover:bg-gray-100 rounded-full transition">
          <ArrowRight size={20} className="text-gray-600" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">ثبت دستگاه جدید</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5">
          
          {/* انتخاب مدل */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Cpu size={16} className="text-primary" /> مدل دستگاه
            </label>
            <select className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition">
              <option>آلکساندرایت نابلکس (Noblex)</option>
              <option>دایود لومینس (Lumenis)</option>
              <option>اندیاگ (Nd:YAG)</option>
              <option>سایر مدل‌ها</option>
            </select>
          </div>

          {/* شماره سریال */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Hash size={16} className="text-primary" /> شماره سریال
            </label>
            <input 
              required
              placeholder="مثال: KB-2025-XXXX"
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-primary/20 outline-none transition"
              dir="ltr"
            />
          </div>

          {/* شعبه/محل نصب */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <MapPin size={16} className="text-primary" /> شعبه یا محل نصب
            </label>
            <input 
              placeholder="مثال: شعبه مرکزی (تهران)"
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition"
            />
          </div>

          {/* آپلود تصویر پلاک */}
          <div className="pt-2">
            <div className="border-2 border-dashed border-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-primary/30 transition-colors cursor-pointer group">
              <div className="bg-primary/5 p-4 rounded-full text-primary group-hover:scale-110 transition-transform">
                <Camera size={28} />
              </div>
              <div className="mt-3 text-sm font-bold text-gray-800">آپلود تصویر پلاک دستگاه</div>
              <div className="mt-1 text-xs text-gray-400">تصویر برچسب مشخصات فنی پشت دستگاه را آپلود کنید</div>
            </div>
          </div>
        </div>

        <button 
          disabled={loading}
          type="submit"
          className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-70"
        >
          {loading ? "در حال ثبت..." : "تایید و افزودن به لیست"}
        </button>
      </form>
    </div>
  );
}
