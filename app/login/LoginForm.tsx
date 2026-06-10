"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const identifier = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          identifier,
          password,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        toast(json.message || json.error || "خطا در ورود", "error");
        return;
      }

      toast(json.message || "ورود موفق", "success");

      const user = json.user || json.data?.user;
      const role = user?.role;

      const redirectFromUrl = searchParams.get("redirect");
      const redirectFromApi = json.redirectTo || json.data?.redirectTo;

      let redirectTo = redirectFromUrl || redirectFromApi;

      if (!redirectTo) {
        if (role === "CUSTOMER") {
          redirectTo = "/customer/dashboard";
        } else if (role === "MANAGER") {
          redirectTo = "/manager/dashboard";
        } else if (role === "TECHNICIAN") {
          redirectTo = "/technician/requests";
        } else if (role === "SUPPORT") {
          redirectTo = "/dashboard/support";
        } else {
          redirectTo = "/customer/dashboard";
        }
      }

      window.location.href = redirectTo;
    } catch {
      toast("خطا در ارتباط با سرور", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-[#f8fafc]">
      <Card className="w-full max-w-md">
        <CardContent>
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900">ورود به سیستم</h1>
            <p className="text-sm text-gray-500 mt-2">
              سیستم خدمات پس از فروش دستگاه لیزر پوست — کابوک طب
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              name="email"
              type="email"
              label="ایمیل"
              placeholder="email@example.com"
              dir="ltr"
              required
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="رمز عبور"
              required
            />

            <Button type="submit" loading={loading} className="w-full">
              ورود
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            حساب کاربری ندارید؟{" "}
            <Link
              href="/register"
              className="text-primary font-semibold hover:underline"
            >
              ثبت‌نام
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}