import "next-auth";

declare module "next-auth" {
  interface Session {
    role?: "admin" | "client" | "guest";
    clientIds?: string[];
  }
}
