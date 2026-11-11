import type { Metadata } from "next";
import { BracketsField } from "@/components/motion/BracketsField";
import { ContributionForm } from "@/components/ContributionForm";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Volunteer",
  description: "Join the volunteer crew behind DevFest Madurai 2026.",
  path: "/volunteer",
});

export const dynamic = "force-static";

export default function VolunteerPage() {
  return (
    <>
      <BracketsField mode="settled" />
      <ContributionForm kind="volunteer" />
    </>
  );
}
