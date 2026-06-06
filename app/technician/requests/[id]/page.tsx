import { getSession } from "@/lib/auth/session";
import { getRequestById } from "@/lib/services/request.service";
import { redirect, notFound } from "next/navigation";
import { RequestDetailView } from "@/components/shared/RequestDetailView";

export default async function TechnicianRequestDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const request = await getRequestById(params.id);
  if (!request) notFound();

  if (
    session.role === "TECHNICIAN" &&
    request.assignedTechnicianId !== session.userId
  ) {
    redirect("/technician/requests");
  }

  return (
    <RequestDetailView
      request={request}
      role={session.role}
      userId={session.userId}
    />
  );
}
