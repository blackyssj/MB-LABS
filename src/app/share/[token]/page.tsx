import { notFound } from "next/navigation";
import jwt from "jsonwebtoken";
import ClientView from "@/app/dashboard/ClientView";

// Página pública (no requiere login): valida token firmado y pinta el dashboard
export default function Shared({ params }: { params: { token: string } }) {
  try {
    const payload = jwt.verify(params.token, process.env.NEXTAUTH_SECRET!) as any;
    const clientId = payload.clientId as string;
    return <ClientView clientId={clientId} />; // sólo lectura
  } catch {
    notFound();
  }
}
