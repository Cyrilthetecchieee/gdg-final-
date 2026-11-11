/**
 * Every page on the site, in one place.
 *
 * The header filters this down via `inNav` instead of maintaining a separate
 * hand-written list, and the 404 rescue grid reads the same list.
 */
export type SiteRoute = {
  href: string;
  label: string;
  /** Shown on the 404's rescue grid. One line, says what is actually there. */
  description: string;
  /** Whether the header links to it. The header is curated; this list is not. */
  inNav: boolean;
  /** Account-gated or admin pages: kept in this list so the 404 typo helper
   *  still resolves them, but excluded from the sitemap and disallowed in robots. */
  noIndex?: boolean;
};

/**
 * Online by default for DevFest Madurai so /agenda, /speakers and /my-agenda
 * are available immediately; set AGENDA_READY=false to hide them.
 */
export const AGENDA_READY = process.env.AGENDA_READY !== "false";

export const siteRoutes: SiteRoute[] = [
  { href: "/", label: "Home", description: "Tracks, schedule preview and the lineup.", inNav: true },
  ...(AGENDA_READY
    ? [
        { href: "/agenda", label: "Agenda", description: "The full schedule preview for the day.", inNav: true },
        { href: "/speakers", label: "Speakers", description: "The lineup, and how to get on it.", inNav: true },
        {
          href: "/my-agenda",
          label: "My agenda",
          description: "Sessions you've saved. Sign in with Google.",
          inNav: false,
          noIndex: true,
        },
      ]
    : []),
  { href: "/tickets", label: "Tickets", description: "Pick an event and preview ticket categories.", inNav: true },
  { href: "/memories", label: "Memories", description: "Community photo archive and 3D hallway.", inNav: true },
  { href: "/tracks", label: "Tracks", description: "AI & ML, Web & Cloud, Android, Open Source, Design & Career tracks.", inNav: false },
  { href: "/cfp", label: "Submit CFP", description: "Call for proposals — apply to speak at DevFest Madurai.", inNav: false },
  { href: "/venue", label: "Venue", description: "Madurai venue and travel details.", inNav: false },
  { href: "/contact", label: "Contact", description: "Reach the chapter directly.", inNav: false },
];

export const navRoutes: SiteRoute[] = siteRoutes.filter((r) => r.inNav);

/**
 * Public, indexable pages that are deliberately NOT in `siteRoutes`: they're reached
 * from a specific link or a URL we hand out.
 */
export const unlistedPublicRoutes: readonly Pick<SiteRoute, "href" | "label" | "description">[] = [
  { href: "/tickets/select", label: "Get tickets", description: "Ticket category picker and preview." },
  { href: "/partner", label: "Partner", description: "Community partnership with GDG Madurai." },
  {
    href: "/creators",
    label: "Creators",
    description: "An invitation for content creators to attend and share their view on AI and tech.",
  },
  {
    href: "/dfs-2026-selected",
    label: "DFS 2026 Selected",
    description: "DevFest Madurai 2026 selected participants announcement.",
  },
];

export const retiredRoutes: Record<string, { reason: string; goto: string }> = {
  "/schedule": {
    reason: "The schedule lives on the Agenda page.",
    goto: "/agenda",
  },
};
