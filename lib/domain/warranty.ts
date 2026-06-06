import { WarrantyStatus } from "@prisma/client";
import { differenceInDays, isAfter, isBefore, addDays } from "date-fns";

export type WarrantyInfo = {
  status: WarrantyStatus;
  remainingDays: number;
  isExpired: boolean;
};

export function calculateWarrantyStatus(
  warrantyEndDate: Date | null | undefined,
  warningDays = 30
): WarrantyInfo {
  if (!warrantyEndDate) {
    return { status: WarrantyStatus.EXPIRED, remainingDays: 0, isExpired: true };
  }

  const now = new Date();
  const remainingDays = differenceInDays(warrantyEndDate, now);

  if (isBefore(warrantyEndDate, now)) {
    return { status: WarrantyStatus.EXPIRED, remainingDays: 0, isExpired: true };
  }

  if (remainingDays <= warningDays) {
    return {
      status: WarrantyStatus.EXPIRING_SOON,
      remainingDays,
      isExpired: false,
    };
  }

  return { status: WarrantyStatus.ACTIVE, remainingDays, isExpired: false };
}

export function defaultWarrantyEnd(purchaseDate: Date, years = 2): Date {
  return addDays(purchaseDate, years * 365);
}

export async function syncDeviceWarranty(
  warrantyEndDate: Date | null
): Promise<WarrantyStatus> {
  return calculateWarrantyStatus(warrantyEndDate).status;
}
