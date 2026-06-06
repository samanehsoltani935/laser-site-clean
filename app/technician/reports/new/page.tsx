"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";

type SparePart = { id: string; name: string; stockQuantity: number };

export default function NewServiceReportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [parts, setParts] = useState<SparePart[]>([]);
  const [loading, setLoading] = useState(false);
  const requestId = searchParams.get("requestId") || "";

  useEffect(() => {
    fetch("/api/spare-parts")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setParts(json.data);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const sparePartId = formData.get("sparePartId") as string;
    const quantity = Number(formData.get("quantity") || 0);

    const body = {
      requestId,
      actionsDone: formData.get("actionsDone"),
      technicalNotes: formData.get("technicalNotes"),
      finalStatus: "COMPLETED",
      spareParts:
        sparePartId && quantity > 0
          ? [{ sparePartId, quantity }]
          : undefined,
    };

    const res = await fetch("/api/service-reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    setLoading(false);

    if (json.success) {
      toast("گزارش سرویس ثبت شد", "success");
      router.push(`/technician/requests/${requestId}`);
      router.refresh();
    } else {
      toast(json.error || "خطا", "error");
    }
  }

  const partOptions = [
    { value: "", label: "بدون قطعه" },
    ...parts.map((p) => ({
      value: p.id,
      label: `${p.name} (موجودی: ${p.stockQuantity})`,
    })),
  ];

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <Link
          href={`/technician/requests/${requestId}`}
          className="text-sm text-primary hover:underline"
        >
          ← بازگشت
        </Link>
        <h1 className="text-lg font-bold text-gray-900 mt-2">ثبت گزارش سرویس</h1>
      </div>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="requestId" value={requestId} />
            <Textarea
              id="actionsDone"
              name="actionsDone"
              label="اقدامات انجام‌شده"
              required
              rows={4}
            />
            <Textarea
              id="technicalNotes"
              name="technicalNotes"
              label="یادداشت فنی"
              rows={3}
            />
            <select
              name="sparePartId"
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
            >
              {partOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              label="تعداد قطعه مصرفی"
              defaultValue={0}
              min={0}
            />
            <Button type="submit" loading={loading} className="w-full">
              ثبت گزارش
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
