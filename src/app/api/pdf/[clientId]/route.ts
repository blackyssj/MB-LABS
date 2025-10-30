import { NextRequest } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: { clientId: string } }) {
  return new Response(`PDF no implementado aún para ${params.clientId}`, {
    status: 501,
    headers: { "Content-Type": "text/plain" },
  });
}
