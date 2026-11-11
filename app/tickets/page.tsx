import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = pageMetadata({
  title: "Register",
  description: `Register for ${siteConfig.name} on 12 December 2026 in Madurai.`,
  path: "/tickets",
});
export const dynamic = "force-static";

export default function TicketsPage() {
  return (
    <main className="min-h-screen bg-ink px-4 pb-20 pt-28 text-paper sm:px-8 sm:pt-36">
      <section className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue">DevFest Madurai 2026</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">Register for DevFest.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/75 sm:text-xl">
          Join a full day of talks, hands-on learning, developer community and networking in Madurai.
        </p>

        <dl className="mt-10 grid gap-4 border-y border-paper/15 py-6 text-base sm:grid-cols-2 sm:text-lg">
          <div>
            <dt className="text-sm uppercase tracking-wide text-paper/50">Date</dt>
            <dd className="mt-1 font-medium">12 December 2026</dd>
          </div>
          <div>
            <dt className="text-sm uppercase tracking-wide text-paper/50">Venue</dt>
            <dd className="mt-1 font-medium">To be announced · Madurai</dd>
          </div>
        </dl>

        <a
          href={siteConfig.ticketing.href}
          target="_blank"
          rel="noreferrer"
          className="mt-10 inline-flex items-center justify-center rounded-full bg-blue px-7 py-3.5 text-base font-semibold text-ink transition-transform hover:scale-[1.02]"
        >
          Register now <span aria-hidden="true" className="ml-2">↗</span>
        </a>
        <p className="mt-4 text-sm text-paper/55">
          Registration opens on the official Open Madurai form. You will be redirected there securely.
        </p>
      </section>
    </main>
  );
}
