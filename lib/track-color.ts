import type { Track } from "@/site.config";

/**
 * One brand colour per track, used everywhere a track is named.
 * The core Google colours go to the two stages and the three D6 competitions.
 * Halftones cover the remaining programs so every filter pill stays distinct.
 * Lifted out of AgendaList, which owned the only copy while the homepage
 * rendered every track in blue.
 */
export type TrackSlug = Track["slug"];

type TrackPalette = {
  /** Label colour, e.g. the mono track name. */
  text: string;
  /** Solid fill, for dots and chips. */
  bg: string;
  /** The card's accent hairline. */
  border: string;
  /** Raw custom property, for gradients that can't take a utility class. */
  cssVar: string;
};

const PALETTE: Record<string, TrackPalette> = {
  "ai-ml": { text: "text-blue", bg: "bg-blue", border: "border-blue", cssVar: "var(--blue)" },
  "web-cloud": { text: "text-red", bg: "bg-red", border: "border-red", cssVar: "var(--red)" },
  android: { text: "text-green", bg: "bg-green", border: "border-green", cssVar: "var(--green)" },
  "open-source": { text: "text-yellow", bg: "bg-yellow", border: "border-yellow", cssVar: "var(--yellow)" },
  "design-product": { text: "text-purple", bg: "bg-purple", border: "border-purple", cssVar: "var(--purple)" },
  career: {
    text: "text-blue-halftone",
    bg: "bg-blue-halftone",
    border: "border-blue-halftone",
    cssVar: "var(--blue-halftone)",
  },
};

const NEUTRAL: TrackPalette = {
  text: "text-paper/60",
  bg: "bg-paper/30",
  border: "border-paper/20",
  cssVar: "var(--paper)",
};

/** Never throws on an unknown slug — content is author-edited JSON. `null` is
 *  a venue-wide session with no single track (see agendaSessionSchema). */
export function trackColor(slug: string | null): TrackPalette {
  return (slug ? PALETTE[slug] : undefined) ?? NEUTRAL;
}
