import NextAuth, { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import { CLIENTES } from "@/lib/data";

// ── Admin
const ADMIN_EMAIL = "josemenacho@upb.edu";

// ── Clientes (de tu captura y el que usabas)
const CLIENT_EMAIL_BINDINGS_BY_RUBRO: Record<string, string> = {
  "josemiguelmenacho2104@gmail.com": "Comercialización",                // Cliente 1
  "chinmoto313@gmail.com":          "Servicios Tecnológicos",          // Cliente 2
  "comfortsport4@gmail.com":        "Constructora",                    // Cliente 3
  "josemiguelmenacho2504@gmail.com":"Farmacéutico",                    // Cliente 4 (BlackySsj)
};

// Si en lugar de rubro quieres fijar IDs exactos, usa este MODE B:
// const CLIENT_EMAIL_BINDINGS_BY_ID: Record<string, string> = {
//   "josemiguelmenacho2104@gmail.com": "gusto-srl",
//   "chinmoto313@gmail.com":           "acme-tech",
//   "comfortsport4@gmail.com":         "constructora-andina",
//   "josemiguelmenacho2504@gmail.com": "farmacia-vida",
// };

function firstClientIdByRubro(rubro: string): string | undefined {
  return CLIENTES.find(c => c.rubro === rubro)?.id;
}

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { prompt: "select_account" } },
    }),
  ],
  pages: { signIn: "/signin" },
  debug: true,
  callbacks: {
    async signIn({ user }) {
      const email = (user.email ?? "").toLowerCase();

      // Permitimos admin + todos los correos definidos arriba
      const allowed =
        email === ADMIN_EMAIL ||
        Object.keys(CLIENT_EMAIL_BINDINGS_BY_RUBRO).includes(email);
        // || Object.keys(CLIENT_EMAIL_BINDINGS_BY_ID).includes(email); // MODE B
      return allowed;
    },

    async session({ session }) {
      const email = (session.user?.email ?? "").toLowerCase();

      if (email === ADMIN_EMAIL) {
        session.role = "admin";
        session.clientIds = CLIENTES.map(c => c.id); // todas las empresas
        return session;
      }

      // Cliente por rubro (MODE A)
      const rubro = CLIENT_EMAIL_BINDINGS_BY_RUBRO[email];
      if (rubro) {
        const id = firstClientIdByRubro(rubro);
        session.role = "client";
        session.clientIds = id ? [id] : [];
        return session;
      }

      // // Cliente por ID (MODE B):
      // const id = CLIENT_EMAIL_BINDINGS_BY_ID[email];
      // if (id) {
      //   session.role = "client";
      //   session.clientIds = [id];
      //   return session;
      // }

      session.role = "guest";
      session.clientIds = [];
      return session;
    },

    async redirect({ url, baseUrl }) {
      try {
        const u = new URL(url, baseUrl);
        if (u.origin !== baseUrl) return `${baseUrl}/post-login`;
        if (u.pathname === "/" || u.pathname === "/signin") return `${baseUrl}/post-login`;
        const cb = u.searchParams.get("callbackUrl");
        if (cb && cb.includes("/signin")) return `${baseUrl}/post-login`;
        return u.toString();
      } catch {
        return `${baseUrl}/post-login`;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
