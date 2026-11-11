import { EVENT_TIME_ZONE } from "@/lib/format";

export type Track = {
  slug: string;
  name: string;
  description: string;
};

export type Floor = {
  slug: string;
  name: string;
  /** Track slugs on this floor, in display order. */
  tracks: string[];
};

export type TicketProfile = { key: string; label: string };

export type Ticket = {
  /** Stable slug — used as the React key and nowhere user-facing. */
  id: string;
  /** Ticket tier name. */
  name: string;
  /** `profiles[].key` — "I'm a ___" on /tickets/select picks this. */
  category: "professional" | "student";
  /** `all` for the general ticket, `women-diverse` for the "for women & diverse
   *  groups" ticket. Derived from the "and I identify as ___" pick. */
  audience: "all" | "women-diverse";
  price: number;
  currency: string;
  /** Sale window, ISO 8601 with the IST offset. This is the single source of
   *  truth for whether the ticket shows in the /tickets/select picker: a
   *  ticket is offered exactly when "now" falls within [opens, closes] (see
   *  `isTicketOnSale`). Also shown on the card and in the Event JSON-LD. Keep
   *  the windows for a given (category, audience) pair non-overlapping; if two
   *  do overlap, the one earlier in `tickets` wins. */
  opens: string;
  closes: string;
  /** Flip to `true` when a ticket sells out mid-window: the picker hides it and
   *  moves on to the next tier for that (category, audience) pair — the soonest
   *  one still to open, shown as "Coming soon", or the "not on sale" card if
   *  there's nothing after it. Omit or set `false` while on sale. */
  soldOut?: boolean;
  /** The checkout widget URL "Buy ticket" opens in-page (see TicketCard's
   *  checkout overlay). */
  href: string;
};

export type SubEvent = {
  slug: string;
  title: string;
  /** Plain `YYYY-MM-DD`, same convention as `date` above — run through
   *  `shortEventDate()` at render time (see TicketsList.tsx), not
   *  pre-formatted here. */
  date: string;
  description: string;
  ctaLabel: string;
  /** Omitted while the event has nowhere to send you yet (renders as a
   *  disabled-looking button — see TicketsList's EventCta) — set once a real
   *  RSVP/registration link exists. */
  href?: string;
  /** A `public/`-relative path (e.g. "/banner/blue.webp"), goes through
   *  next/image like every other image on the site. */
  image?: string;
  /** The card's background — one of the four brand pastels, or the neutral
   *  the flagship card uses. */
  color?: "bg-yellow-pastel" | "bg-blue-pastel" | "bg-red-pastel" | "bg-green-pastel" | "bg-neutral-200" | "bg-purple-pastel";
};

