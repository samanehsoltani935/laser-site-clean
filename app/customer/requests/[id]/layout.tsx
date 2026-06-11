export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const dynamicParams = true;

import { getSession, getDashboardPath } from "@/lib/auth/session";
import { getRequestById } from "@/lib/services/request.service";
import { redirect, notFound } from "next/navigation";
import { RequestDetailView } from "@/components/shared/RequestDetailView";

export default async function CustomerRequestDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "CUSTOMER") {
    redirect(getDashboardPath(session.role));
  }

  const request = await getRequestById(params.id);

  if (!request) {
    notFound();
  }

  if (request.customer.userId !== session.userId) {
    redirect("/customer/requests");
  }

  return (
    <RequestDetailView
      request={request}
      role={session.role}
      userId={session.userId}
    />
  );
}