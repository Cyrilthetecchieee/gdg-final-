/**
 * Nav entry for the account area, in the two nav surfaces:
 *  - "pill" → lite-mode Header's pill bar
 *  - "menu" → full-mode HamburgerMenu's link list
 *
 * The profile page is not part of the public site, so both nav surfaces use
 * the dedicated sign-in page instead.
 */
export function AuthButton({ variant }: { variant: "pill" | "menu" }) {
  void variant;
  return null;
}
