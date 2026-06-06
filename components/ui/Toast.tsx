"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

type Toast = { id: number; message: string; type: ToastType };

type ToastContextValue = {
  toast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };

  const colors = {
    success: "border-green-200 bg-green-50 text-green-800",
    error: "border-red-200 bg-red-50 text-red-800",
    info: "border-blue-200 bg-blue-50 text-blue-800",
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 left-4 z-[200] space-y-2">
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <div
              key={t.id}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-4 py-3 text-sm shadow-lg animate-in slide-in-from-bottom-2",
                colors[t.type]
              )}
            >
              <Icon size={16} />
              {t.message}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
