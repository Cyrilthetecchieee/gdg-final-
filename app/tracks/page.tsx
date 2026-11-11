import type { Metadata } from "next";
import Link from "next/link";
import { BracketsField } from "@/components/motion/BracketsField";
import { GlowButton } from "@/components/GlowButton";
import { RollingText } from "@/components/motion/RollingText";
import { getAgenda } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { trackColor } from "@/lib/track-color";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = pageMetadata({
  title: "Tracks",
  description:
    "Explore the six tracks at DevFest Madurai 2026: AI & ML, Web & Cloud, Android, Open Source, Design & Product, and Career & Beyond.",
  path: "/tracks",
});

export const revalidate = 300;

export default async function TracksPage() {
  const agenda = await getAgenda();

  return (
    <>
      <BracketsField mode="settled" />
      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-8 sm:pt-28">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue">Follow your curiosity</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-paper sm:text-5xl">
            Big ideas. Every kind of builder.
          </h1>
          <p className="mt-3 text-base text-paper/70 sm:text-lg">
            Six paths into what&apos;s next at {siteConfig.name}. Find the track that sparks something.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.tracks.map((track, idx) => {
            const palette = trackColor(track.slug);
            const sessions = agenda.filter((s) => s.track === track.slug);
            return (
              <article
                key={track.slug}
                className={`flex flex-col justify-between rounded-3xl border ${palette.border} bg-ink/85 p-6 backdrop-blur-md`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest ${palette.text}`}>
                      <span className={`h-2 w-2 rounded-full ${palette.bg}`} />
                      Track 0{idx + 1}
                    </span>
                    <span className="text-xs text-paper/45">{sessions.length} preview session(s)</span>
                  </div>

                  <h2 className="mt-4 text-2xl font-bold text-paper">{track.name}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-paper/70">{track.description}</p>

                  {sessions.length > 0 && (
                    <div className="mt-5 space-y-2 border-t border-paper/10 pt-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-paper/45">
                        Preview sessions
                      </p>
                      {sessions.map((s) => (
                        <div key={s.id} className="rounded-xl border border-paper/10 bg-paper/5 px-3 py-2">
                          <p className="text-xs font-semibold text-paper">{s.title}</p>
                          <p className="mt-0.5 text-[11px] text-paper/55">{s.hall}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-paper/10 pt-4 text-xs">
                  <Link href="/agenda" className="font-semibold text-paper/80 hover:text-paper">
                    View full agenda →
                  </Link>
                  <Link href="/cfp" className={`font-semibold ${palette.text} hover:underline`}>
                    Submit CFP →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
          <GlowButton href="/agenda">
            <RollingText>Explore Agenda →</RollingText>
          </GlowButton>
          <GlowButton href="/cfp">
            <RollingText>Submit a Talk Proposal →</RollingText>
          </GlowButton>
        </div>
      </div>
    </>
  );
}
