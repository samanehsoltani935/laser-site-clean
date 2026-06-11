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

type Device = {
  id: string;
  model: string;
  serialNumber: string;
};

export default function NewRequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [devices, setDevices] = useState<Device[]>([]);
  const [devicesLoading, setDevicesLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadDevices() {
      try {
        const res = await fetch("/api/devices", {
          cache: "no-store",
        });

        const json = await res.json();

        if (!mounted) return;

        if (!res.ok) {
          toast(json.error || "خطا در دریافت دستگاه‌ها", "error");
          return;
        }

        const list = Array.isArray(json.data)
          ? json.data
          : Array.isArray(json.devices)
            ? json.devices
            : [];

        setDevices(list);
      } catch {
        if (mounted) {
          toast("خطا در ارتباط با سرور", "error");
        }
      } finally {
        if (mounted) {
          setDevicesLoading(false);
        }
      }
    }

    loadDevices();

    return () => {
      mounted = false;
    };
  }, [toast]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const body = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok) {
        toast(json.error || "خطا در ثبت درخواست", "error");
        return;
      }

      const requestId = json.data?.id || json.request?.id || json.id;

      toast("درخواست با موفقیت ثبت شد", "success");

      if (requestId) {
        router.push(`/customer/requests/${requestId}`);
      } else {
        router.push("/customer/requests");
      }

      router.refresh();
    } catch {
      toast("خطا در ارتباط با سرور", "error");
    } finally {
      setLoading(false);
    }
  }

  const selectedDeviceId = searchParams.get("deviceId") || "";

  const deviceOptions = [
    {
      value: "",
      label: "انتخاب دستگاه...",
    },
    ...devices.map((device) => ({
      value: device.id,
      label: `${device.model} — ${device.serialNumber}`,
    })),
  ];

  const priorityOptions = [
    {
      value: "LOW",
      label: "کم",
    },
    {
      value: "MEDIUM",
      label: "متوسط",
    },
    {
      value: "HIGH",
      label: "بالا",
    },
    {
      value: "URGENT",
      label: "فوری",
    },
  ];

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <Link
          href="/customer/requests"
          className="text-sm font-semibold text-primary hover:underline"
        >
          بازگشت به درخواست‌ها
        </Link>

        <h1 className="mt-2 text-lg font-bold text-gray-900">
          ثبت درخواست خدمات
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          برای ثبت درخواست تعمیر، مشاوره یا سرویس دوره‌ای، ابتدا دستگاه موردنظر
          را انتخاب کنید.
        </p>
      </div>

      {devicesLoading ? (
        <Card>
          <CardContent>
            <div className="text-sm text-gray-500">
              در حال دریافت دستگاه‌های ثبت‌شده...
            </div>
          </CardContent>
        </Card>
      ) : devices.length === 0 ? (
        <Card>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  هنوز دستگاهی ثبت نشده است
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  برای ثبت درخواست خدمات، ابتدا باید دستگاه خود را در پنل مشتری
                  ثبت کنید. بعد از ثبت دستگاه، می‌توانید برای همان دستگاه درخواست
                  تعمیر، مشاوره یا سرویس دوره‌ای ایجاد کنید.
                </p>
              </div>

              <Link href="/customer/devices">
                <Button>رفتن به بخش دستگاه‌های من</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="title"
                name="title"
                label="عنوان درخواست"
                placeholder="مثلاً خطای هندپیس یا افت توان دستگاه"
                required
              />

              <Select
                id="deviceId"
                name="deviceId"
                label="دستگاه"
                required
                defaultValue={selectedDeviceId}
                options={deviceOptions}
              />

              <Input
                id="customerName"
                name="customerName"
                label="نام مشتری / کلینیک"
                placeholder="نام کلینیک یا نام مسئول"
                required
              />

              <Input
                id="phoneNumber"
                name="phoneNumber"
                label="شماره تماس"
                placeholder="مثلاً 09121234567"
                required
              />

              <Input
                id="clinicAddress"
                name="clinicAddress"
                label="آدرس کلینیک"
                placeholder="آدرس محل نصب یا سرویس دستگاه"
                required
              />

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
                placeholder="مشکل دستگاه را با جزئیات توضیح دهید"
                required
                rows={4}
              />

              <Button type="submit" loading={loading} className="w-full">
                ثبت درخواست
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}