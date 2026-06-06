import {
  RequestPriority,
  RequestStatus,
  WarrantyStatus,
} from "@prisma/client";
import {
  REQUEST_STATUS_LABELS,
  REQUEST_PRIORITY_LABELS,
  WARRANTY_STATUS_LABELS,
  STATUS_COLORS,
  PRIORITY_COLORS,
} from "@/lib/constants/labels";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={cn(
        "inline-flex text-[11px] px-2.5 py-1 rounded-full border font-medium",
        STATUS_COLORS[status]
      )}
    >
      {REQUEST_STATUS_LABELS[status]}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: RequestPriority }) {
  return (
    <span
      className={cn(
        "inline-flex text-[11px] px-2.5 py-1 rounded-full border font-medium",
        PRIORITY_COLORS[priority]
      )}
    >
      {REQUEST_PRIORITY_LABELS[priority]}
    </span>
  );
}

export function WarrantyBadge({ status }: { status: WarrantyStatus }) {
  const colors: Record<WarrantyStatus, string> = {
    ACTIVE: "bg-green-50 text-green-700 border-green-100",
    EXPIRED: "bg-red-50 text-red-700 border-red-100",
    EXPIRING_SOON: "bg-amber-50 text-amber-700 border-amber-100",
  };
  return (
    <span
      className={cn(
        "inline-flex text-[11px] px-2.5 py-1 rounded-full border font-medium",
        colors[status]
      )}
    >
      {WARRANTY_STATUS_LABELS[status]}
    </span>
  );
}
