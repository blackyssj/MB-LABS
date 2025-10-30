"use client";
import React from "react";
import { QB } from "@/lib/data";

export default function KpiTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div
      className="rounded-xl p-4 text-center"
      style={{ background: QB.card, border: `1px solid ${QB.border}` }}
    >
      <div className="text-[11px] tracking-wide uppercase" style={{ color: QB.muted }}>
        {label}
      </div>
      <div className="text-3xl font-bold leading-tight mt-1" style={{ color: QB.text }}>
        {value}
      </div>
      {hint ? (
        <div className="text-[11px] mt-1" style={{ color: QB.muted }}>
          {hint}
        </div>
      ) : null}
    </div>
  );
}
