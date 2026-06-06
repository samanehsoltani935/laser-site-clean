"use client";

import { useState } from "react";
import PageHeader from "@/components/site/PageHeader";
import Container from "@/components/Container";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Check, Circle, Search } from "lucide-react";

const timelineSteps = [
  { key: "registered", label: "ثبت شده" },
  { key: "reviewing", label: "در حال بررسی" },
  { key: "assigned", label: "ارجاع به کارشناس" },
  { key: "in-progress", label: "در حال انجام" },
  { key: "completed", label: "تکمیل شده" },
];

type TrackingResult = {
  code: string;
  customerName: string;
  deviceModel: string;
  statusIndex: number;
  updatedAt: string;
};

function getSampleResult(code: string): TrackingResult {
  return {
    code,
    customerName: "کلینیک زیبایی سپهر",
    deviceModel: "Clara Pro",
    statusIndex: 2,
    updatedAt: "۱۴۰۴/۰۳/۱۵ — ۱۰:۳۰",
  };
}

export default function TrackingPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (!code.trim()) return;
    setSearched(true);
    // TODO: اتصال به API پیگیری — GET /api/requests?trackingCode=
    setResult(getSampleResult(code.trim().toUpperCase()));
  };

  return (
    <>
      <PageHeader
        title="پیگیری درخواست"
        subtitle="کد پیگیری دریافتی پس از ثبت درخواست را وارد کنید تا وضعیت رسیدگی را مشاهده کنید."
      />

      <section className="py-10 lg:py-14">
        <Container>
          <div className="mx-auto max-w-xl">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                id="trackingCode"
                label="کد پیگیری"
                placeholder="SRV-12345"
                dir="ltr"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                type="button"
                size="lg"
                className="sm:mt-7 sm:shrink-0"
                onClick={handleSearch}
              >
                <Search size={18} />
                پیگیری درخواست
              </Button>
            </div>
          </div>

          {searched && result && (
            <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 shadow-card sm:p-8">
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-5">
                <div>
                  <p className="text-xs text-gray-500">کد پیگیری</p>
                  <p className="font-mono text-lg font-bold text-primary" dir="ltr">
                    {result.code}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs text-gray-500">آخرین بروزرسانی</p>
                  <p className="text-sm font-medium text-gray-700">{result.updatedAt}</p>
                </div>
              </div>

              <dl className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-gray-500">نام مشتری</dt>
                  <dd className="font-medium text-gray-900">{result.customerName}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">مدل دستگاه</dt>
                  <dd className="font-medium text-gray-900">{result.deviceModel}</dd>
                </div>
              </dl>

              <h3 className="mb-5 text-sm font-bold text-gray-900">وضعیت درخواست</h3>
              <ol className="space-y-0">
                {timelineSteps.map((step, index) => {
                  const isDone = index <= result.statusIndex;
                  const isCurrent = index === result.statusIndex;
                  return (
                    <li key={step.key} className="relative flex gap-4 pb-6 last:pb-0">
                      {index < timelineSteps.length - 1 && (
                        <span
                          className={cn(
                            "absolute right-[15px] top-8 h-full w-0.5",
                            isDone ? "bg-primary" : "bg-gray-200"
                          )}
                        />
                      )}
                      <div
                        className={cn(
                          "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
                          isDone
                            ? "border-primary bg-primary text-white"
                            : "border-gray-200 bg-white text-gray-400"
                        )}
                      >
                        {isDone ? <Check size={14} /> : <Circle size={10} />}
                      </div>
                      <div className="pt-1">
                        <p
                          className={cn(
                            "text-sm font-semibold",
                            isCurrent ? "text-primary" : isDone ? "text-gray-800" : "text-gray-400"
                          )}
                        >
                          {step.label}
                        </p>
                        {isCurrent && (
                          <p className="mt-0.5 text-xs text-primary/70">وضعیت فعلی</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}

          {searched && !result && (
            <p className="mt-8 text-center text-sm text-gray-500">
              درخواستی با این کد یافت نشد.
            </p>
          )}
        </Container>
      </section>
    </>
  );
}
