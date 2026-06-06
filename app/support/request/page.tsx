"use client";

import { useState, type FormEvent } from "react";
import PageHeader from "@/components/site/PageHeader";
import Container from "@/components/Container";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { CheckCircle2, Upload } from "lucide-react";

const problemTypes = [
  { value: "", label: "انتخاب کنید" },
  { value: "no-power", label: "عدم روشن شدن دستگاه" },
  { value: "weak-output", label: "افت توان خروجی" },
  { value: "cooling", label: "مشکل سیستم خنک‌کننده" },
  { value: "handpiece", label: "خرابی هندپیس" },
  { value: "calibration", label: "نیاز به کالیبراسیون" },
  { value: "other", label: "سایر موارد" },
];

const priorityOptions = [
  { value: "", label: "انتخاب کنید" },
  { value: "low", label: "عادی" },
  { value: "medium", label: "متوسط" },
  { value: "high", label: "فوری" },
  { value: "critical", label: "بحرانی — توقف کامل کلینیک" },
];

function generateTrackingCode() {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `SRV-${num}`;
}

export default function ServiceRequestPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [trackingCode, setTrackingCode] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // TODO: اتصال به API ثبت درخواست — POST /api/requests
    setTimeout(() => {
      const code = generateTrackingCode();
      setTrackingCode(code);
      toast(`درخواست با موفقیت ثبت شد. کد پیگیری: ${code}`, "success");
      setLoading(false);
      (e.target as HTMLFormElement).reset();
    }, 1200);
  };

  return (
    <>
      <PageHeader
        title="ثبت درخواست خدمات"
        subtitle="فرم زیر را تکمیل کنید تا کارشناسان فنی کابوک طب در اسرع وقت با شما تماس بگیرند."
      />

      <section className="py-10 lg:py-14">
        <Container>
          {trackingCode && (
            <div className="mb-8 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-5">
              <CheckCircle2 className="mt-0.5 shrink-0 text-green-600" size={22} />
              <div>
                <p className="font-bold text-green-800">درخواست شما با موفقیت ثبت شد</p>
                <p className="mt-1 text-sm text-green-700">
                  کد پیگیری:{" "}
                  <span className="rounded-lg bg-green-100 px-2 py-0.5 font-mono font-bold" dir="ltr">
                    {trackingCode}
                  </span>
                </p>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-3xl rounded-2xl border border-gray-100 bg-white p-6 shadow-card sm:p-8"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input id="fullName" name="fullName" label="نام و نام خانوادگی" required />
              <Input
                id="phone"
                name="phone"
                label="شماره تماس"
                type="tel"
                dir="ltr"
                placeholder="09121234567"
                required
              />
              <Input id="clinicName" name="clinicName" label="نام کلینیک" required />
              <Input id="clinicAddress" name="clinicAddress" label="آدرس کلینیک" required />
              <Input id="deviceModel" name="deviceModel" label="مدل دستگاه" required />
              <Input
                id="serialNumber"
                name="serialNumber"
                label="شماره سریال دستگاه"
                dir="ltr"
                placeholder="KB-2026-X9"
                required
              />
              <Input id="purchaseDate" name="purchaseDate" label="تاریخ خرید" type="date" required />
              <Select
                id="problemType"
                name="problemType"
                label="نوع مشکل"
                options={problemTypes}
                required
              />
              <Select
                id="priority"
                name="priority"
                label="اولویت درخواست"
                options={priorityOptions}
                required
              />
            </div>

            <div className="mt-5">
              <Textarea
                id="description"
                name="description"
                label="شرح مشکل"
                placeholder="لطفاً جزئیات مشکل، زمان بروز و هر اطلاعات مرتبط را بنویسید..."
                required
              />
            </div>

            <div className="mt-5">
              <label htmlFor="attachment" className="mb-1.5 block text-sm font-medium text-gray-700">
                آپلود عکس یا فایل
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6">
                <Upload className="shrink-0 text-gray-400" size={22} />
                <input
                  id="attachment"
                  name="attachment"
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  className="text-sm text-gray-600 file:ml-3 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
              </div>
            </div>

            <Button type="submit" size="lg" loading={loading} className="mt-8 w-full sm:w-auto">
              ثبت درخواست سرویس
            </Button>
          </form>
        </Container>
      </section>
    </>
  );
}
