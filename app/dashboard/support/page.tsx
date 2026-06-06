"use client";

import { Search, Filter } from "lucide-react";

const allRequests = [
  {
    id: "REQ-101",
    customer: "کلینیک ونک",
    issue: "نشت آب خنک‌کننده",
    priority: "high",
    time: "۱۰ دقیقه پیش",
  },
  {
    id: "REQ-102",
    customer: "دکتر مرادی",
    issue: "تعویض لامپ الکس",
    priority: "medium",
    time: "۱ ساعت پیش",
  },
  {
    id: "REQ-103",
    customer: "مرکز لیزر تابان",
    issue: "کالیبراسیون دوره‌ای",
    priority: "low",
    time: "۳ ساعت پیش",
  },
];

export default function SupportAdminPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            میز کار پشتیبانی
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            مدیریت درخواست‌های فنی ورودی
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              className="absolute right-3 top-2.5 text-gray-400"
              size={18}
            />
            <input
              placeholder="جستجوی کد یا مشتری..."
              className="bg-white border border-gray-200 rounded-xl pr-10 pl-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 w-64"
            />
          </div>
          <button className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
            <Filter size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-x-auto shadow-sm">
        <table className="w-full text-right text-sm min-w-[900px]">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
            <tr>
              <th className="px-6 py-4 font-semibold">شناسه</th>
              <th className="px-6 py-4 font-semibold">مشتری</th>
              <th className="px-6 py-4 font-semibold">موضوع خرابی</th>
              <th className="px-6 py-4 font-semibold">اولویت</th>
              <th className="px-6 py-4 font-semibold">زمان</th>
              <th className="px-6 py-4 font-semibold">تکنسین</th>
              <th className="px-6 py-4 font-semibold">عملیات</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {allRequests.map((req) => (
              <tr
                key={req.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-4 font-mono font-bold text-primary">
                  {req.id}
                </td>

                <td className="px-6 py-4 font-medium text-gray-900">
                  {req.customer}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {req.issue}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                      req.priority === "high"
                        ? "bg-rose-50 text-rose-600"
                        : req.priority === "medium"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {req.priority === "high"
                      ? "فوری"
                      : req.priority === "medium"
                      ? "متوسط"
                      : "عادی"}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-400 text-xs">
                  {req.time}
                </td>

                {/* ✅ ستون Assign */}
                <td className="px-6 py-4">
                  <select className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-primary/20 outline-none">
                    <option>انتخاب</option>
                    <option>علی رضایی</option>
                    <option>محمد کریمی</option>
                    <option>سینا موسوی</option>
                  </select>
                </td>

                <td className="px-6 py-4">
                  <button className="text-primary font-bold hover:underline">
                    بررسی
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
