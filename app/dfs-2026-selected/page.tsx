import type { Metadata } from "next";
import { BracketsField } from "@/components/motion/BracketsField";
import { SelectedView } from "@/components/dfs/selected-view";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Meet the Selected Five · DFS 2026",
  description: "Five participants. One community. A new chapter begins at DevFest Madurai 2026.",
  path: "/dfs-2026-selected",
  index: false,
});

export const dynamic = "force-dynamic";

export default function SelectedPage() {
  return (
    <>
      <BracketsField mode="settled" />
      <SelectedView />
    </>
  );
}
