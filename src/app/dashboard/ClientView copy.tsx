"use client";

import React, { useMemo } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import { CLIENTES, DEMO_BY_RUBRO, QB, fmtNum } from "@/lib/data";
import CardShell from "@/components/CardShell";
import KpiTile from "@/components/KpiTile";
import ChartSwitch from "@/components/ChartSwitch";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ArrowLeft, Building2, LogOut, ShieldCheck } from "lucide-react";

/* ----------- Helpers de formato ----------- */
const fmtShort = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
    ? `${Math.round(n / 1_000)}K`
    : `${n}`;

const axisCurrency = (v: number) => `Bs ${fmtShort(Number(v))}`;
const axisTickStyle = {
  fill: QB.muted,
  fontSize: 12,
  textAnchor: "middle" as const,
};

type UIKPI = { label: string; value: string; hint?: string };

/* ----------- Supuestos de DSO por rubro (para Rotación CxC DEMO) ----------- */
const DSO_BY_RUBRO: Record<string, number> = {
  "Farmacéutico": 50,
  "Constructora": 60,
  "Servicios de Construcción": 60,
  "Mineras": 70,
  "Servicios Tecnológicos y Digitales": 35,
  "Servicios Tecnológicos": 35,
  "Comercialización": 45,
};

export default function ClientView({ clientId }: { clientId: string }) {
  const { data: session } = useSession();
  const router = useRouter();

  /* Datos del cliente */
  const client = CLIENTES.find((c) => c.id === clientId);
  if (!client) return <div className="p-6">Cliente no encontrado.</div>;

  const role = (session?.role ?? "client") as "admin" | "client" | "guest";
  const email = session?.user?.email ?? "";

  const rubroData = DEMO_BY_RUBRO[client.rubro];

  /* ----------- Cálculos para KPIs oficiales ----------- */
  const last = rubroData.series.at(-1) ?? { ventas: 0, gastos: 0 };

  // 1) Margen de utilidad neta (net margin %)
  const margenNetoPct = (rubroData.kpisBase.margen ?? 0) * 100;

  // 2) Liquidez corriente (current ratio)
  const liquidezCorriente = rubroData.kpisBase.liquidez ?? 0;

  // 3) Rotación de CxC: estimación por DSO
  const dso = DSO_BY_RUBRO[client.rubro] ?? 60; // días
  const rotacionCxC = +(365 / dso).toFixed(2);  // veces por año

  // 4) EBITDA (estimado) – DEMO:
  //    EBITDA ≈ (Ventas - Gastos) + 8%*Gastos   (proxy por D&A + ITs)
  const ebitdaEstimado = Math.max(0, last.ventas - last.gastos + last.gastos * 0.08);
  const ebitdaPct = last.ventas > 0 ? (ebitdaEstimado / last.ventas) * 100 : 0;

  // 5) Ratio de endeudamiento (%)
  const endeudamientoPct = (rubroData.kpisBase.endeudamiento ?? 0) * 100;

  /* ----------- KPIs a mostrar ----------- */
  const kpis: UIKPI[] = useMemo(
    () => [
      {
        label: "Margen de utilidad neta",
        value: `${margenNetoPct.toFixed(1)}%`,
        hint: "Fórmula: Utilidad Neta / Ventas × 100",
      },
      {
        label: "Liquidez Corriente",
        value: `${liquidezCorriente.toFixed(2)}x`,
        hint: "Fórmula: Activos Corrientes / Pasivos Corrientes",
      },
      {
        label: "Rotación de CxC",
        value: `${rotacionCxC}x`,
        hint: `Ventas a crédito / Cuentas por cobrar promedio · Equivalente a ${dso} días (DSO)`,
      },
      {
        label: "EBITDA (estimado)",
        value: `Bs ${fmtNum(ebitdaEstimado)} · ${ebitdaPct.toFixed(1)}%`,
        hint:
          "Proxy DEMO: (Ventas - Gastos) + 8%*Gastos. Reemplazar con datos reales de Odoo: Neta + Intereses + Impuestos + Depreciación + Amortización.",
      },
      {
        label: "Ratio de Endeudamiento",
        value: `${endeudamientoPct.toFixed(1)}%`,
        hint: "Fórmula: Pasivos Totales / Activos Totales × 100",
      },
    ],
    [margenNetoPct, liquidezCorriente, rotacionCxC, dso, ebitdaEstimado, ebitdaPct, endeudamientoPct]
  );

  /* ----------- Datos para gráficos ----------- */
  const pieData = useMemo(
    () => [
      { name: "Operativo", value: (last.gastos ?? 0) * 0.55 },
      { name: "Administración", value: (last.gastos ?? 0) * 0.25 },
      { name: "Ventas", value: (last.gastos ?? 0) * 0.20 },
    ],
    [last.gastos]
  );

  // Iniciales para “avatar” simple
  const initials =
    client.nombre
      .split(" ")
      .slice(0, 2)
      .map((s) => s[0])
      .join("")
      .toUpperCase() || "MB";

  return (
    <div className="min-h-screen w-full p-4 md:p-6" style={{ background: QB.bg }}>
      {/* Encabezado mejorado */}
      <header className="mb-5">
        <div
          className="rounded-2xl border p-4 md:p-5 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(230,245,255,0.85) 0%, rgba(230,255,245,0.85) 100%)",
            borderColor: QB.border,
          }}
        >
          {/* halos */}
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none" style={{ background: QB.primary }} />
          <div className="absolute -bottom-16 -left-8  w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: QB.blue }} />

          <div className="relative flex items-start justify-between gap-3">
            {/* Izquierda: volver si admin + marca */}
            <div className="flex items-start gap-3">
              <div className="flex flex-col gap-2">
                {role === "admin" && (
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
                  <div
                    className="w-12 h-12 rounded-xl grid place-items-center font-bold shadow-sm"
                    style={{ background: "#fff", border: `1px solid ${QB.border}`, color: QB.primary }}
                  >
                    {initials}
                  </div>

                  <div>
                    <div className="text-2xl md:text-[28px] font-semibold leading-tight" style={{ color: QB.text }}>
                      {client.nombre} — {client.rubro}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                        style={{ background: "#eef2ff", color: "#3b5bfd", border: "1px solid #dfe5ff" }}
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

            {/* Derecha: email + cerrar sesión */}
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

      {/* Fila superior: 3 tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CardShell title="Saldos y tendencia" subtitle="Caja estimada">
          <div className="text-2xl font-bold text-center mb-2" style={{ color: QB.primary }}>
            Bs {fmtNum(Math.max(0, rubroData.kpisBase.ingresos - rubroData.kpisBase.ingresos * 0.6))}
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rubroData.series} margin={{ top: 6, right: 6, bottom: 0, left: 6 }}>
                <CartesianGrid stroke={QB.grid} />
                <XAxis dataKey="name" tick={axisTickStyle} tickLine={false} />
                <YAxis width={60} tick={axisTickStyle} tickLine={false} tickFormatter={axisCurrency} />
                <RechartsTooltip formatter={(v: any) => `Bs ${fmtNum(Number(v))}`} />
                <Bar dataKey="ventas" name="Ingresos" radius={[4, 4, 0, 0]} fill={QB.primary} />
                <Bar dataKey="gastos" name="Gastos" radius={[4, 4, 0, 0]} fill={QB.teal} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardShell>

        <CardShell title="Último mes" subtitle="¿En qué se gasta?">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70} paddingAngle={3} isAnimationActive={false}>
                  <Cell fill={QB.teal} />
                  <Cell fill={QB.blue} />
                  <Cell fill={QB.purple} />
                </Pie>
                <Legend verticalAlign="bottom" height={24} />
                <RechartsTooltip formatter={(v: any) => `Bs ${fmtNum(Number(v))}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardShell>

        <CardShell title="Foto rápida" subtitle="Ingresos vs Gastos (mes)">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rubroData.series} margin={{ top: 6, right: 6, bottom: 0, left: 6 }}>
                <defs>
                  <linearGradient id="inc" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={QB.primary} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={QB.primary} stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="exp" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={QB.blue} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={QB.blue} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={QB.grid} />
                <XAxis dataKey="name" tick={axisTickStyle} tickLine={false} />
                <YAxis hide />
                <RechartsTooltip formatter={(v: any) => `Bs ${fmtNum(Number(v))}`} />
                <Area type="monotone" dataKey="ventas" name="Ingresos" stroke={QB.primary} fill="url(#inc)" />
                <Area type="monotone" dataKey="gastos" name="Gastos" stroke={QB.blue} fill="url(#exp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardShell>
      </div>

      {/* KPIs oficiales (5) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {kpis.map((k, i) => (
          <KpiTile key={i} label={k.label} value={k.value} hint={k.hint} />
        ))}
      </div>

      {/* Dos gráficos finales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <CardShell title="Tendencia" subtitle="Ingresos vs Gastos (12M)">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rubroData.series} margin={{ top: 6, right: 6, bottom: 0, left: 6 }}>
                <CartesianGrid stroke={QB.grid} />
                <XAxis dataKey="name" tick={axisTickStyle} tickLine={false} />
                <YAxis width={64} tick={axisTickStyle} tickLine={false} tickFormatter={axisCurrency} />
                <RechartsTooltip formatter={(v: any) => `Bs ${fmtNum(Number(v))}`} />
                <Line type="monotone" dataKey="ventas" name="Ingresos" stroke={QB.primary} strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="gastos" name="Gastos" stroke={QB.teal} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardShell>

        <CardShell
          title={
            rubroData.chartB.type === "inventory"
              ? "Stock por vencimiento"
              : rubroData.chartB.type === "curvaS"
              ? "Curva S (Plan vs Ejecutado)"
              : rubroData.chartB.type === "utilizacion"
              ? "Uso de cuadrillas"
              : rubroData.chartB.type === "mrr"
              ? "MRR (mensual)"
              : rubroData.chartB.type === "acpc"
              ? "Activos ctes vs Pasivos ctes"
              : "OTIF (entrega a tiempo)"
          }
          subtitle="Vista por rubro"
        >
          <div className="h-64">
            <ChartSwitch type={rubroData.chartB.type} data={rubroData.chartB.data} />
          </div>
        </CardShell>
      </div>
    </div>
  );
}
