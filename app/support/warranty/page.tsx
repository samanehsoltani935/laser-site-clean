"use client";

import { useState } from "react";
import PageHeader from "@/components/site/PageHeader";
import Container from "@/components/Container";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Search, ShieldCheck, ShieldX } from "lucide-react";

type WarrantyResult = {
  serialNumber: string;
  deviceModel: string;
  status: "active" | "expired";
  endDate: string;
  daysRemaining: number;
};

function getSampleWarranty(serial: string): WarrantyResult {
  const isActive = serial.length >= 5;
  return {
    serialNumber: serial.toUpperCase(),
    deviceModel: "Clara Pro",
    status: isActive ? "active" : "expired",
    endDate: isActive ? "۱۴۰۵/۰۶/۳۱" : "۱۴۰۳/۱۲/۲۹",
    daysRemaining: isActive ? 428 : 0,
  };
}

export default function WarrantyPage() {
  const [serial, setSerial] = useState("");
  const [result, setResult] = useState<WarrantyResult | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (!serial.trim()) return;
    setSearched(true);
    // TODO: اتصال به API استعلام گارانتی — GET /api/devices/warranty?serial=
    setResult(getSampleWarranty(serial.trim()));
  };

  return (
    <>
      <PageHeader
        title="استعلام گارانتی"
        subtitle="شماره سریال دستگاه را وارد کنید تا وضعیت گارانتی و تاریخ انقضا نمایش داده شود."
      />

      <section className="py-10 lg:py-14">
        <Container>
          <div className="mx-auto max-w-xl">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                id="serialNumber"
                label="شماره سریال دستگاه"
                placeholder="KB-2026-X9"
                dir="ltr"
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                type="button"
                size="lg"
                className="sm:mt-7 sm:shrink-0"
                onClick={handleSearch}
              >
                <Search size={18} />
                استعلام گارانتی
              </Button>
            </div>
          </div>

          {searched && result && (
            <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-gray-100 bg-white p-6 shadow-card sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                {result.status === "active" ? (
                  <div className="rounded-full bg-green-100 p-3 text-green-600">
                    <ShieldCheck size={24} />
                  </div>
                ) : (
                  <div className="rounded-full bg-red-100 p-3 text-red-600">
                    <ShieldX size={24} />
                  </div>
                )}
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {result.status === "active" ? "گارانتی فعال" : "گارانتی منقضی شده"}
                  </p>
                  <p className="text-sm text-gray-500">نتیجه استعلام (نمونه)</p>
                </div>
              </div>

              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-4">
                  <dt className="text-xs text-gray-500">مدل دستگاه</dt>
                  <dd className="mt-1 font-semibold text-gray-900">{result.deviceModel}</dd>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <dt className="text-xs text-gray-500">شماره سریال</dt>
                  <dd className="mt-1 font-mono font-semibold text-gray-900" dir="ltr">
                    {result.serialNumber}
                  </dd>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <dt className="text-xs text-gray-500">وضعیت گارانتی</dt>
                  <dd
                    className={`mt-1 font-semibold ${
                      result.status === "active" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {result.status === "active" ? "فعال" : "منقضی"}
                  </dd>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <dt className="text-xs text-gray-500">تاریخ پایان گارانتی</dt>
                  <dd className="mt-1 font-semibold text-gray-900">{result.endDate}</dd>
                </div>
                <div className="rounded-xl bg-sky-50 p-4 sm:col-span-2">
                  <dt className="text-xs text-gray-500">روزهای باقی‌مانده</dt>
                  <dd className="mt-1 text-2xl font-extrabold text-primary">
                    {result.daysRemaining.toLocaleString("fa-IR")} روز
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
