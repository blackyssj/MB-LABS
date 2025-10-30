"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  LogOut,
  UserCog,
  ExternalLink,
  Link2,
  FileDown,
  Share2,
} from "lucide-react";

import { CLIENTES, QB } from "@/lib/data";

type Cliente = { id: string; nombre: string; rubro: string };

export default function AdminClientsPage() {
  // --- Hooks ---
  const { data: session, status } = useSession();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [rubro, setRubro] = useState<string>("Todos");

  const rubros = useMemo(() => {
    const set = new Set(CLIENTES.map((c) => c.rubro));
    return ["Todos", ...Array.from(set).sort()];
  }, []);

  const filtered: Cliente[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CLIENTES.filter((c) => {
      const okRubro = rubro === "Todos" || c.rubro === rubro;
      const okQuery =
        !q ||
        c.nombre.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.rubro.toLowerCase().includes(q);
      return okRubro && okQuery;
    }).sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [query, rubro]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin");
      return;
    }
    if (status === "authenticated" && (session as any)?.role !== "admin") {
      const first = (session as any)?.clientIds?.[0];
      router.replace(first ? `/dashboard/${first}` : "/signin");
    }
  }, [status, session, router]);

  // Acciones
  const openDashboard = (id: string) => router.push(`/dashboard/${id}`);
  const createShare = async (id: string) => {
    try {
      const res = await fetch("/api/share/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: id, ttlMinutes: 120 }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      await navigator.clipboard.writeText(data.url);
      alert(
        `Enlace copiado.\nExpira: ${new Date(data.expiresAt).toLocaleString()}\n\n${data.url}`
      );
    } catch (e) {
      alert("No se pudo generar el enlace.");
      console.error(e);
    }
  };

  // Loading state (skeleton)
  if (status === "loading") {
    return (
      <main
        className="min-h-screen relative overflow-hidden"
        style={{ background: QB.bg }}
      >
        <BackdropDecor />
        <div className="max-w-6xl mx-auto p-6">
          <HeaderSkeleton />
          <ControlsSkeleton />
          <GridSkeleton />
        </div>
      </main>
    );
  }

  const isAdmin = status === "authenticated" && (session as any)?.role === "admin";
  if (!isAdmin) {
    return (
      <main className="min-h-screen grid place-items-center p-6" style={{ background: QB.bg }}>
        <BackdropDecor />
        <p className="text-sm" style={{ color: QB.muted }}>Redirigiendo…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden" style={{ background: QB.bg }}>
      {/* Orbes y malla para mantener la identidad del login */}
      <BackdropDecor />

      <div className="max-w-6xl mx-auto p-6 lg:p-10">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold" style={{ color: QB.text }}>
              Panel Administrativo — Clientes
            </h1>
            <p className="text-sm mt-1 flex items-center gap-2" style={{ color: QB.muted }}>
              <UserCog className="h-4 w-4" />
              Usuario: <b className="font-medium">{(session as any)?.user?.email}</b>
              <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs"
                style={{ borderColor: QB.border, color: QB.muted }}>
                Admin
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => signOut({ callbackUrl: "/signin", redirect: true })}
              className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition hover:opacity-90"
              style={{ borderColor: QB.border, color: QB.muted, background: QB.card }}
              title="Cerrar sesión y elegir otra cuenta"
            >
              <LogOut className="h-4 w-4" /> Cambiar de cuenta
            </button>
          </div>
        </motion.div>

        {/* Controles */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="rounded-2xl p-4 md:p-5 mb-5 border backdrop-blur"
          style={{ background: "rgba(255,255,255,0.04)", borderColor: QB.border }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex-1 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: QB.muted }} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar por nombre, rubro o ID…"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm"
                  style={{ borderColor: QB.border, background: "white" }}
                />
              </div>
              <div className="relative w-full sm:w-56">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: QB.muted }} />
                <select
                  value={rubro}
                  onChange={(e) => setRubro(e.target.value)}
                  className="w-full appearance-none pl-9 pr-8 py-2.5 rounded-xl border text-sm bg-white"
                  style={{ borderColor: QB.border }}
                >
                  {rubros.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: QB.muted }}>▼</span>
              </div>
            </div>
            <div className="text-xs sm:text-sm shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-full border"
                 style={{ borderColor: QB.border, color: QB.muted, background: QB.card }}>
              {filtered.length} cliente(s)
            </div>
          </div>
        </motion.div>

        {/* Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.08 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            filtered.map((c, idx) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.02 }}
                className="rounded-2xl p-4 border group hover:shadow-xl transition bg-white"
                style={{ borderColor: QB.border }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-lg font-semibold" style={{ color: QB.text }}>{c.nombre}</div>
                    <div className="text-xs mt-0.5" style={{ color: QB.muted }}>ID: {c.id}</div>
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded-full border"
                    style={{ background: "#eef7f1", color: "#0a7f3f", borderColor: "#d5f0df" }}
                  >
                    {c.rubro}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-3">
                  <button
                    onClick={() => openDashboard(c.id)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition hover:bg-gray-50"
                    style={{ borderColor: QB.border }}
                  >
                    <ExternalLink className="h-4 w-4" /> Ver dashboard
                  </button>

                  <button
                    onClick={() => createShare(c.id)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition hover:bg-gray-50"
                    style={{ borderColor: QB.border }}
                  >
                    <Share2 className="h-4 w-4" /> Generar enlace
                  </button>

                  <a
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition hover:bg-gray-50"
                    style={{ borderColor: QB.border }}
                    href={`/api/pdf/${c.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FileDown className="h-4 w-4" /> Descargar PDF
                  </a>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </main>
  );
}

// -------------------- UI helpers --------------------
function BackdropDecor() {
  return (
    <>
      {/* Orbes de color */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-fuchsia-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
      {/* Malla sutil */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px, 40px 40px",
        }}
      />
    </>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full">
      <div className="rounded-2xl border p-10 text-center" style={{ borderColor: QB.border, background: "rgba(255,255,255,0.5)" }}>
        <p className="text-sm" style={{ color: QB.muted }}>
          No se encontraron clientes con los filtros aplicados.
        </p>
      </div>
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
      <div className="space-y-2">
        <div className="h-7 w-60 rounded-lg animate-pulse" style={{ background: QB.card }} />
        <div className="h-4 w-72 rounded-lg animate-pulse" style={{ background: QB.card }} />
      </div>
      <div className="h-9 w-44 rounded-xl animate-pulse" style={{ background: QB.card }} />
    </div>
  );
}

function ControlsSkeleton() {
  return (
    <div className="rounded-2xl p-4 mb-5 border" style={{ background: "rgba(255,255,255,0.04)", borderColor: QB.border }}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="h-10 rounded-xl animate-pulse" style={{ background: QB.card }} />
        <div className="h-10 rounded-xl animate-pulse" style={{ background: QB.card }} />
        <div className="h-10 rounded-xl animate-pulse" style={{ background: QB.card }} />
      </div>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-40 rounded-2xl border animate-pulse" style={{ borderColor: QB.border, background: "rgba(255,255,255,0.5)" }} />
      ))}
    </div>
  );
}
