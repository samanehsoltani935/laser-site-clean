"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { DEVICE_MODELS } from "@/lib/constants/labels";
import { addDeviceAction } from "@/app/actions/device.actions";
import { useToast } from "@/components/ui/Toast";

export function AddDeviceModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErrors({});

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await addDeviceAction(formData);

      if (result.success) {
        toast("دستگاه با موفقیت ثبت شد", "success");
        onClose();
        router.refresh();
      } else {
        toast(result.error || "خطا در ثبت دستگاه", "error");
      }
    });
  }

  const modelOptions = [
    { value: "", label: "انتخاب مدل..." },
    ...DEVICE_MODELS.map((model) => ({
      value: model,
      label: model,
    })),
  ];

  return (
    <Modal open={open} onClose={onClose} title="افزودن دستگاه جدید">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="deviceName"
          name="deviceName"
          label="نام دستگاه"
          placeholder="مثلاً لیزر الکساندرایت"
        />

        <Select
          id="model"
          name="model"
          label="مدل دستگاه"
          required
          options={modelOptions}
          error={errors.model}
        />

        <Input
          id="serialNumber"
          name="serialNumber"
          label="شماره سریال"
          placeholder="KB-2025-0001"
          dir="ltr"
          required
          error={errors.serialNumber}
        />

        <Input
          id="installationDate"
          name="installationDate"
          label="تاریخ نصب"
          type="date"
        />

        <Input
          id="branch"
          name="branch"
          label="شعبه"
          placeholder="مثلاً شعبه مرکزی"
        />

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={pending} className="flex-1">
            ثبت دستگاه
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            انصراف
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export function AddDeviceButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>افزودن دستگاه</Button>
      <AddDeviceModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}