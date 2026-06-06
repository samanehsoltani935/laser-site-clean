"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";

type Device = { id: string; model: string; serialNumber: string };

export default function NewRequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/devices")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setDevices(json.data);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const body = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!json.success) {
        toast(json.error || "خطا", "error");
        return;
      }
      toast("درخواست با موفقیت ثبت شد", "success");
      router.push(`/customer/requests/${json.data.id}`);
      router.refresh();
    } catch {
      toast("خطا در ارتباط با سرور", "error");
    } finally {
      setLoading(false);
    }
  }

  const deviceOptions = [
    { value: "", label: "انتخاب دستگاه..." },
    ...devices.map((d) => ({
      value: d.id,
      label: `${d.model} — ${d.serialNumber}`,
    })),
  ];

  const priorityOptions = [
    { value: "LOW", label: "کم" },
    { value: "MEDIUM", label: "متوسط" },
    { value: "HIGH", label: "بالا" },
    { value: "URGENT", label: "فوری" },
  ];

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <Link href="/customer/requests" className="text-sm text-primary hover:underline">
          ← بازگشت
        </Link>
        <h1 className="text-lg font-bold text-gray-900 mt-2">ثبت درخواست خدمات</h1>
      </div>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input id="title" name="title" label="عنوان درخواست" required />
            <Select
              id="deviceId"
              name="deviceId"
              label="دستگاه"
              required
              defaultValue={searchParams.get("deviceId") || ""}
              options={deviceOptions}
            />
            <Input id="customerName" name="customerName" label="نام مشتری / کلینیک" required />
            <Input id="phoneNumber" name="phoneNumber" label="شماره تماس" required />
            <Input id="clinicAddress" name="clinicAddress" label="آدرس کلینیک" required />
            <Select
              id="priority"
              name="priority"
              label="اولویت"
              defaultValue="MEDIUM"
              options={priorityOptions}
            />
            <Textarea
              id="problemDescription"
              name="problemDescription"
              label="شرح مشکل"
              required
              rows={4}
            />
            <Button type="submit" loading={loading} className="w-full">
              ثبت درخواست
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
