"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const body = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();

      if (!json.success) {
        toast(json.error || "خطا در ثبت‌نام", "error");
        return;
      }

      toast("ثبت‌نام موفق", "success");
      router.push(json.data.redirectTo);
      router.refresh();
    } catch {
      toast("خطا در ارتباط با سرور", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-[#f8fafc]">
      <Card className="w-full max-w-lg">
        <CardContent>
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900">ثبت‌نام کلینیک</h1>
            <p className="text-sm text-gray-500 mt-2">
              برای ثبت دستگاه و درخواست خدمات، ابتدا ثبت‌نام کنید
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input id="fullName" name="fullName" label="نام و نام خانوادگی" required />
            <Input id="clinicName" name="clinicName" label="نام کلینیک" required />
            <Input id="email" name="email" type="email" label="ایمیل" dir="ltr" required />
            <Input id="phone" name="phone" label="شماره تماس" required />
            <Input id="clinicAddress" name="clinicAddress" label="آدرس کلینیک" />
            <Input
              id="nationalCodeOrCompanyId"
              name="nationalCodeOrCompanyId"
              label="کد ملی / شناسه شرکت"
            />
            <Input id="password" name="password" type="password" label="رمز عبور" required />
            <Button type="submit" loading={loading} className="w-full">
              ثبت‌نام
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            قبلاً ثبت‌نام کرده‌اید؟{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              ورود
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
