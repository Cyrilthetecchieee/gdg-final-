import { siteConfig } from "@/site.config";

/**
 * What the site's two recruiting call-to-actions should actually say, given
 * how much of `siteConfig` is still unconfirmed. Both follow the same rule:
 * never render a label that promises something the config cannot deliver —
 * which is also why both always resolve to a real destination now.
 */
export type Cta = { available: true; href: string; label: string; external: boolean };

/**
 * Registration is handled by the official Open Madurai form. Keep this helper
 * as the single source for every registration CTA so internal and external
 * links cannot drift apart.
 */
export function ticketCta(): Cta {
  return {
    available: true,
    href: siteConfig.ticketing.href,
    label: siteConfig.ticketing.availableLabel,
    external: siteConfig.ticketing.href.startsWith("http"),
  };
}

/**
 * The speaker pitch — always the external CFP form (Sessionize). There's no
 * local /cfp page to fall back to, so every "this could be you" slot on the
 * site points straight at the form, in a new tab.
 */
export function speakerCta(): Cta {
  return {
    available: true,
    href: siteConfig.cfp.formUrl,
    label: "Submit a talk",
    external: siteConfig.cfp.formUrl.startsWith("http"),
  };
}
