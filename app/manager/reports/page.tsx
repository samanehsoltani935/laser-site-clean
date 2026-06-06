"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/shared/EmptyState";

type Report = {
  id: string;
  actionsDone: string;
  createdAt: string;
  request: { trackingCode: string; device: { model: string } };
  technician: { fullName: string };
};

export default function ManagerReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/service-reports")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setReports(json.data);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-lg font-bold text-gray-900">گزارش‌های سرویس</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => alert("خروجی PDF — به‌زودی")}>
            خروجی PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => alert("خروجی Excel — به‌زودی")}>
            خروجی Excel
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {reports.map((r) => (
          <Card key={r.id}>
            <CardHeader
              title={r.request.trackingCode}
              description={`${r.request.device.model} — ${r.technician.fullName}`}
            />
            <CardContent>
              <p className="text-sm text-gray-700">{r.actionsDone}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(r.createdAt).toLocaleString("fa-IR")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
