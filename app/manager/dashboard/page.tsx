"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/shared/EmptyState";

type Kpis = {
  totalRequests: number;
  newRequests: number;
  activeRequests: number;
  completedRequests: number;
  averageResponseTimeHours: number;
  mttrHours: number;
  warrantyRequests: number;
  consumedSpareParts: number;
  technicianPerformance: { id: string; name: string; completed: number }[];
};

const COLORS = ["#355d7d", "#0ea5e9", "#22c55e", "#f59e0b"];

export default function ManagerDashboardPage() {
  const [kpis, setKpis] = useState<Kpis | null>(null);

  useEffect(() => {
    fetch("/api/manager/kpis")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setKpis(json.data);
      });
  }, []);

  if (!kpis) return <LoadingSpinner />;

  const statusData = [
    { name: "جدید", value: kpis.newRequests },
    { name: "فعال", value: kpis.activeRequests },
    { name: "تکمیل", value: kpis.completedRequests },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold text-gray-900">داشبورد مدیریت</h1>
        <p className="text-sm text-gray-500 mt-1">نمای کلی عملکرد خدمات پس از فروش</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard title="کل درخواست‌ها" value={kpis.totalRequests} />
        <KpiCard title="درخواست‌های جدید" value={kpis.newRequests} />
        <KpiCard title="درخواست‌های فعال" value={kpis.activeRequests} />
        <KpiCard title="تکمیل‌شده" value={kpis.completedRequests} />
        <KpiCard title="میانگین پاسخ (ساعت)" value={kpis.averageResponseTimeHours} />
        <KpiCard title="MTTR (ساعت)" value={kpis.mttrHours} />
        <KpiCard title="گارانتی منقضی" value={kpis.warrantyRequests} />
        <KpiCard title="قطعات مصرفی" value={kpis.consumedSpareParts} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="توزیع وضعیت درخواست‌ها" />
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="عملکرد تکنسین‌ها" />
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kpis.technicianPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#355d7d" name="تکمیل‌شده" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="text-2xl font-bold text-primary mt-1">{value}</div>
    </div>
  );
}
