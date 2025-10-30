// src/components/CardShell.tsx
"use client";
import { QB } from "@/lib/data";

export default function CardShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card-surface p-4 md:p-5" style={{ borderColor: QB.border }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-[15px] font-semibold" style={{ color: QB.text }}>
            {title}
          </h3>
          {subtitle ? (
            <div className="text-xs mt-1" style={{ color: QB.muted }}>
              {subtitle}
            </div>
          ) : null}
        </div>
        <button
          className="h-8 w-8 grid place-items-center rounded-full"
          style={{ color: QB.muted }}
          aria-label="Opciones"
        >
          •••
        </button>
      </div>

      {children}
    </section>
  );
}
