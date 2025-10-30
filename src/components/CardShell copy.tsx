"use client";
import React from "react";
import { QB } from "@/lib/data";
import { ChevronDown } from "lucide-react";

export default function CardShell(
  { title, subtitle, children, overflow }:
  { title: string; subtitle?: string; children: React.ReactNode; overflow?: boolean }
){
  return (
    <div className="rounded-lg shadow-sm" style={{ background: QB.card, border: `1px solid ${QB.border}` }}>
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div>
          <div className="text-[13px]" style={{ color: QB.muted }}>{subtitle ?? " "}</div>
          <div className="text-[15px] font-medium" style={{ color: QB.text }}>{title}</div>
        </div>
        <div className="opacity-60"><ChevronDown size={16}/></div>
      </div>
      <div className={`px-4 pb-4 ${overflow ? "" : "overflow-hidden"}`}>{children}</div>
    </div>
  );
}
