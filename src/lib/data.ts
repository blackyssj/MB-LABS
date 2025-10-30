// Tipos + datos DEMO. Reemplaza luego con lecturas Odoo/Excel.
export type Serie = { name: string; ventas: number; gastos: number; caja?: number };
export type KPI = { key: string; label: string; value: number | string; hint?: string };
export type ChartBKind = "inventory" | "curvaS" | "utilizacion" | "mrr" | "acpc" | "otif";

export type RubroData = {
  rubro: string;
  empresa: string;
  kpisBase: { ingresos: number; margen: number; liquidez: number; endeudamiento: number };
  kpiRubro1: KPI; // KPI 5
  kpiRubro2: KPI; // KPI 6
  series: Serie[]; // Ingresos vs Gastos (gráfico A)
  chartB: { type: ChartBKind; data: any[] }; // Gráfico B cambia por rubro
};

export type Client = { id: string; nombre: string; rubro: RubroKey };

export type RubroKey =
  | "Farmacéutico"
  | "Constructora"
  | "Servicios de Construcción"
  | "Servicios Tecnológicos"
  | "Mineras"
  | "Comercialización";

export const MONTHS = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];
const mk = (base:number, inc:number, n=6) => Array.from({length:n}, (_,i)=> base + i*inc);
const mkSeries = (v:number[], g:number[]) => v.map((x,i)=>({ name: MONTHS[i], ventas: x, gastos: g[i] }));

export const DEMO_BY_RUBRO: Record<RubroKey, RubroData> = {
  "Farmacéutico": {
    rubro: "Farmacéutico",
    empresa: "MB – Pharma",
    kpisBase: { ingresos: 185000, margen: 0.42, liquidez: 2.1, endeudamiento: 0.33 },
    kpiRubro1: { key:"rotInv", label:"Rotación de Inventario (días)", value: 58, hint:"Existencias / Costo diario" },
    kpiRubro2: { key:"vencer90", label:"Stock por vencer ≤90d", value: "Bs 24.500" },
    series: mkSeries(mk(22000,6000), mk(13000,4200)),
    chartB: { type:"inventory", data:[
      { bucket:"≤30", valor: 9500 }, { bucket:"31–60", valor: 7800 }, { bucket:"61–90", valor: 5200 }, { bucket:">90", valor: 4100 }
    ]},
  },
  "Constructora": {
    rubro: "Constructora",
    empresa: "MB – Obras",
    kpisBase: { ingresos: 320000, margen: 0.18, liquidez: 1.25, endeudamiento: 0.58 },
    kpiRubro1: { key:"avance", label:"Avance financiero", value: "64%", hint:"Facturado/Contrato" },
    kpiRubro2: { key:"backlog", label:"Backlog (pendiente)", value: "Bs 1.2M" },
    series: mkSeries(mk(42000,16000), mk(34000,12000)),
    chartB: { type:"curvaS", data: MONTHS.slice(0,6).map((m,i)=>({ name:m, plan:(i+1)*18, exec:(i+1)*16 + (i>3?3:0) })) },
  },
  "Servicios de Construcción": {
    rubro: "Servicios de Construcción",
    empresa: "MB – Contratista",
    kpisBase: { ingresos: 145000, margen: 0.24, liquidez: 1.7, endeudamiento: 0.41 },
    kpiRubro1: { key:"util", label:"Utilización cuadrillas", value: "78%", hint:"Horas facturables / disponibles" },
    kpiRubro2: { key:"hitos", label:"Cumplimiento de hitos", value: "91%" },
    series: mkSeries(mk(18000,7000), mk(12500,5200)),
    chartB: { type:"utilizacion", data:[
      { semana:"S1", fact:32, nofact:10 }, { semana:"S2", fact:36, nofact:9 }, { semana:"S3", fact:38, nofact:8 }, { semana:"S4", fact:40, nofact:7 }
    ]},
  },
  "Servicios Tecnológicos": {
    rubro: "Servicios Tecnológicos",
    empresa: "MB – Tech",
    kpisBase: { ingresos: 168000, margen: 0.46, liquidez: 2.4, endeudamiento: 0.22 },
    kpiRubro1: { key:"mrr", label:"MRR actual", value: "Bs 62.000" },
    kpiRubro2: { key:"churn", label:"Churn mensual", value: "2.8%" },
    series: mkSeries(mk(24000,3000), mk(14000,1500)),
    chartB: { type:"mrr", data: MONTHS.slice(0,6).map((m,i)=>({ name:m, mrr: 45000 + i*2500 })) },
  },
  "Mineras": {
    rubro: "Mineras",
    empresa: "MB – Mining",
    kpisBase: { ingresos: 510000, margen: 0.21, liquidez: 1.35, endeudamiento: 0.62 },
    kpiRubro1: { key:"cogsPct", label:"COGS / Ingresos", value: "72%" },
    kpiRubro2: { key:"rotRep", label:"Rotación repuestos (días)", value: 95 },
    series: mkSeries(mk(70000,12000), mk(52000,9000)),
    chartB: { type:"acpc", data:[ { k:"Activos Ctes", v: 720000 }, { k:"Pasivos Ctes", v: 530000 } ] },
  },
  "Comercialización": {
    rubro: "Comercialización",
    empresa: "MB – Trading",
    kpisBase: { ingresos: 275000, margen: 0.27, liquidez: 1.9, endeudamiento: 0.36 },
    kpiRubro1: { key:"rot", label:"Rotación inventario (días)", value: 45 },
    kpiRubro2: { key:"otif", label:"OTIF (fill rate)", value: "93%" },
    series: mkSeries(mk(31000,11000), mk(21000,8000)),
    chartB: { type:"otif", data: MONTHS.slice(0,6).map((m,i)=>({ name:m, otif: 88 + (i%3)*2 })) },
  },
};

