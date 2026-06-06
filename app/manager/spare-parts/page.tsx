"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";

type SparePart = {
  id: string;
  name: string;
  code: string;
  stockQuantity: number;
  minimumStock: number;
};

export default function SparePartsPage() {
  const [parts, setParts] = useState<SparePart[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  function load() {
    fetch("/api/spare-parts")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setParts(json.data);
      });
  }

  useEffect(load, []);

  async function addPart(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/spare-parts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        code: fd.get("code"),
        description: fd.get("description"),
        stockQuantity: Number(fd.get("stockQuantity")),
        minimumStock: Number(fd.get("minimumStock")),
      }),
    });
    const json = await res.json();
    if (json.success) {
      toast("قطعه اضافه شد", "success");
      load();
      router.refresh();
    }
  }

  async function adjustStock(id: string, delta: number) {
    const res = await fetch("/api/spare-parts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, adjustment: delta }),
    });
    const json = await res.json();
    if (json.success) {
      load();
      router.refresh();
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold text-gray-900">مدیریت قطعات یدکی</h1>
      </div>

      <Card>
        <CardContent>
          <form onSubmit={addPart} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input name="name" label="نام قطعه" required />
            <Input name="code" label="کد" required />
            <Input name="stockQuantity" type="number" label="موجودی" defaultValue={0} />
            <Input name="minimumStock" type="number" label="حداقل موجودی" defaultValue={5} />
            <Input name="description" label="توضیحات" className="md:col-span-2" />
            <Button type="submit">افزودن قطعه</Button>
          </form>
        </CardContent>
      </Card>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-right px-4 py-3">نام</th>
              <th className="text-right px-4 py-3">کد</th>
              <th className="text-right px-4 py-3">موجودی</th>
              <th className="text-right px-4 py-3">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((p) => (
              <tr key={p.id} className="border-t border-gray-50">
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3 font-mono" dir="ltr">
                  {p.code}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      p.stockQuantity <= p.minimumStock
                        ? "text-red-600 font-medium"
                        : ""
                    }
                  >
                    {p.stockQuantity}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => adjustStock(p.id, 1)}>
                    +
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => adjustStock(p.id, -1)}>
                    −
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
