import type { Metadata } from "next";
import Image from "next/image";
import { BracketsField } from "@/components/motion/BracketsField";
import { GlowButton } from "@/components/GlowButton";
import { RollingText } from "@/components/motion/RollingText";
import { pageMetadata } from "@/lib/seo";
import { siteConfig, formatEventDate } from "@/site.config";

export const metadata: Metadata = pageMetadata({
  title: "Venue & Travel",
  description: "Venue, travel guidance and FAQs for DevFest Madurai 2026.",
  path: "/venue",
});

export const dynamic = "force-static";

const FAQS = [
  [
    "Who can attend DevFest Madurai?",
    "Developers, students, designers, educators, founders, and anyone curious about technology are welcome. You don't need to be an expert to belong.",
  ],
  [
    "Do I need to pay to attend?",
    "Ticket categories, prices, and availability have not been announced yet. The tickets page will carry the confirmed information when registration opens.",
  ],
  [
    "Where can I find the detailed schedule?",
    "Explore the Agenda page for the schedule preview. All preview sessions are illustrative; the confirmed agenda will replace them before the event.",
  ],
  [
    "Can students attend?",
    "Absolutely. The event is designed for curious minds at every stage, including students taking their first steps in technology.",
  ],
  [
    "How do ticket categories work?",
    "Use the ticket selector on /tickets/select to preview a category based on your role. Prices, eligibility, and benefits will be confirmed when registration opens.",
  ],
] as const;

export default function VenuePage() {
  return (
    <>
      <BracketsField mode="settled" />
      <div className="relative z-10 mx-auto max-w-4xl px-4 pb-20 pt-24 sm:px-8 sm:pt-28">
        <p className="text-xs font-semibold uppercase tracking-widest text-yellow">Rooted in Madurai</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-paper sm:text-5xl">
          An ancient city. A new possibility.
        </h1>
        <p className="mt-3 text-base text-paper/70 sm:text-lg">
          Come for the technology. Stay for the warmth, the stories, and the unmistakable spirit of Madurai.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="relative h-56 overflow-hidden rounded-3xl border border-paper/15 sm:h-64">
            <Image
              src="/art/waterfront.webp"
              alt="Meenakshi Amman Temple and Teppakulam skyline in Madurai"
              fill
              sizes="(min-width: 640px) 28rem, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-yellow">Temple City Skyline</p>
              <p className="text-sm font-medium text-paper">Meenakshi Amman Temple &amp; Teppakulam</p>
            </div>
          </div>
          <div className="relative h-56 overflow-hidden rounded-3xl border border-paper/15 sm:h-64">
            <Image
              src="/art/corridor.webp"
              alt="Sculpted stone mandapam pillars in Madurai"
              fill
              sizes="(min-width: 640px) 28rem, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue">Architectural Heritage</p>
              <p className="text-sm font-medium text-paper">Timeless Craft &amp; Modern Innovation</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-paper/15 bg-ink/85 p-6 backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue">Location</p>
            <h2 className="mt-2 text-2xl font-bold text-paper">{siteConfig.venue.line1}</h2>
            <p className="mt-1 text-sm text-paper/70">{siteConfig.venue.line2}</p>
            <p className="mt-4 text-xs text-paper/55">
              Official venue hall and address details will be published here once confirmed by {siteConfig.chapter}.
            </p>
            <div className="mt-6">
              <GlowButton href={siteConfig.venue.mapUrl}>
                <RollingText>Open Madurai on Google Maps →</RollingText>
              </GlowButton>
            </div>
          </div>

          <div className="rounded-3xl border border-paper/15 bg-ink/85 p-6 backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-widest text-green">Date & Travel</p>
            <h2 className="mt-2 text-2xl font-bold text-paper">{formatEventDate(siteConfig.date)}</h2>
            <p className="mt-1 text-sm text-paper/70">Plan your journey to Madurai, Tamil Nadu</p>
            <ul className="mt-4 space-y-2 text-xs text-paper/70">
              <li>• Rail: Madurai Junction (MDU) connects directly across Tamil Nadu and India.</li>
              <li>• Air: Madurai Airport (IXM) is a short drive from the city centre.</li>
              <li>• Bus & Road: Periyar, Mattuthavani (MGR) and Arapalayam bus terminals serve all major routes.</li>
            </ul>
          </div>
        </div>

        <section className="mt-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-red">A little clarity</p>
          <h2 className="mt-2 text-2xl font-bold text-paper sm:text-3xl">Good questions. Honest answers.</h2>
          <div className="mt-6 space-y-4">
            {FAQS.map(([q, a]) => (
              <details
                key={q}
                className="group rounded-2xl border border-paper/15 bg-ink/85 p-5 backdrop-blur-md"
              >
                <summary className="cursor-pointer list-none font-semibold text-paper">
                  {q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-paper/70">{a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
