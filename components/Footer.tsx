import Link from "next/link";
import { siteConfig, uiCopy } from "@/site.config";
import { navRoutes } from "@/lib/routes";
import { LiteToggle } from "@/components/motion/LiteToggle";
import { FooterLogo } from "@/components/FooterLogo";

// Annotated rather than inferred: `siteConfig` is `as const`, so each `href`
// is a string *literal* type, and the array would otherwise not match the
// `{ label: string; href: string }[]` FooterLogo asks for. This also replaced
// a `.filter(Boolean)` on `href` that could never drop anything — every URL
// here is a non-empty literal — and whose type predicate widened the literal
// back to `string`, which is what broke the build.
const socialLinks: { label: string; href: string }[] = [
  { label: uiCopy.socialLabels.x, href: siteConfig.social.x },
  { label: uiCopy.socialLabels.instagram, href: siteConfig.social.instagram },
  { label: uiCopy.socialLabels.linkedin, href: siteConfig.social.linkedin },
  { label: uiCopy.socialLabels.youtube, href: siteConfig.social.youtube },
  { label: uiCopy.socialLabels.github, href: siteConfig.social.github },
  { label: uiCopy.socialLabels.discord, href: siteConfig.social.discord },
];

export function Footer() {
  return (
    // relative z-10: lift the footer above the fixed BracketsField backdrop
    // (z-0), which lives inside <main> and would otherwise paint its opaque
    // layer over the footer's non-positioned card, wordmark and pill.
    <footer className="relative z-10 mt-auto border-t border-paper/10 bg-ink px-4 pb-16 pt-14 sm:px-8 sm:pb-20">
      <FooterLogo social={socialLinks} />

      {/* Utility + legal strip. Kept below the brand lock-up so the Google
          disclaimer, Code of Conduct and lite toggle stay reachable without
          crowding the mark. */}
      <div className="mx-auto mt-10 flex w-full max-w-5xl flex-col items-center gap-5 text-center text-sm text-paper/70">
        <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-paper/80">
          {navRoutes.map((route) => (
            <Link key={route.href} href={route.href} className="underline-offset-4 hover:text-paper hover:underline">
              {route.label}
            </Link>
          ))}
          <Link href="/cfp" className="underline-offset-4 hover:text-paper hover:underline">
            Submit CFP
          </Link>
          <Link href="/tracks" className="underline-offset-4 hover:text-paper hover:underline">
            Tracks
          </Link>
          <Link href="/venue" className="underline-offset-4 hover:text-paper hover:underline">
            Venue
          </Link>
          <Link href="/dfs-2026-selected" className="underline-offset-4 hover:text-paper hover:underline">
            DFS 2026
          </Link>
        </nav>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <a
            href={siteConfig.codeOfConduct.url}
            target="_blank"
            rel="noreferrer"
            className="underline-offset-4 hover:text-paper hover:underline"
          >
            {uiCopy.footer.codeOfConductLabel}
          </a>
          {/* Full absolute URL, not a Next <Link> or a `/privacy` href: the page
              is served by a Cloudflare URL rewrite and doesn't exist as an app
              route (a client-side nav to it would 404). */}
          <a
            href={siteConfig.privacyPolicyUrl}
            className="underline-offset-4 hover:text-paper hover:underline"
          >
            {uiCopy.footer.privacyPolicyLabel}
          </a>
          <a href={`mailto:${siteConfig.contact.email}`} className="underline-offset-4 hover:text-paper hover:underline">
            {siteConfig.contact.email}
          </a>
          <LiteToggle />
        </div>
        {/* /50 is as muted as this may go: on the dark page it measures
            4.76:1, and 12px legal text needs 4.5:1. Anything fainter fails. */}
        <p className="max-w-2xl text-xs text-paper/50">{siteConfig.brandDisclaimer}</p>
        <p className="text-xs text-paper/50">
          &copy; 2026 {siteConfig.chapter} · {siteConfig.name}
        </p>
      </div>
    </footer>
  );
}
