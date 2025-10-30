import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ClientView from "../ClientView";

export default async function ClientDashboardPage({ params }: { params: { clientId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");
  const allowed = (session as any).clientIds as string[] | undefined;
  if (!allowed?.includes(params.clientId)) {
    // Si no tiene permiso para ese cliente, mándalo a su home post-login
    redirect("/post-login");
  }
  return <ClientView clientId={params.clientId} />;
}

