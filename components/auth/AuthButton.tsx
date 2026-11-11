/**
 * Nav entry for the account area, in the two nav surfaces:
 *  - "pill" → lite-mode Header's pill bar
 *  - "menu" → full-mode HamburgerMenu's link list
 *
 * The profile page is not part of the public site, so both nav surfaces use
 * the dedicated sign-in page instead.
 */
export function AuthButton({ variant }: { variant: "pill" | "menu" }) {
  if (variant === "menu") {
    return <a href="/signin" className="text-paper/90 hover:text-paper">Sign in →</a>;
  }

  return (
    <a
      href="/signin"
      className="block rounded-full px-3 py-1.5 text-sm text-paper/70 transition-colors hover:bg-paper/5 hover:text-paper"
    >
      Sign in
    </a>
  );
}
