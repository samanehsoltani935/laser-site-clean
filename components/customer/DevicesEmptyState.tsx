import { AddDeviceButton } from "@/components/customer/AddDeviceModal";

export function DevicesEmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center shadow-sm">
      <h2 className="text-base font-bold text-gray-900">
        هنوز دستگاهی ثبت نشده است
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
        برای ثبت درخواست خدمات، ابتدا باید دستگاه خود را ثبت کنید. پس از ثبت
        دستگاه، می‌توانید برای آن درخواست تعمیر، مشاوره یا سرویس دوره‌ای ایجاد
        کنید.
      </p>

      <div className="mt-5 flex justify-center">
        <AddDeviceButton />
      </div>
    </div>
  );
}