"use client";

import type { DFSParticipant } from "@/lib/dfs-storage";

interface ParticipantCardProps {
  participant?: Partial<DFSParticipant>;
  position: number;
  isPending?: boolean;
}

const POSITION_METADATA = [
  { label: "01", name: "Position 01", accentBg: "bg-blue", accentText: "text-blue", border: "border-blue/35" },
  { label: "02", name: "Position 02", accentBg: "bg-red", accentText: "text-red", border: "border-red/35" },
  { label: "03", name: "Position 03", accentBg: "bg-yellow", accentText: "text-yellow", border: "border-yellow/35" },
  { label: "04", name: "Position 04", accentBg: "bg-green", accentText: "text-green", border: "border-green/35" },
  { label: "05", name: "Position 05", accentBg: "bg-purple", accentText: "text-purple", border: "border-purple/35" },
] as const;

export function ParticipantCard({ participant, position, isPending = false }: ParticipantCardProps) {
  const meta = POSITION_METADATA[position - 1] || POSITION_METADATA[0];
  const hasName = Boolean(participant?.name?.trim());

  if (isPending || !hasName) {
    return (
      <div
        data-testid={`dfs-card-pending-${position}`}
        className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border ${meta.border} bg-ink/85 p-6 backdrop-blur-md transition-transform hover:-translate-y-0.5`}
      >
        <div className={`absolute inset-x-0 top-0 h-1 ${meta.accentBg}`} />

        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-paper/15 bg-paper/5 px-3 py-1 text-xs font-semibold tracking-wider text-paper/80">
            <span className={`h-2 w-2 rounded-full ${meta.accentBg}`} />
            POSITION {meta.label}
          </span>
          <span className="rounded-full border border-paper/10 px-2.5 py-0.5 text-[11px] uppercase tracking-widest text-paper/50">
            Pending
          </span>
        </div>

        <div className="my-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-paper/15 bg-paper/5 text-lg font-bold text-paper/70">
            {meta.label}
          </div>
          <h3 className="text-lg font-semibold text-paper">Selection Unfolding</h3>
          <p className="mt-1 text-xs text-paper/60">
            Official participant details for Position {meta.label} will appear here once published.
          </p>
        </div>

        <div className="border-t border-paper/10 pt-3 text-center text-[11px] uppercase tracking-widest text-paper/45">
          DFS 2026 · GDG Madurai
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid={`dfs-card-selected-${position}`}
      className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border ${meta.border} bg-ink/90 p-6 backdrop-blur-md transition-transform hover:-translate-y-0.5`}
    >
      <div className={`absolute inset-x-0 top-0 h-1.5 ${meta.accentBg}`} />

      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-paper/15 bg-paper/5 px-3 py-1 text-xs font-semibold tracking-wider text-paper">
          <span className={`h-2 w-2 rounded-full ${meta.accentBg}`} />
          POSITION {meta.label}
        </span>
        <span className={`rounded-full border border-green/30 bg-green/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-green`}>
          Selected
        </span>
      </div>

      <div className="my-6">
        <h3 className="text-xl font-bold tracking-tight text-paper sm:text-2xl">{participant?.name}</h3>
        {participant?.role && <p className="mt-1.5 text-sm font-medium text-paper/80">{participant.role}</p>}
        {participant?.institution && <p className="mt-1 text-xs text-paper/60">{participant.institution}</p>}
      </div>

      <div className="flex items-center justify-between border-t border-paper/10 pt-3 text-[11px] uppercase tracking-widest text-paper/50">
        <span>DFS 2026 Official</span>
        <span className={meta.accentText}>#{meta.label}</span>
      </div>
    </div>
  );
}
