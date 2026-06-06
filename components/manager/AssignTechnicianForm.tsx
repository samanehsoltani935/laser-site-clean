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
  const [techId, setTechId] = useState(currentTechnicianId || "");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  async function assign() {
    if (!techId) return;
    setLoading(true);
    const res = await fetch(`/api/requests/${requestId}/assign`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ technicianId: techId }),
    });
    const json = await res.json();
    setLoading(false);
    if (json.success) {
      toast("تکنسین اختصاص یافت", "success");
      router.refresh();
    } else {
      toast(json.error, "error");
    }
  }

  return (
    <div className="flex gap-1">
      <select
        value={techId}
        onChange={(e) => setTechId(e.target.value)}
        className="rounded-lg border border-gray-200 px-2 py-1 text-xs"
      >
        <option value="">انتخاب...</option>
        {technicians.map((t) => (
          <option key={t.id} value={t.id}>
            {t.fullName}
          </option>
        ))}
      </select>
      <Button size="sm" onClick={assign} loading={loading}>
        اختصاص
      </Button>
    </div>
  );
}
