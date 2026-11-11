import type { Metadata } from "next";
import { BracketsField } from "@/components/motion/BracketsField";
import { ContributionForm } from "@/components/ContributionForm";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Call for Proposals (CFP)",
  description: "Share what you know — prepare your talk or workshop proposal for DevFest Madurai 2026.",
  path: "/cfp",
});

export const dynamic = "force-static";

export default function CFPPage() {
  return (
    <>
      <BracketsField mode="settled" />
      <ContributionForm kind="cfp" />
    </>
  );
}
