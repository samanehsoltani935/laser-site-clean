export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const dynamicParams = true;

import { getSession } from "@/lib/auth/session";
import { getRequestById } from "@/lib/services/request.service";
import { redirect, notFound } from "next/navigation";
import { RequestDetailView } from "@/components/shared/RequestDetailView";

export default async function ManagerRequestDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "MANAGER" && session.role !== "SUPPORT") {
    redirect("/login");
  }

  const request = await getRequestById(params.id);

  if (!request) {
    notFound();
  }

  return (
    <RequestDetailView
      request={request}
      role={session.role}
      userId={session.userId}
    />
  );
}