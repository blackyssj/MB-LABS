import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// TODO: validar que quien invoca es admin (via NextAuth) si corresponde
export async function POST(req: NextRequest) {
  const { clientId, ttlMinutes = 120 } = await req.json();
  const jti = crypto.randomUUID();

  const token = jwt.sign(
    { sub: "dashboard-share", clientId, jti },
    process.env.NEXTAUTH_SECRET!,   // firma
    { expiresIn: `${ttlMinutes}m`, issuer: "mb-dash" }
  );

  const url = `${process.env.NEXTAUTH_URL}/share/${token}`;
  return NextResponse.json({ url, expiresAt: Date.now() + ttlMinutes * 60_000 });
}
