"use client";

import { useCallback, useEffect, useState } from "react";
import { ParticipantCard } from "./participant-card";
import type { DFSParticipant } from "@/lib/dfs-storage";

interface PublicDFSResponse {
  isPublished: boolean;
  publishedAt: string | null;
  participants: DFSParticipant[];
  version: number;
}

export function SelectedView() {
  const [data, setData] = useState<PublicDFSResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchAnnouncement = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dfs-2026/public", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Could not load the announcement at this time.");
      }
      const json = (await res.json()) as PublicDFSResponse;
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void fetch("/api/dfs-2026/public", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Could not load the announcement at this time.");
        }
        return (await res.json()) as PublicDFSResponse;
      })
      .then((json) => {
        if (!active) return;
        setData(json);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: "DFS 2026 — Meet the Selected Five",
      text: "Explore the officially selected participants for DFS 2026 at DevFest Madurai!",
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    if (typeof navigator !== "undefined" && navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled share
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const isPublished = Boolean(data?.isPublished && data.participants.length === 5);

  return (
    <div className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-8 sm:pt-28">
      <section className="mx-auto max-w-3xl text-center">
        <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-paper/15 bg-paper/5 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-paper/80">
            <span className="h-2 w-2 rounded-full bg-blue" />
            <span className="h-2 w-2 rounded-full bg-red" />
            <span className="h-2 w-2 rounded-full bg-yellow" />
            <span className="h-2 w-2 rounded-full bg-green" />
            <span className="ml-1">DEVFEST MADURAI 2026</span>
          </span>

          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-semibold uppercase tracking-wider ${
              isPublished
                ? "border-green/40 bg-green/15 text-green"
                : "border-yellow/40 bg-yellow/15 text-yellow"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${isPublished ? "bg-green" : "bg-yellow"}`} />
            {isPublished ? "OFFICIAL SELECTION" : "ANNOUNCEMENT PENDING"}
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-paper sm:text-5xl">Meet the Selected Five</h1>
        <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-blue">DFS 2026</p>
        <p className="mt-4 text-base text-paper/70 sm:text-lg">
          Five participants. One community. A new chapter begins in the historic heart of Madurai.
        </p>
      </section>

      {loading && (
        <div className="my-16 text-center text-paper/70">
          <p className="text-sm uppercase tracking-widest">Retrieving official DFS 2026 selection…</p>
        </div>
      )}

      {!loading && error && (
        <div className="mx-auto my-12 max-w-md rounded-2xl border border-red/40 bg-ink/90 p-8 text-center">
          <h2 className="text-lg font-semibold text-paper">Unable to Load Announcement</h2>
          <p className="mt-2 text-sm text-paper/70">{error}</p>
          <button
            type="button"
            onClick={() => void fetchAnnouncement()}
            className="mt-5 rounded-full bg-blue px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="mt-12 space-y-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5].map((pos) => {
              const participant = data?.participants.find((p) => p.position === pos);
              return (
                <ParticipantCard
                  key={pos}
                  position={pos}
                  participant={participant}
                  isPending={!isPublished}
                />
              );
            })}
          </div>

          <div className="mx-auto max-w-2xl rounded-2xl border border-paper/15 bg-ink/85 p-8 text-center backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-widest text-yellow">
              Where Heritage Meets Innovation
            </p>
            <h2 className="mt-2 text-xl font-bold text-paper sm:text-2xl">Celebrating Innovation in Madurai</h2>
            <p className="mt-3 text-sm leading-relaxed text-paper/70 sm:text-base">
              The selected five represent the forefront of community builders, technical innovators, and future leaders.
              Together with Google Developer Groups Madurai, we celebrate their dedication to empowering Tamil
              Nadu&apos;s technology ecosystem.
            </p>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => void handleShare()}
                aria-label="Share announcement"
                className="rounded-full border border-paper/20 bg-paper/10 px-6 py-2.5 text-sm font-semibold text-paper transition-colors hover:border-paper/40 hover:bg-paper/15"
              >
                {copied ? "Link Copied to Clipboard!" : "Share Announcement"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
