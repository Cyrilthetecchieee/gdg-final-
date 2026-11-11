"use client";

import { ParticipantCard } from "./participant-card";
import type { DFSParticipant } from "@/lib/dfs-storage";

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  participants: DFSParticipant[];
}

export function PreviewModal({ open, onClose, participants }: PreviewModalProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Announcement Preview"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
    >
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-paper/20 bg-ink p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-paper/10 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue">Live Layout Preview</p>
            <h2 className="mt-1 text-xl font-bold text-paper">Meet the Selected Five · DFS 2026</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-paper/20 px-4 py-1.5 text-xs font-semibold text-paper/80 hover:border-paper/40 hover:text-paper"
          >
            Close Preview
          </button>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5].map((pos) => {
            const p = participants.find((item) => item.position === pos);
            return <ParticipantCard key={pos} position={pos} participant={p} isPending={!p?.name?.trim()} />;
          })}
        </div>
      </div>
    </div>
  );
}
