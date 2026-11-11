"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { navRoutes } from "@/lib/routes";
import { speakerCta } from "@/lib/cta";
import { siteConfig, uiCopy } from "@/site.config";
import { RollingText } from "@/components/motion/RollingText";
import { AuthButton } from "@/components/auth/AuthButton";
import { useHeaderTitleContext, resolveHeaderTitle } from "@/components/HeaderTitleContext";
import { TRANSITION_IN_MS } from "@/components/motion/MotionProvider";
import { shouldUseStaticBaseline } from "@/lib/motion-prefs";

gsap.registerPlugin(useGSAP);

/**
 * Full-mode navigation. Replaces the old always-visible pill bar (still used
 * in lite mode — see components/Header.tsx) with a glow button that morphs
 * into a cross and opens a full-screen panel that grows out of the button
 * itself — a `clip-path: circle()` expanding from the button's centre to a
 * radius that reaches the farthest corner of the viewport, recomputed on
 * every open/close so it tracks the button regardless of screen size. Once
 * the circle has fully covered the screen, the links push in left-to-right.
 *
 * Which nav renders is decided purely by CSS (`.nav-hamburger-only`, gated on
 * `html.lite`, set pre-paint) — see app/globals.css — so there's no
 * hydration flash and no JS branch needed here for that part.
 *
 * z-50 on the button, z-45 on the panel: both above page content (z-40, the
 * ScrollCue buttons — the panel needs to clear that explicitly, since
 * ScrollCueController mounts after <main> in layout.tsx and would otherwise
 * paint over an open panel at the same z-40) and below both the boot
 * preloader (z-995) and <Loader> (z-1000) and the hallway flythrough (z-500
 * in HeroSection/MemoriesHallway) — the button is meant to disappear under
 * all three, not fight them for a corner.
 */
