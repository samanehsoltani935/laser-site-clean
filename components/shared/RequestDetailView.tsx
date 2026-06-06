"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { StatusBadge, PriorityBadge } from "@/components/shared/Badges";
import { calculateSla } from "@/lib/domain/sla";
import {
  REQUEST_STATUS_LABELS,
  REQUEST_PRIORITY_LABELS,
} from "@/lib/constants/labels";
import { RequestStatus } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";

type RequestData = {
  id: string;
  trackingCode: string;
  title: string;
  status: RequestStatus;
  priority: string;
  problemDescription: string;
  customerName: string | null;
  phoneNumber: string | null;
  clinicAddress: string | null;
  slaDueAt: Date | null;
  createdAt: Date;
  device: { model: string; serialNumber: string };
  customer: { clinicName: string; user: { fullName: string } };
  assignedTechnician: { fullName: string; id: string } | null;
  statusHistory: {
    id: string;
    oldStatus: RequestStatus | null;
    newStatus: RequestStatus;
    note: string | null;
    createdAt: Date;
    changedBy: { fullName: string; role: string };
  }[];
  messages: {
    id: string;
    body: string;
    createdAt: Date;
    sender: { id: string; fullName: string; role: string };
  }[];
  attachments: {
    id: string;
    fileName: string;
    fileUrl: string;
  }[];
  serviceReports: {
    id: string;
    actionsDone: string;
    technicalNotes: string | null;
    createdAt: Date;
    technician: { fullName: string };
    usedSpareParts: { quantity: number; sparePart: { name: string } }[];
  }[];
};

export function RequestDetailView({
  request,
  role,
  userId,
}: {
  request: RequestData;
  role: string;
  userId: string;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [newStatus, setNewStatus] = useState(request.status);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const sla = calculateSla(request.slaDueAt ? new Date(request.slaDueAt) : null);

  async function sendMessage() {
    if (!message.trim()) return;
    setLoading(true);
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId: request.id, body: message }),
    });
    const json = await res.json();
    setLoading(false);
    if (json.success) {
      setMessage("");
      router.refresh();
    } else {
      toast(json.error, "error");
    }
  }

  async function changeStatus() {
    setLoading(true);
    const res = await fetch(`/api/requests/${request.id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus, note }),
    });
    const json = await res.json();
    setLoading(false);
    if (json.success) {
      toast("وضعیت به‌روزرسانی شد", "success");
      router.refresh();
    } else {
      toast(json.error, "error");
    }
  }

  const statusOptions = Object.entries(REQUEST_STATUS_LABELS).map(([v, l]) => ({
    value: v,
    label: l,
  }));

  const backHref =
    role === "MANAGER" || role === "SUPPORT"
      ? "/manager/requests"
      : role === "TECHNICIAN"
        ? "/technician/requests"
        : "/customer/requests";

  return (
    <div className="space-y-5">
      <div>
        <Link href={backHref} className="text-sm text-primary hover:underline">
          ← بازگشت
        </Link>
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <h1 className="text-lg font-bold text-gray-900">{request.title}</h1>
          <span className="font-mono text-sm text-gray-500" dir="ltr">
            {request.trackingCode}
          </span>
          <StatusBadge status={request.status} />
          <PriorityBadge priority={request.priority as never} />
        </div>
        <p
          className={`text-sm mt-1 ${sla.isOverdue ? "text-red-600" : sla.isWarning ? "text-amber-600" : "text-gray-500"}`}
        >
          SLA: {sla.label}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="اطلاعات درخواست" />
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-gray-500">مشتری:</span> {request.customerName || request.customer.clinicName}</p>
            <p><span className="text-gray-500">تماس:</span> {request.phoneNumber}</p>
            <p><span className="text-gray-500">آدرس:</span> {request.clinicAddress}</p>
            <p><span className="text-gray-500">دستگاه:</span> {request.device.model} — <span dir="ltr">{request.device.serialNumber}</span></p>
            <p><span className="text-gray-500">شرح مشکل:</span> {request.problemDescription}</p>
            {request.assignedTechnician && (
              <p><span className="text-gray-500">تکنسین:</span> {request.assignedTechnician.fullName}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="تاریخچه وضعیت" />
          <CardContent>
            <ul className="space-y-2 text-sm max-h-60 overflow-y-auto">
              {request.statusHistory.map((h) => (
                <li key={h.id} className="border-b border-gray-50 pb-2">
                  <div className="flex justify-between">
                    <StatusBadge status={h.newStatus} />
                    <span className="text-xs text-gray-400">
                      {new Date(h.createdAt).toLocaleString("fa-IR")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {h.changedBy.fullName} — {h.note}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {(role === "TECHNICIAN" || role === "MANAGER" || role === "SUPPORT") && (
        <Card>
          <CardHeader title="تغییر وضعیت" />
          <CardContent className="space-y-3">
            <Select
              id="status"
              label="وضعیت جدید"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as RequestStatus)}
              options={statusOptions}
            />
            <Textarea
              id="note"
              label="یادداشت"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <Button onClick={changeStatus} loading={loading}>
              ذخیره وضعیت
            </Button>
            {role === "TECHNICIAN" && request.status !== "COMPLETED" && (
              <Link href={`/technician/reports/new?requestId=${request.id}`}>
                <Button variant="secondary" className="mr-2">
                  ثبت گزارش سرویس
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader title="گفتگو" />
        <CardContent>
          <div className="space-y-3 max-h-72 overflow-y-auto mb-4">
            {request.messages.length === 0 ? (
              <p className="text-sm text-gray-500">پیامی وجود ندارد</p>
            ) : (
              request.messages.map((m) => (
                <div
                  key={m.id}
                  className={`rounded-xl px-3 py-2 text-sm ${
                    m.sender.id === userId
                      ? "bg-primary/10 mr-8"
                      : "bg-gray-50 ml-8"
                  }`}
                >
                  <div className="font-medium text-gray-800">{m.sender.fullName}</div>
                  <p className="text-gray-700 mt-1">{m.body}</p>
                  <div className="text-[10px] text-gray-400 mt-1">
                    {new Date(m.createdAt).toLocaleString("fa-IR")}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex gap-2">
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="پیام خود را بنویسید..."
              rows={2}
            />
            <Button onClick={sendMessage} loading={loading} className="self-end">
              ارسال
            </Button>
          </div>
        </CardContent>
      </Card>

      {request.serviceReports.length > 0 && (
        <Card>
          <CardHeader title="گزارش‌های سرویس" />
          <CardContent className="space-y-4">
            {request.serviceReports.map((r) => (
              <div key={r.id} className="border border-gray-100 rounded-xl p-4 text-sm">
                <p className="font-medium">{r.technician.fullName}</p>
                <p className="mt-2 text-gray-700">{r.actionsDone}</p>
                {r.technicalNotes && (
                  <p className="text-gray-500 mt-1">{r.technicalNotes}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
