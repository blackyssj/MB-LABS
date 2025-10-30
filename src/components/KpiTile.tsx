"use client";
import { QB } from "@/lib/data";

export default function KpiTile({
  label,
  value,
  hint,
  trend,          // opcional: { value: "+4% MoM", kind: "up"|"down" }
}: {
  label: string;
  value: string;
  hint?: string;
  trend?: { value: string; kind?: "up" | "down" };
}) {
  const pillBg =
    trend?.kind === "down" ? "#fff4e5" : "#e9fff7";
  const pillText =
    trend?.kind === "down" ? "#b76e00" : "#0a7f3f";
  const pillBorder =
    trend?.kind === "down" ? "#ffe7c2" : "#c8f5e6";

  return (
    <div className="card-surface p-4 md:p-5" style={{ borderColor: QB.border }}>
      <div className="text-xs mb-1" style={{ color: QB.muted }}>
        {label}
      </div>

      <div className="flex items-center gap-3">
        <div className="text-2xl md:text-[28px] font-semibold" style={{ color: QB.text }}>
          {value}
        </div>

        {trend?.value ? (
          <span
            className="inline-flex items-center text-[11px] px-2 py-[2px] rounded-full border"
            style={{ background: pillBg, color: pillText, borderColor: pillBorder }}
          >
            {trend.value}
          </span>
        ) : null}
      </div>

      {hint ? (
        <div className="text-[11px] mt-1" style={{ color: QB.muted }}>
          {hint}
        </div>
      ) : null}
    </div>
  );
}