export function HamburgerMenu() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const panelId = useId();

  const { title: customTitle } = useHeaderTitleContext();
  const headerTitle = resolveHeaderTitle(pathname, customTitle);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const barTopRef = useRef<HTMLSpanElement>(null);
  const barBottomRef = useRef<HTMLSpanElement>(null);

  const { contextSafe } = useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;
      const items = gsap.utils.toArray<HTMLElement>("[data-menu-item]", panel);
      // Starting state lives here (not in CSS) so it only ever applies once
      // GSAP has taken over — the Tailwind `invisible opacity-0` classes on
      // the panel are what prevent the pre-JS/SSR flash.
      gsap.set(panel, { autoAlpha: 0, clipPath: "circle(0px at 0px 0px)" });
      gsap.set(items, { x: -48, autoAlpha: 0 });
    },
    { scope: panelRef },
  );

  // Distance from `origin` to the farthest corner of the viewport — the
  // radius the circle needs to fully cover the screen no matter where the
  // button sits.
  function coverRadius(originX: number, originY: number) {
    const dx = Math.max(originX, window.innerWidth - originX);
    const dy = Math.max(originY, window.innerHeight - originY);
    return Math.hypot(dx, dy);
  }

  function buttonOrigin() {
    const rect = buttonRef.current!.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }

  const openMenu = contextSafe(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const { x, y } = buttonOrigin();
    const radius = coverRadius(x, y);
    const items = gsap.utils.toArray<HTMLElement>("[data-menu-item]", panel);
    const reduced = shouldUseStaticBaseline();

    gsap.set(panel, { autoAlpha: 1, clipPath: `circle(0px at ${x}px ${y}px)` });
    gsap.set(items, { x: -48, autoAlpha: 0 });

    const tl = gsap.timeline();
    tl.to(barTopRef.current, { rotate: 45, y: 6, duration: 0.3, ease: "power2.inOut" }, 0)
      .to(barBottomRef.current, { rotate: -45, y: -6, duration: 0.3, ease: "power2.inOut" }, 0)
      .to(
        panel,
        {
          clipPath: `circle(${radius}px at ${x}px ${y}px)`,
          duration: reduced ? 0 : 0.7,
          ease: "power3.inOut",
        },
        0,
      )
      // Items only start pushing in once the circle has (nearly) covered the
      // screen — "show menu items after the menu screen fully loads".
      .to(
        items,
        { x: 0, autoAlpha: 1, duration: reduced ? 0 : 0.5, ease: "power3.out", stagger: reduced ? 0 : 0.08 },
        reduced ? 0 : 0.55,
      );
  });

  const closeMenu = contextSafe(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (document.activeElement instanceof HTMLElement && panel.contains(document.activeElement)) {
      document.activeElement.blur();
    }
    const { x, y } = buttonOrigin();
    const items = gsap.utils.toArray<HTMLElement>("[data-menu-item]", panel);
    const reduced = shouldUseStaticBaseline();

    const tl = gsap.timeline({ onComplete: () => gsap.set(panel, { autoAlpha: 0 }) });
    tl.to(barTopRef.current, { rotate: 0, y: 0, duration: 0.3, ease: "power2.inOut" }, 0)
      .to(barBottomRef.current, { rotate: 0, y: 0, duration: 0.3, ease: "power2.inOut" }, 0)
      .to(
        items,
        { x: -48, autoAlpha: 0, duration: reduced ? 0 : 0.3, ease: "power2.in", stagger: reduced ? 0 : 0.04 },
        0,
      )
      .to(
        panel,
        { clipPath: `circle(0px at ${x}px ${y}px)`, duration: reduced ? 0 : 0.5, ease: "power3.inOut" },
        reduced ? 0 : 0.2,
      );
  });

  const toggle = contextSafe(() => {
    setOpen((value) => {
      const next = !value;
      if (next) openMenu();
      else closeMenu();
      return next;
    });
  });

  const close = contextSafe(() => {
    setOpen(false);
    closeMenu();
  });

  // Snaps the menu shut with no animation — reset, not a transition, because
  // the moment this runs the screen is already fully covered by
  // MotionProvider's route-transition curtain (app/../MotionProvider.tsx), so
  // there's nothing visible for an animation to do.
  const closeInstant = contextSafe(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (document.activeElement instanceof HTMLElement && panel.contains(document.activeElement)) {
      document.activeElement.blur();
    }
    const items = gsap.utils.toArray<HTMLElement>("[data-menu-item]", panel);
    gsap.set(panel, { autoAlpha: 0, clipPath: "circle(0px at 0px 0px)" });
    gsap.set(items, { x: -48, autoAlpha: 0 });
    gsap.set([barTopRef.current, barBottomRef.current], { rotate: 0, y: 0 });
    setOpen(false);
  });

  // For internal nav clicks, let the curtain be the thing that visually
  // hides the menu — it draws in OVER the still-open panel — rather than the
  // panel vanishing on its own a beat before the curtain even appears. It's
  // reset only once the curtain has fully covered the screen, timed off the
  // same TRANSITION_IN_MS the curtain itself sweeps on, so by the time it
  // sweeps back out the menu is already gone and the new page is what's
  // revealed underneath.
  //
  // This has to run in the CAPTURE phase (not `close` on <Link>'s onClick,
  // a bubble-phase React handler): MotionProvider's curtain listens on
  // `document` in the capture phase and calls stopPropagation() before any
  // bubble-phase handler runs, so relying on onClick alone left the panel
  // open with no close ever firing. Effects run child-before-parent, and
  // HamburgerMenu is a child of MotionProvider, so this listener attaches
  // (and therefore runs) first on the same document target.
  useEffect(() => {
    function onClickCapture(event: MouseEvent) {
      const panel = panelRef.current;
      if (!panel) return;
      const target = event.target as HTMLElement | null;
      if (!target || !panel.contains(target)) return;
      const anchor = target.closest("a");
      const href = anchor?.getAttribute("href");
      // Same "will the curtain intercept this?" check MotionProvider itself
      // uses — an external link (Get tickets, Submit CFP's Sessionize form)
      // isn't touched by the curtain, so it keeps the normal animated
      // `close` from its own onClick instead.
      if (href && href.startsWith("/") && !href.startsWith("//") && anchor?.target !== "_blank") {
        window.setTimeout(closeInstant, TRANSITION_IN_MS);
      }
    }

    document.addEventListener("click", onClickCapture, true);
    return () => document.removeEventListener("click", onClickCapture, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Belt-and-suspenders: the capture listener above handles the normal case,
  // but closing instantly on the route actually changing means the menu
  // can't get stuck open after a navigation no matter how it was triggered.
  const prevPathnameRef = useRef(pathname);
  useEffect(() => {
    if (pathname !== prevPathnameRef.current) {
      prevPathnameRef.current = pathname;
      if (open) closeInstant();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const speaker = speakerCta();
  const hamburgerButton = (
    <button
      ref={buttonRef}
      type="button"
      aria-expanded={open}
      aria-controls={panelId}
      aria-label={open ? uiCopy.hamburgerMenu.closeAriaLabel : uiCopy.hamburgerMenu.openAriaLabel}
      onClick={toggle}
      className="glow-btn pointer-events-auto h-11 w-11 rounded-2xl"
      data-shape="box"
    >
      <span className="glow-btn__corners" aria-hidden="true" />
      <span className="glow-btn__surface flex h-11 w-11 items-center justify-center rounded-2xl">
        <span className="glow-btn__label relative block h-3.5 w-5">
          <span
            ref={barTopRef}
            className="absolute inset-x-0 top-0 h-0.5 rounded-full bg-paper"
          />
          <span
            ref={barBottomRef}
            className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-paper"
          />
        </span>
      </span>
    </button>
  );

  return (
    <div className="nav-hamburger-only">
      {/*
       * The header bar, on every route including "/": Home button on the
       * left (kept as an invisible spacer on "/" so the right-hand controls
       * sit in the same place), centered page title, Avatar + Hamburger on the
       * right. Every route but "/" gets the frosted gradient background. The
       * home page has no bar background at all — its pinned, full-bleed
       * sections run to the top edge and would sit under it — and no title
       * (its own hero carries the h1); there the bar is click-through except
       * for the buttons themselves.
       * When the menu is open, make the header transparent, borderless, and raised to z-[60]
       * so only the hamburger cross button stays visible and clickable on top of the menu panel.
       */}
      <header className={`site-nav fixed inset-x-0 top-0 transition-all duration-300 ${
          open 
            ? "z-[60] bg-transparent border-b-transparent backdrop-blur-none" 
            : isHome
              ? "z-50 bg-transparent"
              : "z-50 gradient-header"
        } ${isHome ? "pointer-events-none" : ""}`}>
          <div className="mx-auto flex w-full items-center justify-between gap-3 px-4 py-3 sm:px-8 sm:py-3.5 pt-[max(0.75rem,calc(env(safe-area-inset-top,0px)+0.5rem))]">
            {/* Left section: GDG Madurai brand lockup */}
            <div
              className={`flex items-center gap-2 transition-opacity duration-200 ${
                open ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <Link
                href="/"
                aria-label={uiCopy.hamburgerMenu.homeAriaLabel}
                className="pointer-events-auto inline-flex items-center gap-2.5 rounded-full border border-paper/15 bg-ink/75 px-3.5 py-2 text-sm font-semibold tracking-tight text-paper backdrop-blur-md transition-colors hover:border-paper/30 hover:bg-ink/90"
              >
                <span aria-hidden="true" className="inline-flex items-center gap-0.5 text-base font-bold leading-none">
                  <span className="text-blue">&lt;</span>
                  <span className="text-red">/</span>
                  <span className="text-green">&gt;</span>
                </span>
                <span>{siteConfig.chapter}</span>
              </Link>
            </div>

            {/* Center section: Desktop primary navigation pill on xl+, or dedicated page title on subpages */}
            <div
              className={`flex-1 flex items-center justify-center px-2 sm:px-4 text-center min-w-0 transition-opacity duration-200 ${
                open ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <nav
                aria-label={uiCopy.header.navAriaLabel}
                className="pointer-events-auto hidden items-center gap-1 rounded-full border border-paper/15 bg-ink/75 px-2 py-1.5 backdrop-blur-md lg:flex"
              >
                {navRoutes.map((route) => {
                  const active = pathname === route.href;
                  return (
                    <Link
                      key={route.href}
                      href={route.href}
                      aria-current={active ? "page" : undefined}
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors xl:px-3.5 xl:text-sm ${
                        active
                          ? "bg-paper/15 text-paper"
                          : "text-paper/75 hover:bg-paper/10 hover:text-paper"
                      }`}
                    >
                      {route.label}
                    </Link>
                  );
                })}
              </nav>

              {headerTitle && (
                <h1 className="truncate text-2xl font-semibold tracking-tight text-paper sm:text-3xl md:text-4xl max-w-[50vw] sm:max-w-[60vw] lg:hidden">
                  {headerTitle}
                </h1>
              )}
            </div>

            {/* Right section: Avatar button + Hamburger menu button */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-11 justify-end">
              {hamburgerButton}
            </div>
          </div>
        </header>

      {/*
       * Full-screen: a clip-path circle grown from the button's centre (see
       * openMenu/closeMenu) rather than a corner-anchored card, so it reads
       * as the button itself expanding to cover the page. Same background at
       * every size now that it's always full-bleed.
       */}
      <div
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-label={uiCopy.hamburgerMenu.panelAriaLabel}
        inert={!open}
        ref={panelRef}
        className="invisible fixed inset-0 z-[55] flex flex-col items-center justify-center gap-6 bg-ink/85 px-6 text-2xl opacity-0 backdrop-blur-md sm:gap-7 sm:text-4xl"
      >
        {navRoutes.map((route) => {
          const active = pathname === route.href;
          return (
            <div key={route.href} data-menu-item>
              <Link
                href={route.href}
                aria-current={active ? "page" : undefined}
                onClick={close}
                className={active ? "font-semibold text-yellow" : "text-paper/90 hover:text-paper"}
              >
                <RollingText>{route.label}</RollingText> →
              </Link>
            </div>
          );
        })}
        <div data-menu-item>
          {speaker.external ? (
            <a
              href={speaker.href}
              target="_blank"
              rel="noreferrer"
              onClick={close}
              className="text-paper/90 hover:text-paper"
            >
              <RollingText>{uiCopy.hamburgerMenu.cfpLabel}</RollingText> →
            </a>
          ) : (
            <Link
              href={speaker.href}
              aria-current={pathname === speaker.href ? "page" : undefined}
              onClick={close}
              className={pathname === speaker.href ? "font-semibold text-yellow" : "text-paper/90 hover:text-paper"}
            >
              <RollingText>{uiCopy.hamburgerMenu.cfpLabel}</RollingText> →
            </Link>
          )}
        </div>
        <div data-menu-item>
          <AuthButton variant="menu" />
        </div>
      </div>
    </div>
  );
}