export const CLIENTES: Client[] = [
  { id:"gusto-srl", nombre:"Gusto SRL", rubro:"Comercialización" },
  { id:"postmates", nombre:"Postmates", rubro:"Comercialización" },
  { id:"rev-tech", nombre:"Rev Tech", rubro:"Servicios Tecnológicos" },
  { id:"acme-consulting", nombre:"Acme Consulting", rubro:"Servicios Tecnológicos" },
  { id:"mb-pharma", nombre:"MB Pharma", rubro:"Farmacéutico" },
  { id:"mb-obras", nombre:"MB Obras", rubro:"Constructora" },
  { id:"mb-contratista", nombre:"MB Contratista", rubro:"Servicios de Construcción" },
  { id:"mb-mining", nombre:"MB Mining", rubro:"Mineras" },
];

// Paleta estilo QuickBooks + helpers
/*export const QB = {
  bg: "#F6F7F9",
  card: "#FFFFFF",
  border: "#E6E8EB",
  text: "#1F2937",
  muted: "#6B7280",
  primary: "#2CA01C",
  primaryLight: "#DFF4E5",
  teal: "#1FB7A6",
  blue: "#2E86DE",
  purple: "#8B5CF6",
  grid: "#EAECEE",
};*/


export const QB = {
  // Fondo global (lo pintaremos desde CSS, aquí lo dejamos transparente)
  bg: "transparent",

  // Tarjetas
  card: "#ffffff",
  border: "#e7ecf3",
  grid: "rgba(17, 24, 39, 0.06)",

  // Texto
  text: "#0f172a",       // slate-900
  muted: "#6b7280",      // gray-500

  // Acentos Digits
  primary: "#22d3a3",    // mint/teal (Cash, líneas positivas)
  teal: "#34d399",       // barras "gastos" / acento secundario
  blue: "#60a5fa",       // barras azules / líneas secundarias
  purple: "#8b5cf6",     // línea morada (cash flow)
  amber: "#fbbf24",      // pill amarilla de cambio

  // Sombras estilo Digits
  shadow:
    "0 6px 16px rgba(20,32,63,0.06), 0 1px 0 rgba(20,32,63,0.02)",
};

export const fmtNum = (n:number) => n.toLocaleString("es-BO");
export const fmtPct = (x:number) => `${(x*100).toFixed(1)}%`;
