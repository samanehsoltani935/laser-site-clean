import { prisma } from "@/lib/db/prisma";
import { DeviceInput } from "@/lib/validations/schemas";
import { calculateWarrantyStatus, defaultWarrantyEnd } from "@/lib/domain/warranty";
import { parseDate } from "@/lib/api/helpers";

export async function getCustomerDevices(customerProfileId: string) {
  return prisma.device.findMany({
    where: { customerId: customerProfileId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createDevice(
  customerProfileId: string,
  input: DeviceInput
) {
  const purchaseDate = parseDate(input.purchaseDate) ?? new Date();
  const warrantyEndDate =
    parseDate(input.warrantyEndDate) ?? defaultWarrantyEnd(purchaseDate);
  const warrantyStatus = calculateWarrantyStatus(warrantyEndDate).status;

  return prisma.device.create({
    data: {
      customerId: customerProfileId,
      model: input.model,
      serialNumber: input.serialNumber,
      branch: input.branch,
      purchaseDate,
      installationDate: parseDate(input.installationDate),
      warrantyStartDate: parseDate(input.warrantyStartDate) ?? purchaseDate,
      warrantyEndDate,
      warrantyStatus,
    },
  });
}

export async function getDeviceById(id: string) {
  return prisma.device.findUnique({
    where: { id },
    include: {
      customer: { include: { user: true } },
      requests: {
        orderBy: { createdAt: "desc" },
        include: { statusHistory: { orderBy: { createdAt: "desc" }, take: 5 } },
      },
    },
  });
}

export async function updateDeviceWarranty(id: string) {
  const device = await prisma.device.findUnique({ where: { id } });
  if (!device) return null;

  const { status } = calculateWarrantyStatus(device.warrantyEndDate);
  return prisma.device.update({
    where: { id },
    data: { warrantyStatus: status },
  });
}
