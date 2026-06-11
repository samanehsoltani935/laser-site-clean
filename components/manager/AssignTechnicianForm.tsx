"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export function AssignTechnicianForm({
  requestId,
  technicians,
  currentTechnicianId,
}: {
  requestId: string;
  technicians: { id: string; fullName: string }[];
  currentTechnicianId: string | null;
}) {
  const [technicianId, setTechnicianId] = useState(currentTechnicianId || "");
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  async function assignTechnician() {
    if (!technicianId) {
      toast("یک کارشناس فنی انتخاب کنید", "error");
      return;
    }

    setLoading(true);

    const res = await fetch(`/api/requests/${requestId}/assign`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        technicianId,
      }),
    });

    const json = await res.json();

    setLoading(false);

    if (json.success) {
      toast("درخواست با موفقیت به کارشناس فنی ارجاع شد", "success");
      router.refresh();
    } else {
      toast(json.error || "خطا در ارجاع درخواست", "error");
    }
  }

  return (
    <div className="flex min-w-[230px] items-center gap-2">
      <select
        value={technicianId}
        onChange={(e) => setTechnicianId(e.target.value)}
        className="h-9 flex-1 rounded-lg border border-gray-200 bg-white px-2 text-xs text-gray-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
      >
        <option value="">انتخاب کارشناس</option>

        {technicians.map((technician) => (
          <option key={technician.id} value={technician.id}>
            {technician.fullName}
          </option>
        ))}
      </select>

      <Button size="sm" onClick={assignTechnician} loading={loading}>
        ارجاع
      </Button>
    </div>
  );
}