export const siteConfig = {
  name: "DevFest Madurai 2026",
  shortName: "DevFest Madurai",
  chapter: "GDG Madurai",
  /** The city, on its own. Feeds SEO (addressLocality), the live board, and
   *  copy that needs the place rather than the event name. */
  city: "Madurai",
  /** The city in Tamil. Shown on the back of the hero's 3D city line after a
   *  click-flip. The 3D glyph is PRE-SHAPED into
   *  public/fonts/noto-sans-tamil-city.typeface.json, so changing this string
   *  alone changes only the screen-reader text: re-run
   *  `node scripts/build-city-brand-assets.mjs` after editing it there too. */
  cityTamil: "மதுரை",
  tagline: "Where heritage meets innovation.",

  // Canonical origin, no trailing slash — feeds metadataBase/OpenGraph in
  // app/layout.tsx, app/robots.ts, app/sitemap.ts, and the Event JSON-LD on
  // the homepage. Single source of truth so a domain change is a one-line edit.
  // PLACEHOLDER: the current DevFest Madurai preview origin. Swap in the
  // production domain before launch.
  url: "https://devfest-madurai-2026.sivakumarsarvesh3.chatgpt.site",

  analytics: {
    // GA4 web stream measurement ID. Public by design (ships in every page's
    // gtag snippet). EMPTY = Google Analytics is not loaded at all (see
    // app/layout.tsx).
    measurementId: "",
    // PostHog project token (phc_…). EMPTY = PostHog is not initialised (see
    // instrumentation-client.ts); NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN overrides.
    posthogKey: "",
    posthogHost: "https://us.i.posthog.com",
    // Numeric project id — only needed by @posthog/nextjs-config sourcemap
    // uploads (with a personal API key). Safe to commit; not a secret.
    posthogProjectId: "",
  },

  /*
   * THE event date: 12 December 2026 (One-day event).
   */
  date: "2026-12-12" as string | null,

  venue: {
    name: "To be announced",
    confirmed: false,
    line1: "Venue to be announced",
    line2: "Madurai, Tamil Nadu, India",
    mapUrl: "https://maps.google.com/?q=Madurai,+Tamil+Nadu",
  },

  /** Shown where the site states attendance. PLACEHOLDER until GDG Madurai
   *  publishes a confirmed figure. */
  capacityClaim: "Developers, students & creators",

  ticketing: {
    href: "https://openmadurai.org/forms/devfest-madurai-2026-registration-form",
    availableLabel: "Register now →",
  },

  // The /tickets/select page's ticket picker. "I'm a ___" chooses the
  // `category`; "and I identify as ___" maps to `audience` (Female / Non
  // binary → the "women & diverse groups" ticket, Male / Prefer not to say →
  // the general one). All tiers below are marked as upcoming placeholders
  // (`opens` in the future) so the 3D card fan animates and displays "Coming
  // soon" until GDG Madurai opens registration.
  ticketSelector: {
    taxNote: "Ticket categories, prices and availability will be confirmed when registration opens",
    addOnsNote: "Preview tiers — not yet on sale",
    profiles: [
      { key: "professional", label: "Working Professional" },
      { key: "student", label: "Student" },
    ] satisfies TicketProfile[],
    identities: ["Female", "Male", "Non binary", "Prefer not to say"],
    /** What each ticket in a category gets you — shown on the card. */
    perks: {
      professional: ["Access to all talks", "Hands-on workshops", "Community networking"],
      student: ["Access to all talks", "Hands-on workshops", "Community networking"],
    } as Record<"professional" | "student", string[]>,
    tickets: [
      {
        id: "madurai-professional-preview",
        name: "Professional Pass (Preview)",
        category: "professional",
        audience: "all",
        price: 0,
        currency: "₹ TBA · ",
        opens: "2026-12-01T00:00:00+05:30",
        closes: "2026-12-20T23:59:00+05:30",
        href: "/tickets",
      },
      {
        id: "madurai-professional-diverse-preview",
        name: "Professional — Women & Diverse (Preview)",
        category: "professional",
        audience: "women-diverse",
        price: 0,
        currency: "₹ TBA · ",
        opens: "2026-12-01T00:00:00+05:30",
        closes: "2026-12-20T23:59:00+05:30",
        href: "/tickets",
      },
      {
        id: "madurai-student-preview",
        name: "Student Pass (Preview)",
        category: "student",
        audience: "all",
        price: 0,
        currency: "₹ TBA · ",
        opens: "2026-12-01T00:00:00+05:30",
        closes: "2026-12-20T23:59:00+05:30",
        href: "/tickets",
      },
      {
        id: "madurai-student-diverse-preview",
        name: "Student — Women & Diverse (Preview)",
        category: "student",
        audience: "women-diverse",
        price: 0,
        currency: "₹ TBA · ",
        opens: "2026-12-01T00:00:00+05:30",
        closes: "2026-12-20T23:59:00+05:30",
        href: "/tickets",
      },
    ] satisfies Ticket[],
  },

  agendaUrl: "/agenda",

  // DevFest Madurai's 6 tracks, preserved from the Madurai source.
  tracks: [
    {
      slug: "ai-ml",
      name: "AI & ML",
      description: "From a first prompt to your next intelligent application. Explore ideas that put AI to work.",
    },
    {
      slug: "web-cloud",
      name: "Web & Cloud",
      description: "Build for the web. Scale in the cloud. Make something people love to use.",
    },
    {
      slug: "android",
      name: "Android",
      description: "Thoughtful mobile experiences, modern Android development, and a world in your pocket.",
    },
    {
      slug: "open-source",
      name: "Open Source",
      description: "Find your first contribution, meet maintainers, and build better things together.",
    },
    {
      slug: "design-product",
      name: "Design & Product",
      description: "Good questions. Useful products. Experiences that put people first.",
    },
    {
      slug: "career",
      name: "Career & Beyond",
      description: "Find your people, share your journey, and take your next step with confidence.",
    },
  ] satisfies Track[],

  // Which tracks run on which stage/floor, in display order.
  floors: [
    {
      slug: "main-stage",
      name: "Main Stage",
      tracks: ["ai-ml", "web-cloud", "open-source"],
    },
    {
      slug: "workshops-stage",
      name: "Workshops & Labs",
      tracks: ["android", "design-product"],
    },
    {
      slug: "community-stage",
      name: "Community Lounge",
      tracks: ["career"],
    },
  ] satisfies Floor[],

  // Placeholder satellite / pre-DevFest community events for the /tickets
  // 3D carousel deck. No `href` is set until real registration links exist, so
  // each renders as a disabled "Coming soon →" state.
  pastEventHighlightsUrl: "https://www.instagram.com/gdg_madurai/",
  subEvents: [
    {
      slug: "ai-ml-roadshow",
      title: "AI & Agents Roadshow (Preview)",
      date: "2026-11-21",
      description:
        "From a first prompt to your next intelligent application — community roadshow placeholder ahead of DevFest Madurai.",
      ctaLabel: "Coming soon →",
      image: "/art/corridor.webp",
      color: "bg-blue-pastel",
    },
    {
      slug: "web-cloud-meetup",
      title: "Web & Cloud Build Day (Preview)",
      date: "2026-11-28",
      description:
        "Hands-on web and cloud build sessions with Madurai developers. Placeholder until schedule is announced.",
      ctaLabel: "Coming soon →",
      image: "/art/hero-night.webp",
      color: "bg-red-pastel",
    },
    {
      slug: "android-study-jam",
      title: "Android & Kotlin Jam (Preview)",
      date: "2026-12-05",
      description:
        "Modern Android development, Kotlin, and mobile craft. Placeholder satellite event.",
      ctaLabel: "Coming soon →",
      image: "/art/sunset.webp",
      color: "bg-green-pastel",
    },
    {
      slug: "devfest-on-campus-madurai",
      title: "DevFest on Campus · Madurai (Preview)",
      date: "2026-12-12",
      description:
        "Bringing the DevFest spirit to campuses across Madurai. Dates and host colleges to be announced.",
      ctaLabel: "Coming soon →",
      image: "/art/waterfront.webp",
      color: "bg-yellow-pastel",
    },
  ] as SubEvent[],

  whatYoullGet: [
    {
      title: "Roadshows",
      description: "Community outreach and technology awareness.",
      image: "/archive/2025-roadshow.webp",
    },
    {
      title: "Build Sessions",
      description: "Hands-on building and practical learning.",
      image: "/archive/2025-build.webp",
    },
    {
      title: "Competitions",
      description: "Challenges, creativity and problem-solving.",
      image: "/archive/2025-compete.webp",
    },
    {
      title: "Tech Talks",
      description: "Insights from developers and technology experts.",
      image: "/archive/2025-full-house.webp",
    },
    {
      title: "Networking",
      description: "Meet developers, creators and innovators.",
      image: "/archive/2025-registration-desk.webp",
    },
    {
      title: "Community",
      description: "Connect with the Madurai developer ecosystem.",
      image: "/archive/2025-group.webp",
    },
  ],

  cfp: {
    // Routes to the local /cfp page preserved from the Madurai app.
    formUrl: "/cfp",
  },

  sponsorship: {
    brochureUrl: "/partner",
  },

  codeOfConduct: {
    url: "https://developers.google.com/community-guidelines",
  },

  privacyPolicyUrl: "https://policies.google.com/privacy",

  social: {
    x: "https://x.com/gdgmadurai",
    linkedin: "https://www.linkedin.com/company/gdg-madurai/",
    instagram: "https://www.instagram.com/gdg_madurai/",
    youtube: "https://www.youtube.com/@gdgmadurai",
    github: "https://github.com/gdg-madurai",
    discord: "https://gdg.community.dev/gdg-madurai/",
  },

  contact: {
    email: "contact@gdgmadurai.in",
  },

  brandDisclaimer:
    "DevFest Madurai is an independent, community-run event organised by GDG Madurai under Google's Community Guidelines. It is not produced or endorsed by Google.",
} as const;

