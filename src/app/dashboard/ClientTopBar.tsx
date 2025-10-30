"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogOut, Building2, ShieldCheck } from "lucide-react";
import { QB } from "@/lib/data";

type Props = {
  client: { id: string; nombre: string; rubro: string };
};

export default function ClientTopBar({ client }: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  const role = (session?.role ?? "client") as "admin" | "client" | "guest";
  const email = session?.user?.email ?? "";

  const showBack = role === "admin"; // solo admin ve “Volver al panel”

  // Iniciales para “avatar” simple
  const initials =
    client.nombre
      .split(" ")
      .slice(0, 2)
      .map((s) => s[0])
      .join("")
      .toUpperCase() || "MB";

  return (
    <header className="mb-5">
      <div
        className="rounded-2xl border p-4 md:p-5 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(230,245,255,0.85) 0%, rgba(230,255,245,0.85) 100%)",
          borderColor: QB.border,
        }}
      >
        {/* fondo decorativo */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
             style={{ background: QB.primary }} />
        <div className="absolute -bottom-16 -left-8 w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none"
             style={{ background: QB.blue }} />

        <div className="relative flex items-start justify-between gap-3">
          {/* Izquierda: volver (si admin) + marca empresa */}
          <div className="flex items-start gap-3">
            <div className="flex flex-col gap-2">
              {showBack && (
                <button
                  onClick={() => router.push("/admin/clients")}
                  className="flex items-center gap-2 text-sm"
                  style={{ color: QB.muted }}
                  title="Volver al panel de administración"
                >
                  <ArrowLeft size={18} />
                  Volver
                </button>
              )}

              <div className="flex items-center gap-3">
                {/* Avatar con iniciales */}
                <div
                  className="w-12 h-12 rounded-xl grid place-items-center font-bold shadow-sm"
                  style={{
                    background: "#ffffff",
                    border: `1px solid ${QB.border}`,
                    color: QB.primary,
                  }}
                >
                  {initials}
                </div>

                <div>
                  <div
                    className="text-2xl md:text-[28px] font-semibold leading-tight"
                    style={{ color: QB.text }}
                  >
                    {client.nombre}
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                      style={{
                        background: "#eef7f1",
                        color: "#0a7f3f",
                        border: "1px solid #d5f0df",
                      }}
                    >
                      <Building2 size={14} />
                      {client.rubro}
                    </span>

                    <span
                      className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                      style={{
                        background: "#eef2ff",
                        color: "#3b5bfd",
                        border: "1px solid #dfe5ff",
                      }}
                      title={email}
                    >
                      <ShieldCheck size={14} />
                      {role === "admin" ? "Administrador" : "Cliente"}
                    </span>
                  </div>

                  <div className="text-xs mt-1" style={{ color: QB.muted }}>
                    Resumen del negocio
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Derecha: acciones */}
          <div className="flex items-center gap-2">
            <div className="hidden md:block text-xs text-right mr-1" style={{ color: QB.muted }}>
              {email}
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/signin", redirect: true })}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm"
              style={{ borderColor: QB.border }}
              title="Cerrar sesión"
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
