import { describe, it, expect } from "vitest";
import { calculateWarrantyStatus } from "@/lib/domain/warranty";
import { addDays, subDays } from "date-fns";
import { WarrantyStatus } from "@prisma/client";

describe("calculateWarrantyStatus", () => {
  it("returns EXPIRED when warranty end date is in the past", () => {
    const result = calculateWarrantyStatus(subDays(new Date(), 10));
    expect(result.status).toBe(WarrantyStatus.EXPIRED);
    expect(result.isExpired).toBe(true);
    expect(result.remainingDays).toBe(0);
  });

  it("returns ACTIVE when warranty has more than 30 days remaining", () => {
    const result = calculateWarrantyStatus(addDays(new Date(), 60));
    expect(result.status).toBe(WarrantyStatus.ACTIVE);
    expect(result.isExpired).toBe(false);
    expect(result.remainingDays).toBeGreaterThan(30);
  });

  it("returns EXPIRING_SOON when within 30 days", () => {
    const result = calculateWarrantyStatus(addDays(new Date(), 15));
    expect(result.status).toBe(WarrantyStatus.EXPIRING_SOON);
    expect(result.isExpired).toBe(false);
  });
});

describe("generateTrackingCode", () => {
  it("generates unique tracking codes", async () => {
    const { generateTrackingCode } = await import("@/lib/domain/tracking-code");
    const code1 = generateTrackingCode();
    const code2 = generateTrackingCode();
    expect(code1).toMatch(/^KB-\d{4}-\d{6}$/);
    expect(code1).not.toBe(code2);
  });
});

describe("calculateSla", () => {
  it("detects overdue SLA", async () => {
    const { calculateSla } = await import("@/lib/domain/sla");
    const result = calculateSla(subDays(new Date(), 1));
    expect(result.isOverdue).toBe(true);
    expect(result.label).toBe("گذشته از مهلت");
  });

  it("warns when SLA is within 24 hours", async () => {
    const { calculateSla } = await import("@/lib/domain/sla");
    const result = calculateSla(addDays(new Date(), 0.5));
    expect(result.isWarning).toBe(true);
  });
});