/**
 * Every other piece of button/label/heading/body copy that isn't part of
 * `siteConfig` above — page headings, aria-labels, button text, section
 * copy.
 */
export const uiCopy = {
  common: {
    /** Ticket Stub and Hero Copy both render this as "<chapter> presents". */
    chapterPresents: `${siteConfig.chapter} presents`,
    /** TicketStub and StaticHero's mono venue line both append this when
     *  `siteConfig.venue.confirmed` is false. */
    unconfirmedSuffix: " · TBA",
    /** TicketsList's flagship card and VenueReveal's static-baseline photo
     *  both use this same alt text for the venue photo. */
    venueAlt: `${siteConfig.venue.name}, the DevFest Madurai venue`,
    /** The speaker-detail page, SpeakerWall and AgendaBoard's session card
     *  all build a portrait's alt text as this prefix + the speaker's name. */
    portraitAltPrefix: "Portrait of ",
    /** CurvedMarqueeHero's and VenueReveal's "Get tickets" CTAs. */
    getTicketsLabel: "Get tickets →",
    skipToContent: "Skip to content",
  },

  socialLabels: {
    x: "X",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    youtube: "YouTube",
    github: "GitHub",
    discord: "Community",
  },

  header: {
    navAriaLabel: "Primary",
  },

  hamburgerMenu: {
    homeAriaLabel: "Go to homepage",
    openAriaLabel: "Open menu",
    closeAriaLabel: "Close menu",
    panelAriaLabel: "Site menu",
    cfpLabel: "Submit CFP",
  },

  footer: {
    codeOfConductLabel: "Code of Conduct",
    privacyPolicyLabel: "Privacy Policy",
  },

  footerLogo: {
    alt: "DevFest Madurai",
  },

  errorPage: {
    eyebrow: "Something went wrong",
    heading: "This page hit an error.",
    body: "The rest of the site is fine — retry this page, or head somewhere else.",
    retryLabel: "Try again",
    homeLabel: "Back home",
  },

  globalErrorPage: {
    eyebrow: "Something went wrong",
    heading: "DevFest Madurai hit an unexpected error.",
    body: "Please try again in a moment.",
    retryLabel: "Try again",
  },

  agendaPage: {
    heading: "Agenda",
  },

  contactPage: {
    heading: "Contact",
    bodyPrefix:
      "Questions about DevFest Madurai 2026 — sponsorship, speaking, volunteering, or anything else? Reach the ",
    bodySuffix: " organising team directly.",
  },

  memoriesPage: {
    heading: "Memories",
    body: "Community moments and highlights from DevFest & GDG Madurai.",
  },

  speakersPage: {
    heading: "Speakers",
    cfpOpenBody: "The 2026 speaker lineup has not been announced yet. Submit a proposal through our CFP portal to be part of it.",
    moreToComeBody: "Official speakers for DevFest Madurai 2026 will be announced soon.",
  },

  notFoundPage: {
    statusLabel: "404",
    heading: "Page not found.",
    whatMostPeopleWantHeading: "What most people are looking for",
    everywhereElseHeading: "Everywhere else on the site",
    whileYoureHere: "While you're here",
    archiveBlurb: "Explore the community photo archive while event details are finalised.",
    closing: "Hope to see you at DevFest Madurai.",
    highlights: {
      agendaEyebrow: "The day",
      agendaTitle: "Agenda",
      agendaDescription: "Six tracks across AI & ML, Web & Cloud, Android, Open Source, Design & Career.",
      ticketsEyebrow: "Get in",
      ticketsDescription: "Preview ticket categories for DevFest Madurai 2026.",
      speakingEyebrow: "Get on stage",
      speakingTitle: "Speak at DevFest",
      speakingDescription: "First-time speakers as welcome as conference regulars.",
    },
    recovery: {
      fallbackPreviousPageLabel: "the previous page",
      triedLabel: "tried",
      suggestionFoundBody: "That address doesn't exist, but one very close to it does.",
      nothingFoundBody:
        "That link is either out of date or was never a page here — but you're in the right place. Here's what most people come for.",
      goToPrefix: "Go to ",
      backHomeLabel: "Back home",
      backToPrefix: "← Back to ",
    },
  },

  speakerWall: {
    talksHeading: "Talks",
  },

  agendaBoard: {
    previousSessionSr: "Previous session",
    nextSessionSr: "Next session",
    previousTrackSr: "Previous track",
    nextTrackSr: "Next track",
    previousEyebrow: "Previous",
    upNextEyebrow: "Up next",
    liveNowLabel: "Live now",
  },

  agenda: {
    onNowLabel: "On now",
  },

  agendaTimeline: {
    viewFullAgendaLabel: "View full agenda →",
  },

  agendaView: {
    allTracksLabel: "All",
    tracksAriaLabel: "Agenda tracks",
    simpleModeLabel: "Simple view",
  },

  ticketSelector: {
    heading: "Find your ticket category",
    imAPrompt: "I'm a",
    identifyPrompt: "and I identify as",
    buyTicketLabel: "Buy ticket",
    comingSoonLabel: "Coming soon",
    placeholderPrompt: "Pick your details above to preview your ticket category",
    onSaleFromPrefix: "Registration opens",
    notOnSalePrompt: "Tickets aren't on sale yet. Check back when registration opens.",
    closeCheckoutLabel: "Close checkout",
  },

  ticketStub: {
    dateFieldLabel: "Date",
    venueFieldLabel: "Venue",
    tbaDate: "TBA",
    admitOneLabel: "Admit one",
  },

  ticketsList: {
    heading: "Pick your event",
    flagshipDescriptionPrefix: "The flagship day — ",
    flagshipDescriptionMiddle: "'s main event in ",
    flagshipDescriptionSuffix: ". Where heritage meets innovation.",
    previousEventSr: "Previous event",
    nextEventSr: "Next event",
    mainEventLabel: "Main event",
    seeHighlights: "See highlights →",
  },

  heroCopy: {
    agendaLabel: "See Agenda →",
    cfpLabel: "Submit CFP →",
  },

  liteToggle: {
    label: "Lite version",
    onLabel: "on",
    offLabel: "off",
  },

  loader: {
    introAriaSuffix: " intro",
    readyStatus: "Ready.",
    loadingStatusPrefix: "Loading ",
    loadingStatusSuffix: "…",
    enterCtaLabel: "Enter the DevFest experience →",
    switchToLiteLabel: "I don't like animations →",
    litePromptBody: "Taking a while? There's a lighter version.",
    litePromptAcceptLabel: "Switch to lite →",
    litePromptDismissLabel: "Keep waiting",
  },

  memoriesHallway: {
    scrollHint: "Scroll",
  },

  scrollCue: {
    nextCardLabel: "Next card",
    previousCardLabel: "Previous card",
    scrollToNextSectionLabel: "Scroll to next section",
    previousSectionLabel: "Previous section",
  },

  expectShowcase: {
    heading: "What to expect at DevFest?",
    previousCardSr: "Previous card",
    nextCardSr: "Next card",
  },

  readySection: {
    eyebrow: "GET READY",
    heading: "Ready for DevFest Madurai?",
    supportingText:
      "One unforgettable day of technology, community and innovation in the heart of Madurai.",
    lines: ["Ready for", "DevFest Madurai?"],
  },

  moodSection: {
    heading: "What's your DevFest vibe?",
  },

  sponsorsSection: {
    heading: "Our sponsors",
    // Placeholder sponsor tiers so the homepage section renders in full visual
    // hierarchy without inventing real corporate sponsors. Replace with real
    // sponsor logos in public/sponsors/ as they are confirmed.
    tiers: [
      {
        label: "Platinum · Placeholder",
        size: "lg",
        sponsors: [
          {
            name: "Title Sponsor (Placeholder — TBA)",
            logo: "/sponsors/platinum-placeholder.svg",
            href: "/partner",
          },
        ],
      },
      {
        label: "Gold · Placeholder",
        size: "md",
        sponsors: [
          {
            name: "Gold Sponsor 01 (Placeholder — TBA)",
            logo: "/sponsors/gold-placeholder-1.svg",
            href: "/partner",
          },
          {
            name: "Gold Sponsor 02 (Placeholder — TBA)",
            logo: "/sponsors/gold-placeholder-2.svg",
            href: "/partner",
          },
        ],
      },
    ] as readonly {
      label: string;
      size: "lg" | "md" | "sm";
      sponsors: readonly { name: string; logo: string; href?: string }[];
    }[],
  },

  partnersMarquee: {
    heading: "Community Partners",
    items: [
      { name: "GDG Cloud", logo: "/partners/gdg-cloud-madurai.svg" },
      { name: "Kotlin User Group", logo: "/partners/kug-madurai.svg" },
      { name: "AI for Science", logo: "/partners/ai-for-science.svg" },
      { name: "AI Geeks", logo: "/partners/ai-geeks.svg" },
      { name: "Community Partner (Placeholder)", logo: "/partners/partner-placeholder.svg" },
      { name: "Grafana Community", logo: "/partners/grafana-madurai.svg" },
      { name: "MongoDB User Group", logo: "/partners/mongo-madurai.svg" },
      { name: "United by AI", logo: "/partners/uai.svg" },
    ] as readonly { name: string; logo: string; href?: string }[],
  },

  seeYouThereSection: {
    heading: "See you there!",
    links: [
      { label: "Get Tickets →", href: "/tickets" },
    ] as readonly { label: string; href?: string }[],
  },

  showMoodSection: {
    presentTitle: "Present",
    presentBody:
      "Got bold ideas or built something remarkable? AI & ML, Web & Cloud, Android, Open Source, Design or Career stories — bring your energy to the DevFest Madurai stage and share your craft with our community!",
    attendTitle: "Attend",
    attendBody:
      "More than an event, it's a community. A place for developers, creators, students and curious minds in Madurai to learn, build and find their people. In a city shaped by stories and craft, let's create what comes next — together!",
    cfpLinkLabel: "Submit CFP →",
    ticketLinkLabel: "← Get tickets",
  },

  staticHero: {
    switchToFullExperienceLabel: "Switch to the full experience →",
  },

  venueReveal: {
    eyebrow: "THE VENUE",
    heading: "In the heart of Madurai.",
    supportingText:
      "A vibrant space for a vibrant community — where ideas, people and innovation come together.",
    locationLabel: "LOCATION",
    locationValue: "Madurai, Tamil Nadu, India",
    dateLabel: "EVENT DATE",
    dateValue: "12 December 2026",
    venueLabel: "VENUE",
    venueValue: "To be announced",
    announcementStatus: "Venue announcement coming soon",
    architectureLabel: "Meenakshi Amman Temple · Gopuram & Mandapam Architectural Line Study",
    photoCaptionTitle: "Designed for connection, built for scale",
    photoCaptionBody:
      "Keynote auditorium, hands-on build labs, and community lounges in Madurai. Official host venue details will be announced soon.",
    roadshowsText: "Pre-DevFest Roadshows and Community Meetups across Madurai",
    disclaimerText: "Note: Official venue to be announced. Event date is 12 December 2026.",
    locationHeading: "Location",
    saveTheDateHeading: "Save the Date",
    getDirectionsLabel: "Explore Madurai →",
  },
} as const;

export function isTicketOnSale(ticket: Ticket, now: Date | number = Date.now()): boolean {
  const t = typeof now === "number" ? now : now.getTime();
  return t >= Date.parse(ticket.opens) && t <= Date.parse(ticket.closes);
}

export function isTicketUpcoming(ticket: Ticket, now: Date | number = Date.now()): boolean {
  const t = typeof now === "number" ? now : now.getTime();
  return t < Date.parse(ticket.opens);
}

export function formatEventDate(date: string | null): string {
  if (!date) return "Date to be announced";
  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: EVENT_TIME_ZONE,
  });
}

export function shortEventDate(date: string | null): string {
  if (!date) return "Date to be announced";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: EVENT_TIME_ZONE,
  });
}
