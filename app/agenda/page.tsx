import { notFound } from "next/navigation";
import { getAgenda } from "@/lib/content";
import { siteConfig } from "@/site.config";
import { SimpleAgenda } from "@/components/SimpleAgenda";
import { AGENDA_READY } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Agenda",
  description: `Full session schedule for ${siteConfig.name} at ${siteConfig.venue.name} — talks, workshops and lounges across every track.`,
  path: "/agenda",
});
export const revalidate = 300;

export default async function AgendaPage() {
  if (!AGENDA_READY) notFound();
  const agenda = await getAgenda();

  return (
    <div className="min-h-screen bg-ink px-4 pb-16 pt-24 sm:px-8 sm:pt-28">
      <SimpleAgenda sessions={agenda} />
    </div>
  );
}
