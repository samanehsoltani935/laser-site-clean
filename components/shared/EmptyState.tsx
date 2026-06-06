import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
      <div className="text-base font-bold text-gray-900">{title}</div>
      {description && (
        <p className="text-sm text-gray-500 mt-2">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Link href={actionHref} className="inline-block mt-4">
          <Button>{actionLabel}</Button>
        </Link>
      )}
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}

export function LoadingSpinner({ label = "در حال بارگذاری..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
