"use client";

import { FooterBrackets } from "@/components/FooterBrackets";
import { GlowButton } from "@/components/GlowButton";
import { SocialIcon } from "@/components/SocialIcon";
import { uiCopy } from "@/site.config";

/*
 * The footer centrepiece: a text-based DevFest Madurai lockup framed by the
 * brand brackets. It deliberately avoids an image asset until approved artwork
 * is supplied.
 *
 * Two rendering modes, keyed off whether the 3D BracketsField is live (only on
 * the homepage, only with motion enabled):
 *
 *  • 3D mode — BracketsField extrudes BOTH this lockup and the two brackets in
 *    WebGL and settles them here as the page bottom is reached (it reads this
 *    box via id="footer-logo"). Those meshes live behind the footer (z-0), so
 *    the flat <img> is kept for layout/measurement but hidden (opacity 0), and
 *    <FooterBrackets> renders nothing.
 *  • Fallback — everywhere else (other routes, reduced-motion / lite / save-
 *    data): the flat SVG shows with a stacked-drop-shadow fake extrusion, and
 *    <FooterBrackets> draws a static pair in the same slots.
 *
 * No card: the brackets can only show where the footer is transparent. The
 * white pill carries a hairline border (in the SVG) so it reads on the page.
 */

export function FooterLogo({
  social,
}: {
  social: { label: string; href: string }[];
}) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-10">
      {/* The logo box. `relative` so the static fallback brackets can anchor to
          it; the 3D field reads this same box via id="footer-logo". The capped
          width leaves the transparent gutters the brackets settle into, and the
          aspect-ratio keeps the box measured before the image loads so the 3D
          settle target is stable. */}
      <div className="relative mx-auto aspect-[1370/531] w-[min(60vw,420px)]">
        <FooterBrackets />
        <div
          id="footer-logo"
          role="img"
          aria-label={uiCopy.footerLogo.alt}
          className="absolute inset-0 flex flex-col items-center justify-center gap-[5%] px-[12%] text-center"
        >
          <span className="text-[clamp(2rem,7vw,4.2rem)] font-bold leading-none tracking-[-0.06em] text-paper">
            DevFest
          </span>
          <span className="flex h-[25%] w-full items-center justify-center rounded-full bg-paper px-4 text-[clamp(0.9rem,2.4vw,1.35rem)] font-medium text-ink">
            Madurai
          </span>
        </div>
      </div>

      {/* Social buttons — same glass/neon treatment as the site's other CTAs
          (see components/GlowButton.tsx), circle-shaped for an icon-only
          control. aria-label carries the accessible name since the visible
          content is just the icon. */}
      {social.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {social.map((link) => (
            <GlowButton key={link.label} href={link.href} target="_blank" rel="noreferrer" shape="circle" size="sm">
              <span className="sr-only">{link.label}</span>
              <SocialIcon name={link.label} className="relative h-5 w-5 fill-paper" />
            </GlowButton>
          ))}
        </div>
      )}
    </div>
  );
}
