"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/shared/EmptyState";

type Notification = {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
};

export default function ManagerNotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setItems(json.data);
        setLoading(false);
      });
  }, []);

  async function markRead(id: string) {
    await fetch(`/api/notifications/${id}/read`, { method: "PUT" });
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold text-gray-900">اعلان‌ها</h1>
        <p className="text-sm text-gray-500 mt-1">لاگ اعلان‌های سیستم</p>
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">اعلانی وجود ندارد</p>
        ) : (
          items.map((n) => (
            <div
              key={n.id}
              role="button"
              tabIndex={0}
              onClick={() => !n.isRead && markRead(n.id)}
              onKeyDown={(e) => e.key === "Enter" && !n.isRead && markRead(n.id)}
            >
              <Card className={n.isRead ? "opacity-60" : "cursor-pointer"}>
                <CardContent className="py-3">
                  <div className="font-medium text-gray-900">{n.title}</div>
                  <p className="text-sm text-gray-600 mt-1">{n.body}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(n.createdAt).toLocaleString("fa-IR")}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
