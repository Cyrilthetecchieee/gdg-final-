import type { Metadata } from "next";
import { BracketsField } from "@/components/motion/BracketsField";
import { ManageDashboard } from "@/components/dfs/manage-dashboard";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "DFS 2026 — Participant Management",
  description: "Manage the selected participants announcement for DFS 2026.",
  path: "/dfs-2026-manage",
  index: false,
});

export const dynamic = "force-dynamic";

export default function ManagePage() {
  return (
    <>
      <BracketsField mode="settled" />
      <ManageDashboard />
    </>
  );
}
