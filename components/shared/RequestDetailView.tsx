"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RequestPriority, RequestStatus } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { StatusBadge, PriorityBadge } from "@/components/shared/Badges";
import { calculateSla } from "@/lib/domain/sla";
import { REQUEST_STATUS_LABELS } from "@/lib/constants/labels";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";

type RequestData = {
  id: string;
  trackingCode: string;
  title: string;
  status: RequestStatus;
  priority: RequestPriority;
  problemDescription: string;
  customerName: string | null;
  phoneNumber: string | null;
  clinicAddress: string | null;
  slaDueAt: Date | string | null;
  createdAt: Date | string;
  device: {
    model: string;
    serialNumber: string;
  };
  customer: {
    clinicName: string;
    user: {
      fullName: string;
    };
  };
  assignedTechnician: {
    fullName: string;
    id: string;
  } | null;
  statusHistory: {
    id: string;
    oldStatus: RequestStatus | null;
    newStatus: RequestStatus;
    note: string | null;
    createdAt: Date | string;
    changedBy: {
      fullName: string;
      role: string;
    };
  }[];
  messages: {
    id: string;
    body: string;
    createdAt: Date | string;
    sender: {
      id: string;
      fullName: string;
      role: string;
    };
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
    createdAt: Date | string;
    technician: {
      fullName: string;
    };
    usedSpareParts: {
      quantity: number;
      sparePart: {
        name: string;
      };
    }[];
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
  const [newStatus, setNewStatus] = useState<RequestStatus>(request.status);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const sla = calculateSla(request.slaDueAt ? new Date(request.slaDueAt) : null);

  const canChangeStatus =
    role === "TECHNICIAN" || role === "MANAGER" || role === "SUPPORT";

  const backHref =
    role === "MANAGER" || role === "SUPPORT"
      ? "/manager/requests"
      : role === "TECHNICIAN"
        ? "/technician/requests"
        : "/customer/requests";

  const statusOptions = Object.entries(REQUEST_STATUS_LABELS).map(
    ([value, label]) => ({
      value,
      label,
    })
  );

  async function sendMessage() {
    if (!message.trim()) {
      toast("متن پیام را وارد کنید", "error");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requestId: request.id,
        body: message,
      }),
    });

    const json = await res.json();

    setLoading(false);

    if (json.success) {
      toast("پیام با موفقیت ارسال شد", "success");
      setMessage("");
      router.refresh();
    } else {
      toast(json.error || "خطا در ارسال پیام", "error");
    }
  }

  async function changeStatus() {
    setLoading(true);

    const res = await fetch(`/api/requests/${request.id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: newStatus,
        note,
      }),
    });

    const json = await res.json();

    setLoading(false);

    if (json.success) {
      toast("وضعیت درخواست با موفقیت به‌روزرسانی شد", "success");
      router.refresh();
    } else {
      toast(json.error || "خطا در تغییر وضعیت درخواست", "error");
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <Link href={backHref} className="text-sm font-medium text-primary hover:underline">
          بازگشت
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="text-lg font-bold text-gray-900">{request.title}</h1>

          <span className="font-mono text-sm text-gray-500" dir="ltr">
            {request.trackingCode}
          </span>

          <StatusBadge status={request.status} />
          <PriorityBadge priority={request.priority} />
        </div>

        <div
          className={`mt-3 text-sm ${
            sla.isOverdue
              ? "text-red-600"
              : sla.isWarning
                ? "text-amber-600"
                : "text-gray-500"
          }`}
        >
          وضعیت SLA: {sla.label}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="اطلاعات درخواست" />

          <CardContent className="space-y-3 text-sm">
            <InfoRow
              label="مشتری / کلینیک"
              value={request.customerName || request.customer.clinicName}
            />

            <InfoRow label="شماره تماس" value={request.phoneNumber || "ثبت نشده"} />

            <InfoRow
              label="آدرس کلینیک"
              value={request.clinicAddress || "ثبت نشده"}
            />

            <InfoRow
              label="دستگاه"
              value={`${request.device.model} - ${request.device.serialNumber}`}
              ltr
            />

            <InfoRow
              label="کارشناس فنی"
              value={request.assignedTechnician?.fullName || "هنوز ارجاع نشده"}
            />

            <div className="rounded-xl bg-gray-50 p-4">
              <div className="mb-2 text-xs font-medium text-gray-500">
                شرح مشکل
              </div>

              <p className="leading-7 text-gray-800">
                {request.problemDescription}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="تاریخچه وضعیت" />

          <CardContent>
            {request.statusHistory.length === 0 ? (
              <p className="text-sm text-gray-500">
                هنوز تغییری در وضعیت ثبت نشده است.
              </p>
            ) : (
              <ul className="max-h-72 space-y-3 overflow-y-auto text-sm">
                {request.statusHistory.map((history) => (
                  <li
                    key={history.id}
                    className="rounded-xl border border-gray-100 p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <StatusBadge status={history.newStatus} />

                      <span className="text-xs text-gray-400">
                        {new Date(history.createdAt).toLocaleString("fa-IR")}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                      ثبت شده توسط: {history.changedBy.fullName} (
                      {getRoleLabel(history.changedBy.role)})
                    </div>

                    {history.note && (
                      <p className="mt-2 rounded-lg bg-gray-50 p-2 text-xs leading-6 text-gray-600">
                        {history.note}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {canChangeStatus && (
        <Card>
          <CardHeader title="تغییر وضعیت درخواست" />

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
              label="یادداشت تغییر وضعیت"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="مثلاً درخواست بررسی شد و به مرحله انجام منتقل شد."
              rows={3}
            />

            <div className="flex flex-wrap gap-3">
              <Button onClick={changeStatus} loading={loading}>
                ذخیره وضعیت
              </Button>

              {role === "TECHNICIAN" && request.status !== "COMPLETED" && (
                <Link href={`/technician/reports/new?requestId=${request.id}`}>
                  <Button variant="secondary">ثبت گزارش سرویس</Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader title="گفت‌وگو" />

        <CardContent>
          <div className="mb-4 max-h-72 space-y-3 overflow-y-auto">
            {request.messages.length === 0 ? (
              <p className="text-sm text-gray-500">
                هنوز پیامی برای این درخواست ثبت نشده است.
              </p>
            ) : (
              request.messages.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl px-3 py-2 text-sm ${
                    item.sender.id === userId
                      ? "mr-8 bg-primary/10"
                      : "ml-8 bg-gray-50"
                  }`}
                >
                  <div className="font-medium text-gray-800">
                    {item.sender.fullName}
                  </div>

                  <p className="mt-1 leading-6 text-gray-700">{item.body}</p>

                  <div className="mt-1 text-[10px] text-gray-400">
                    {new Date(item.createdAt).toLocaleString("fa-IR")}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex flex-col gap-2 md:flex-row">
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="پیام خود را بنویسید..."
              rows={2}
            />

            <Button onClick={sendMessage} loading={loading} className="md:self-end">
              ارسال
            </Button>
          </div>
        </CardContent>
      </Card>

      {request.attachments.length > 0 && (
        <Card>
          <CardHeader title="پیوست‌ها" />

          <CardContent className="space-y-2">
            {request.attachments.map((file) => (
              <a
                key={file.id}
                href={file.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl border border-gray-100 px-4 py-3 text-sm text-primary transition hover:bg-primary/5"
              >
                {file.fileName}
              </a>
            ))}
          </CardContent>
        </Card>
      )}

      {request.serviceReports.length > 0 && (
        <Card>
          <CardHeader title="گزارش‌های سرویس" />

          <CardContent className="space-y-4">
            {request.serviceReports.map((report) => (
              <div
                key={report.id}
                className="rounded-xl border border-gray-100 p-4 text-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-medium text-gray-900">
                    {report.technician.fullName}
                  </p>

                  <span className="text-xs text-gray-400">
                    {new Date(report.createdAt).toLocaleString("fa-IR")}
                  </span>
                </div>

                <p className="mt-3 leading-7 text-gray-700">
                  {report.actionsDone}
                </p>

                {report.technicalNotes && (
                  <p className="mt-2 rounded-xl bg-gray-50 p-3 leading-7 text-gray-500">
                    {report.technicalNotes}
                  </p>
                )}

                {report.usedSpareParts.length > 0 && (
                  <div className="mt-3 rounded-xl bg-gray-50 p-3">
                    <div className="mb-2 text-xs font-medium text-gray-500">
                      قطعات مصرف‌شده
                    </div>

                    <ul className="space-y-1">
                      {report.usedSpareParts.map((part) => (
                        <li
                          key={`${report.id}-${part.sparePart.name}`}
                          className="text-xs text-gray-600"
                        >
                          {part.sparePart.name} - تعداد: {part.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function InfoRow({
  label,
  value,
  ltr = false,
}: {
  label: string;
  value: string;
  ltr?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-gray-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs font-medium text-gray-500">{label}</span>

      <span
        className="text-sm font-medium text-gray-800"
        dir={ltr ? "ltr" : "rtl"}
      >
        {value}
      </span>
    </div>
  );
}

function getRoleLabel(role: string) {
  switch (role) {
    case "CUSTOMER":
      return "مشتری";
    case "TECHNICIAN":
      return "کارشناس فنی";
    case "MANAGER":
      return "مدیر";
    case "SUPPORT":
      return "پشتیبانی";
    default:
      return role;
  }
}