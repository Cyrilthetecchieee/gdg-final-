"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { LoginForm } from "./login-form";
import { PreviewModal } from "./preview-modal";
import type { DFSParticipant, DFSPublished, DFSStoreData } from "@/lib/dfs-storage";

export function ManageDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [participants, setParticipants] = useState<DFSParticipant[]>([
    { id: "dfs-pos-1", position: 1, name: "", role: "", institution: "" },
    { id: "dfs-pos-2", position: 2, name: "", role: "", institution: "" },
    { id: "dfs-pos-3", position: 3, name: "", role: "", institution: "" },
    { id: "dfs-pos-4", position: 4, name: "", role: "", institution: "" },
    { id: "dfs-pos-5", position: 5, name: "", role: "", institution: "" },
  ]);
  const [published, setPublished] = useState<DFSPublished>({
    isPublished: false,
    publishedAt: null,
    participants: [],
    version: 0,
  });
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmPublishOpen, setConfirmPublishOpen] = useState(false);
  const [confirmUnpublishOpen, setConfirmUnpublishOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dfs-2026/manage", { cache: "no-store" });
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      const data = (await res.json()) as DFSStoreData;
      if (data?.draft?.participants) {
        setParticipants(data.draft.participants);
        setLastSaved(data.draft.updatedAt);
      }
      if (data?.published) {
        setPublished(data.published);
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to load records.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/dfs-2026/auth", { cache: "no-store" });
      const data = (await res.json()) as { authenticated?: boolean };
      const authed = Boolean(data.authenticated);
      setIsAuthenticated(authed);
      if (authed) {
        await loadData();
      } else {
        setLoading(false);
      }
    } catch {
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, [loadData]);

  useEffect(() => {
    let active = true;
    void fetch("/api/dfs-2026/auth", { cache: "no-store" })
      .then((res) => res.json() as Promise<{ authenticated?: boolean }>)
      .then(async (data) => {
        if (!active) return;
        const authed = Boolean(data.authenticated);
        setIsAuthenticated(authed);
        if (authed) {
          await loadData();
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        if (!active) return;
        setIsAuthenticated(false);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [loadData]);

  const handleLogout = async () => {
    try {
      await fetch("/api/dfs-2026/auth", { method: "DELETE" });
    } finally {
      setIsAuthenticated(false);
    }
  };

  const updateField = (index: number, field: keyof DFSParticipant, value: string) => {
    setParticipants((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
    if (message) setMessage(null);
  };

  const movePosition = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= participants.length) return;

    setParticipants((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy.map((p, idx) => ({ ...p, position: idx + 1 }));
    });
  };

  const clearPosition = (index: number) => {
    setParticipants((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], name: "", role: "", institution: "" };
      return copy;
    });
  };

  const validation = useMemo(() => {
    const errors: Record<number, string[]> = {};
    const seen = new Map<string, number>();
    let filledCount = 0;

    participants.forEach((p, idx) => {
      errors[idx] = [];
      const trimmed = p.name.trim();
      if (trimmed) {
        filledCount++;
        const lower = trimmed.toLowerCase();
        if (seen.has(lower)) {
          const prevIdx = seen.get(lower)!;
          errors[idx].push(`Duplicate name with Position 0${prevIdx + 1}`);
          errors[prevIdx].push(`Duplicate name with Position 0${idx + 1}`);
        } else {
          seen.set(lower, idx);
        }
      }
    });

    const hasErrors = Object.values(errors).some((list) => list.length > 0);
    return {
      errors,
      filledCount,
      canPublish: filledCount === 5 && !hasErrors,
    };
  }, [participants]);

  const handleSaveDraft = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/dfs-2026/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save-draft", participants }),
      });
      const data = (await res.json()) as { error?: string; message?: string; draft?: { updatedAt: string | null } };
      if (!res.ok) throw new Error(data.error || "Failed to save draft.");
      setLastSaved(data.draft?.updatedAt ?? new Date().toISOString());
      setMessage({ type: "success", text: data.message || "Draft saved." });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to save draft." });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    setMessage(null);
    try {
      const res = await fetch("/api/dfs-2026/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish", participants }),
      });
      const data = (await res.json()) as { error?: string; message?: string; published?: DFSPublished };
      if (!res.ok) throw new Error(data.error || "Failed to publish.");
      if (data.published) setPublished(data.published);
      setConfirmPublishOpen(false);
      setMessage({ type: "success", text: data.message || "Official selection published!" });
    } catch (err) {
      setConfirmPublishOpen(false);
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Publish failed." });
    } finally {
      setPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    setUnpublishing(true);
    setMessage(null);
    try {
      const res = await fetch("/api/dfs-2026/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unpublish" }),
      });
      const data = (await res.json()) as { error?: string; message?: string; published?: DFSPublished };
      if (!res.ok) throw new Error(data.error || "Failed to unpublish.");
      if (data.published) setPublished(data.published);
      setConfirmUnpublishOpen(false);
      setMessage({ type: "success", text: data.message || "Announcement unpublished." });
    } catch (err) {
      setConfirmUnpublishOpen(false);
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Unpublish failed." });
    } finally {
      setUnpublishing(false);
    }
  };

  if (isAuthenticated === null || loading) {
    return (
      <div className="relative z-10 mx-auto max-w-4xl px-4 pb-20 pt-28 text-center text-paper/70">
        Loading DFS 2026 Management Console…
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="relative z-10 mx-auto max-w-4xl px-4 pb-20 pt-28">
        <LoginForm onSuccess={() => void checkAuth()} />
      </div>
    );
  }

  return (
    <div className="relative z-10 mx-auto max-w-5xl px-4 pb-20 pt-24 sm:px-8 sm:pt-28">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-paper/15 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue">GDG Madurai · Organiser Console</p>
          <h1 className="mt-1 text-2xl font-bold text-paper sm:text-3xl">DFS 2026 Participant Management</h1>
          <p className="mt-1 text-xs text-paper/60">
            Status: {published.isPublished ? "Published (Live)" : "Pending (Draft only)"} ·{" "}
            {validation.filledCount}/5 positions filled
            {lastSaved ? ` · Last saved ${new Date(lastSaved).toLocaleTimeString()}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dfs-2026-selected"
            className="rounded-full border border-paper/20 px-4 py-2 text-xs font-semibold text-paper/80 hover:border-paper/40 hover:text-paper"
          >
            View Public Page ↗
          </Link>
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="rounded-full border border-paper/20 px-4 py-2 text-xs font-semibold text-paper/80 hover:border-paper/40 hover:text-paper"
          >
            Preview
          </button>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="rounded-full border border-red/30 px-4 py-2 text-xs font-semibold text-red hover:bg-red/10"
          >
            Sign Out
          </button>
        </div>
      </div>

      {message && (
        <div
          role="status"
          className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-green/40 bg-green/10 text-green"
              : "border-red/40 bg-red/10 text-red"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="mt-8 space-y-5">
        {participants.map((p, idx) => {
          const posErrors = validation.errors[idx] || [];
          return (
            <div
              key={p.id}
              className="rounded-2xl border border-paper/15 bg-ink/85 p-5 backdrop-blur-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
                <span className="text-sm font-bold uppercase tracking-wider text-paper">
                  Position 0{idx + 1}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => movePosition(idx, "up")}
                    disabled={idx === 0}
                    className="rounded-lg border border-paper/15 px-2.5 py-1 text-xs text-paper/70 hover:border-paper/40 disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => movePosition(idx, "down")}
                    disabled={idx === participants.length - 1}
                    className="rounded-lg border border-paper/15 px-2.5 py-1 text-xs text-paper/70 hover:border-paper/40 disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => clearPosition(idx)}
                    className="rounded-lg border border-paper/15 px-2.5 py-1 text-xs text-paper/60 hover:border-red/40 hover:text-red"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs text-paper/60">Full Name *</label>
                  <input
                    type="text"
                    value={p.name}
                    onChange={(e) => updateField(idx, "name", e.target.value)}
                    placeholder="Participant full name"
                    className="mt-1 w-full rounded-xl border border-paper/20 bg-ink px-3.5 py-2.5 text-sm text-paper placeholder:text-paper/35 focus:border-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-paper/60">Role / Track (optional)</label>
                  <input
                    type="text"
                    value={p.role || ""}
                    onChange={(e) => updateField(idx, "role", e.target.value)}
                    placeholder="e.g. AI & ML Finalist"
                    className="mt-1 w-full rounded-xl border border-paper/20 bg-ink px-3.5 py-2.5 text-sm text-paper placeholder:text-paper/35 focus:border-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-paper/60">Institution / Company (optional)</label>
                  <input
                    type="text"
                    value={p.institution || ""}
                    onChange={(e) => updateField(idx, "institution", e.target.value)}
                    placeholder="e.g. TCE Madurai"
                    className="mt-1 w-full rounded-xl border border-paper/20 bg-ink px-3.5 py-2.5 text-sm text-paper placeholder:text-paper/35 focus:border-blue focus:outline-none"
                  />
                </div>
              </div>

              {posErrors.length > 0 && (
                <p className="mt-2 text-xs text-red">{posErrors.join(" · ")}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-paper/15 bg-ink/90 p-5">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void handleSaveDraft()}
            disabled={saving}
            className="rounded-full border border-paper/25 bg-paper/10 px-5 py-2.5 text-sm font-semibold text-paper hover:border-paper/45 disabled:opacity-50"
          >
            {saving ? "Saving Draft…" : "Save Draft"}
          </button>

          <button
            type="button"
            onClick={() => setConfirmPublishOpen(true)}
            disabled={!validation.canPublish || publishing}
            className="rounded-full bg-blue px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {publishing ? "Publishing…" : "Publish Official Selection"}
          </button>
        </div>

        {published.isPublished && (
          <button
            type="button"
            onClick={() => setConfirmUnpublishOpen(true)}
            disabled={unpublishing}
            className="rounded-full border border-red/40 px-5 py-2.5 text-sm font-semibold text-red hover:bg-red/10 disabled:opacity-50"
          >
            Unpublish
          </button>
        )}
      </div>

      <PreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)} participants={participants} />

      {confirmPublishOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-md rounded-3xl border border-paper/20 bg-ink p-8 text-center">
            <h3 className="text-xl font-bold text-paper">Publish Official Announcement?</h3>
            <p className="mt-3 text-sm text-paper/70">
              This will immediately update the live public page at <strong>/dfs-2026-selected</strong> with all 5
              participants.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmPublishOpen(false)}
                className="rounded-full border border-paper/20 px-5 py-2 text-sm text-paper/80"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handlePublish()}
                disabled={publishing}
                className="rounded-full bg-blue px-5 py-2 text-sm font-semibold text-white"
              >
                {publishing ? "Publishing…" : "Confirm & Publish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmUnpublishOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-md rounded-3xl border border-paper/20 bg-ink p-8 text-center">
            <h3 className="text-xl font-bold text-paper">Unpublish Announcement?</h3>
            <p className="mt-3 text-sm text-paper/70">
              The public page will return to the pending state. Your saved draft remains intact.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmUnpublishOpen(false)}
                className="rounded-full border border-paper/20 px-5 py-2 text-sm text-paper/80"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleUnpublish()}
                disabled={unpublishing}
                className="rounded-full bg-red px-5 py-2 text-sm font-semibold text-white"
              >
                {unpublishing ? "Unpublishing…" : "Confirm Unpublish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
