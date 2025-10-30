// src/components/KpiCard.tsx
"use client";
import { QB } from "@/lib/data";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type Trend = { value: string; kind?: "up" | "down" | "flat"; note?: string };

export default function KpiCard({
  title,
  value,
  caption = "este mes",
  hint,
  trend,
  accent = "mint",
}: {
  title: string;
  value: string;
  caption?: string;
  hint?: string;
  trend?: Trend;
  accent?: "mint" | "blue" | "purple" | "amber";
}) {
  const topBand = {
    mint: "linear-gradient(90deg, rgba(34,211,163,.18), rgba(96,165,250,.12))",
    blue: "linear-gradient(90deg, rgba(96,165,250,.18), rgba(139,92,246,.12))",
    purple: "linear-gradient(90deg, rgba(139,92,246,.18), rgba(34,211,163,.12))",
    amber: "linear-gradient(90deg, rgba(251,191,36,.20), rgba(96,165,250,.10))",
  }[accent];

  const pill = (() => {
    if (!trend?.value) return null;
    const up = trend.kind === "up";
    const down = trend.kind === "down";
    const Icon = up ? TrendingUp : down ? TrendingDown : Minus;
    const bg = up ? "#e9fff7" : down ? "#fff4e5" : "#eef2ff";
    const fg = up ? "#0a7f3f" : down ? "#b76e00" : "#3b5bfd";
    const bd = up ? "#c8f5e6" : down ? "#ffe7c2" : "#dfe5ff";
    return (
      <span
        className="inline-flex items-center gap-1 text-[11px] px-2 py-[2px] rounded-full border"
        style={{ background: bg, color: fg, borderColor: bd }}
      >
        <Icon size={12} />
        {trend.value}
      </span>
    );
  })();

  return (
    <section className="card-surface digits-kpi overflow-hidden" style={{ borderColor: QB.border }}>
      <div style={{ height: 4, background: topBand }} />
      <div className="p-4 md:p-5 pt-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[13px] font-medium" style={{ color: QB.text }}>
              {title}
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: QB.muted }}>
              {caption}
            </div>
          </div>
          {pill}
        </div>

        <div className="mt-2 text-[28px] md:text-[30px] font-semibold leading-tight" style={{ color: QB.text }}>
          {value}
        </div>

        {hint && (
          <div className="text-[11px] mt-2" style={{ color: QB.muted }}>
            {hint}
          </div>
        )}
      </div>
    </section>
  );
}
