export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",   // protegemos dashboards (login requerido)
    // /share/* queda público (token firmado)
  ],
};
