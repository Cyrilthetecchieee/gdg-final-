"use client";

import { isLiteMode, shouldSkipHeavyAssets } from "@/lib/motion-prefs";
import { useClientValue } from "@/lib/useClientValue";
import { StaticHero } from "@/components/motion/StaticHero";
import type { ArchivePhoto } from "@/lib/schemas";

/**
 * Renders the approved DevFest Madurai 2026 Hero Section:
 *  - Dark cinematic night-to-twilight backdrop with Madurai Meenakshi Amman Temple gopurams
 *  - Clean bold Google Sans typography ("DevFest" in white with yellow spark rays,
 *    "Madurai" in Google Blue, Red, Yellow, Green)
 *  - Real Three.js 3D translucent Google-coloured glass brackets (< >) with refraction,
 *    specular lighting, floating motion, and mouse/scroll interaction.
 *  - Event date: 12 December 2026, Venue: To be announced.
 */
export function HeroSection({ photos: _photos }: { photos: ArchivePhoto[] }) {
  const skipHeavy = useClientValue(shouldSkipHeavyAssets, false);
  const lite = useClientValue(isLiteMode, false);
  return <StaticHero offerFullExperience={lite} enable3D={!skipHeavy} />;
}
