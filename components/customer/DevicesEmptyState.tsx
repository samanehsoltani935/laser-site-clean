"use client";

import { EmptyState } from "@/components/shared/EmptyState";
import { AddDeviceModal } from "@/components/customer/AddDeviceModal";
import { useState } from "react";

export function DevicesEmptyState() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <EmptyState
        title="هنوز دستگاهی ثبت نشده"
        description="برای شروع، اولین دستگاه کلینیک را اضافه کنید."
        actionLabel="افزودن دستگاه"
        onAction={() => setOpen(true)}
      />
      <AddDeviceModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
