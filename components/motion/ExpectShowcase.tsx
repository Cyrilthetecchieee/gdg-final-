"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig, uiCopy } from "@/site.config";
import { prefersReducedMotion, shouldUseStaticBaseline } from "@/lib/motion-prefs";
import { useClientValue } from "@/lib/useClientValue";
import { setHorizontalCue } from "@/components/motion/scrollCueRegistry";
import { useMotion } from "@/components/motion/MotionProvider";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type CardAccent = {
  id: string;
  badgeLabel: string;
  borderClass: string;
  hoverBorderClass: string;
  iconBgClass: string;
  dotActiveClass: string;
  gradientStyle: string;
  glowColor: string;
  topBarColor: string;
};

const CARD_ACCENTS: readonly CardAccent[] = [
  {
    id: "roadshows",
    badgeLabel: "01 · ROADSHOWS",
    borderClass: "border-[#4285F4]/45",
    hoverBorderClass: "hover:border-[#4285F4]",
    iconBgClass: "bg-[#4285F4]/25 text-white border-[#4285F4]/50",
    dotActiveClass: "bg-[#4285F4]",
    gradientStyle:
      "linear-gradient(180deg, rgba(13, 35, 86, 0.15) 0%, rgba(21, 72, 166, 0.78) 44%, rgba(26, 115, 232, 0.96) 72%, rgba(16, 56, 132, 0.98) 100%)",
    glowColor: "rgba(66, 133, 244, 0.42)",
    topBarColor: "#4285F4",
  },
  {
    id: "build-sessions",
    badgeLabel: "02 · BUILD SESSIONS",
    borderClass: "border-[#34A853]/45",
    hoverBorderClass: "hover:border-[#34A853]",
    iconBgClass: "bg-[#34A853]/25 text-white border-[#34A853]/50",
    dotActiveClass: "bg-[#34A853]",
    gradientStyle:
      "linear-gradient(180deg, rgba(11, 56, 30, 0.15) 0%, rgba(20, 108, 52, 0.78) 44%, rgba(30, 142, 62, 0.96) 72%, rgba(15, 77, 35, 0.98) 100%)",
    glowColor: "rgba(52, 168, 83, 0.42)",
    topBarColor: "#34A853",
  },
  {
    id: "competitions",
    badgeLabel: "03 · COMPETITIONS",
    borderClass: "border-[#FBBC04]/45",
    hoverBorderClass: "hover:border-[#FBBC04]",
    iconBgClass: "bg-[#FBBC04]/25 text-white border-[#FBBC04]/50",
    dotActiveClass: "bg-[#FBBC04]",
    gradientStyle:
      "linear-gradient(180deg, rgba(78, 44, 4, 0.15) 0%, rgba(168, 92, 6, 0.8) 44%, rgba(217, 119, 6, 0.96) 72%, rgba(133, 68, 4, 0.98) 100%)",
    glowColor: "rgba(251, 188, 4, 0.42)",
    topBarColor: "#FBBC04",
  },
  {
    id: "tech-talks",
    badgeLabel: "04 · TECH TALKS",
    borderLabel: "purple",
    borderClass: "border-[#A136F7]/45",
    hoverBorderClass: "hover:border-[#A136F7]",
    iconBgClass: "bg-[#A136F7]/25 text-white border-[#A136F7]/50",
    dotActiveClass: "bg-[#A136F7]",
    gradientStyle:
      "linear-gradient(180deg, rgba(48, 16, 86, 0.15) 0%, rgba(98, 34, 168, 0.78) 44%, rgba(132, 48, 206, 0.96) 72%, rgba(74, 21, 128, 0.98) 100%)",
    glowColor: "rgba(161, 54, 247, 0.42)",
    topBarColor: "#A136F7",
  } as CardAccent,
  {
    id: "networking",
    badgeLabel: "05 · NETWORKING",
    borderClass: "border-[#EA4335]/45",
    hoverBorderClass: "hover:border-[#EA4335]",
    iconBgClass: "bg-[#EA4335]/25 text-white border-[#EA4335]/50",
    dotActiveClass: "bg-[#EA4335]",
    gradientStyle:
      "linear-gradient(180deg, rgba(76, 14, 14, 0.15) 0%, rgba(165, 28, 24, 0.78) 44%, rgba(205, 42, 36, 0.96) 72%, rgba(122, 18, 18, 0.98) 100%)",
    glowColor: "rgba(234, 67, 53, 0.42)",
    topBarColor: "#EA4335",
  },
  {
    id: "community",
    badgeLabel: "06 · COMMUNITY",
    borderClass: "border-[#34A853]/45",
    hoverBorderClass: "hover:border-[#5CDB6D]",
    iconBgClass: "bg-[#34A853]/25 text-white border-[#5CDB6D]/50",
    dotActiveClass: "bg-[#5CDB6D]",
    gradientStyle:
      "linear-gradient(180deg, rgba(8, 52, 36, 0.15) 0%, rgba(15, 118, 68, 0.78) 44%, rgba(18, 148, 84, 0.96) 72%, rgba(10, 82, 46, 0.98) 100%)",
    glowColor: "rgba(52, 168, 83, 0.42)",
    topBarColor: "#5CDB6D",
  },
];

function ExpectCardIcon({ index }: { index: number }) {
  switch (index % 6) {
    case 0: // Roadshows — Rocket icon
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
          <path
            d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 1: // Build Sessions — Code brackets </>
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
          <path
            d="m8 8-4 4 4 4m8-8 4 4-4 4m-2-10-4 12"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 2: // Competitions — Trophy cup
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
          <path
            d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6m12 5h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16m-10-7.34V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22m7-7.34V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18 2H6v7a6 6 0 0 0 12 0V2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 3: // Tech Talks — Stage microphone
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
          <rect x="9" y="2" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="2" />
          <path
            d="M5 10a7 7 0 0 0 14 0M12 17v4m-4 0h8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 4: // Networking — Connected people / nodes
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
          <circle cx="12" cy="5" r="2.5" stroke="currentColor" strokeWidth="2" />
          <circle cx="5" cy="18" r="2.5" stroke="currentColor" strokeWidth="2" />
          <circle cx="19" cy="18" r="2.5" stroke="currentColor" strokeWidth="2" />
          <path
            d="M10.5 7.2 6.3 15.8m7.2-8.6 4.2 8.6M7.5 18h9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    default: // Community — Ecosystem group
      return (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
          <circle cx="9" cy="7.5" r="3.2" stroke="currentColor" strokeWidth="2" />
          <path
            d="M3 19.5c0-3.1 2.7-5.5 6-5.5s6 2.4 6 5.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="17" cy="8.5" r="2.5" stroke="currentColor" strokeWidth="2" />
          <path
            d="M16 14.5c2.7 0 5 2 5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

const EXPECT_CARDS = siteConfig.whatYoullGet.map((item, idx) => ({
  item,
  photoSrc: item.image ?? "/archive/2025-full-house.webp",
  accent: CARD_ACCENTS[idx % CARD_ACCENTS.length],
}));

/**
 * STAGE 2 — SECTION 2: WHAT TO EXPECT AT DEVFEST?
 *
 * A visually rich horizontal showcase containing six large rounded cards with
 * photographic backgrounds, distinct Google-inspired accent colours, large
 * readable titles, supporting descriptions, distinctive icons, and hover
 * interactions.
 *
 * - Desktop (`lg` and above): GSAP ScrollTrigger horizontal scroll scrub +
 *   interactive left/right navigation buttons and pagination indicators.
 * - Mobile (`< lg`) & static baseline: touch-friendly horizontal scroll
 *   container (`snap-x snap-mandatory`) + interactive navigation controls.
 *
 * Carries `id="after-hero"` (used by the skip link and hero escape target).
 */
export function ExpectShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  const { lenisRef } = useMotion();
  const skipMotion = useClientValue(prefersReducedMotion, false);
  const staticBaseline = useClientValue(shouldUseStaticBaseline, false);

  const [activeIndex, setActiveIndex] = useState(0);
  const cardCount = EXPECT_CARDS.length;

  // Keep activeIndex in sync when swiping on mobile / touch container
  const handleMobileScroll = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport || window.innerWidth >= 1024) return;
    const maxScroll = Math.max(1, viewport.scrollWidth - viewport.clientWidth);
    const ratio = Math.min(1, Math.max(0, viewport.scrollLeft / maxScroll));
    const idx = Math.round(ratio * (cardCount - 1));
    setActiveIndex(idx);
  }, [cardCount]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.addEventListener("scroll", handleMobileScroll, { passive: true });
    return () => viewport.removeEventListener("scroll", handleMobileScroll);
  }, [handleMobileScroll]);

  // Navigate to a specific card index via arrow buttons or dots
  const scrollToCard = useCallback(
    (targetIndex: number) => {
      const clamped = Math.min(cardCount - 1, Math.max(0, targetIndex));
      setActiveIndex(clamped);

      // Desktop with active GSAP ScrollTrigger pin
      const trigger = triggerRef.current;
      if (trigger && window.innerWidth >= 1024 && !staticBaseline && !skipMotion) {
        const progress = cardCount > 1 ? clamped / (cardCount - 1) : 0;
        const targetY = trigger.start + progress * (trigger.end - trigger.start);
        if (lenisRef.current) {
          lenisRef.current.scrollTo(targetY, { duration: 0.55 });
        } else {
          window.scrollTo({ top: targetY, behavior: "smooth" });
        }
        return;
      }

      // Mobile / tablet or static baseline horizontal scroll container
      const viewport = viewportRef.current;
      const cardEl = cardRefs.current[clamped];
      if (viewport && cardEl) {
        const targetLeft =
          cardEl.offsetLeft - Math.max(0, (viewport.clientWidth - cardEl.offsetWidth) / 2);
        viewport.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
      }
    },
    [cardCount, lenisRef, skipMotion, staticBaseline],
  );

  useGSAP(
    () => {
      if (skipMotion || staticBaseline || !sectionRef.current) return;

      const mm = gsap.matchMedia();

      // Entrance reveal for heading and cards on all viewports
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { y: 26, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.65,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 82%",
              once: true,
            },
          },
        );
      }

      const cards = cardRefs.current.filter((el): el is HTMLElement => el !== null);
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 36, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.65,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 78%",
              once: true,
            },
          },
        );
      }

      // Desktop horizontal scroll scrub with GSAP ScrollTrigger
      mm.add("(min-width: 1024px)", () => {
        const stage = stageRef.current;
        const viewport = viewportRef.current;
        const track = trackRef.current;
        if (!stage || !viewport || !track) return;

        const getDistance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
        const getPinRange = () => Math.max(420, getDistance() * 1.15);

        const tween = gsap.fromTo(
          track,
          { x: 0 },
          {
            x: () => -getDistance(),
            ease: "none",
            scrollTrigger: {
              trigger: stage,
              start: "top top",
              end: () => `+=${getPinRange()}`,
              scrub: 0.4,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              refreshPriority: 1,
              onUpdate: (self) => {
                const idx = Math.min(
                  cardCount - 1,
                  Math.max(0, Math.round(self.progress * (cardCount - 1))),
                );
                setActiveIndex(idx);
              },
            },
          },
        );

        const st = tween.scrollTrigger ?? null;
        triggerRef.current = st;

        let unregisterCue: (() => void) | undefined;
        if (st) {
          unregisterCue = setHorizontalCue({
            el: stage,
            cardCount,
            minIndex: 0,
            activeIndex: () =>
              Math.min(cardCount - 1, Math.max(0, Math.round(st.progress * (cardCount - 1)))),
            scrollYForCard: (index) => {
              const clamped = Math.min(cardCount - 1, Math.max(0, index));
              const progress = cardCount > 1 ? clamped / (cardCount - 1) : 0;
              return st.start + progress * (st.end - st.start);
            },
          });
        }

        return () => {
          triggerRef.current = null;
          unregisterCue?.();
          tween.kill();
          gsap.set(track, { clearProps: "transform" });
        };
      });

      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef, dependencies: [skipMotion, staticBaseline, cardCount] },
  );

  const canPrev = activeIndex > 0;
  const canNext = activeIndex < cardCount - 1;

  return (
    <section
      id="after-hero"
      ref={sectionRef}
      aria-labelledby="expect-devfest-heading"
      className="relative overflow-hidden border-b border-white/15 bg-[#080C1B] text-white"
    >
      {/* Ambient lighting & subtle backdrop depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 22% 28%, rgba(66, 133, 244, 0.14) 0%, transparent 45%), radial-gradient(circle at 78% 72%, rgba(251, 188, 4, 0.12) 0%, transparent 48%), #080C1B",
        }}
      />

      {/* Decorative bottom corner Google-coloured waves matching the visual reference */}
      <svg
        viewBox="0 0 380 95"
        fill="none"
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 z-10 h-12 w-48 opacity-90 sm:h-16 sm:w-72"
        preserveAspectRatio="none"
      >
        <path d="M0 24C68 18 132 45 186 95H0V24Z" fill="#EA4335" />
        <path d="M110 95C168 50 258 46 365 95H110Z" fill="#4285F4" />
      </svg>

      <svg
        viewBox="0 0 280 90"
        fill="none"
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 z-10 h-12 w-44 opacity-90 sm:h-16 sm:w-64"
        preserveAspectRatio="none"
      >
        <path d="M280 18C190 22 110 52 30 90H280V18Z" fill="#FBBC04" />
      </svg>

      <div
        ref={stageRef}
        className="relative z-20 flex min-h-[680px] flex-col justify-center pt-20 pb-16 sm:pt-24 sm:pb-20 lg:min-h-screen lg:pt-24 lg:pb-10"
      >
        <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-14">
          {/* Section Header */}
          <div ref={headingRef} className="flex flex-col items-center text-center">
            <h2
              id="expect-devfest-heading"
              className="text-[32px] font-extrabold leading-[1.08] tracking-[-0.025em] text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.45)] sm:text-[44px] lg:text-[50px]"
            >
              {uiCopy.expectShowcase.heading}
            </h2>
          </div>

          {/* Horizontal Showcase Area with Left / Right Controls */}
          <div className="relative mt-8 sm:mt-10">
            {/* Left Floating Arrow Button */}
            <button
              type="button"
              onClick={() => scrollToCard(activeIndex - 1)}
              disabled={!canPrev}
              aria-label={uiCopy.expectShowcase.previousCardSr}
              className={`absolute -left-2 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-[#080C1B]/85 text-white shadow-[0_8px_24px_rgba(0,0,0,0.55)] backdrop-blur-md transition-all duration-200 sm:inline-flex lg:-left-5 ${
                canPrev
                  ? "hover:scale-105 hover:border-white hover:bg-white/15 cursor-pointer"
                  : "opacity-35 cursor-not-allowed"
              }`}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
                <path
                  d="m15 18-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Right Floating Arrow Button */}
            <button
              type="button"
              onClick={() => scrollToCard(activeIndex + 1)}
              disabled={!canNext}
              aria-label={uiCopy.expectShowcase.nextCardSr}
              className={`absolute -right-2 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-[#080C1B]/85 text-white shadow-[0_8px_24px_rgba(0,0,0,0.55)] backdrop-blur-md transition-all duration-200 sm:inline-flex lg:-right-5 ${
                canNext
                  ? "hover:scale-105 hover:border-white hover:bg-white/15 cursor-pointer"
                  : "opacity-35 cursor-not-allowed"
              }`}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
                <path
                  d="m9 18 6-6-6-6"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Cards Viewport:
                - On mobile (<1024px) or static baseline: touch-friendly horizontal scroll with snap
                - On desktop (>=1024px) with motion: overflow-hidden stage scrubbed by GSAP ScrollTrigger */}
            <div
              ref={viewportRef}
              className={`-mx-6 px-6 py-4 sm:-mx-2 sm:px-2 ${
                staticBaseline
                  ? "overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  : "overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:overflow-visible lg:snap-none"
              }`}
            >
              <div
                ref={trackRef}
                className="flex w-max items-stretch gap-5 sm:gap-6 lg:gap-7"
              >
                {EXPECT_CARDS.map(({ item, photoSrc, accent }, cardIndex) => (
                  <article
                    key={item.title}
                    ref={(el) => {
                      cardRefs.current[cardIndex] = el;
                    }}
                    className={`group relative flex h-[410px] w-[278px] shrink-0 snap-center flex-col justify-between overflow-hidden rounded-[28px] border-2 ${accent.borderClass} ${accent.hoverBorderClass} bg-[#0D1428] transition-all duration-300 ease-out hover:-translate-y-2.5 sm:h-[430px] sm:w-[300px] sm:snap-start lg:h-[435px] lg:w-[315px]`}
                    style={{
                      boxShadow: `0 20px 44px -14px rgba(0, 0, 0, 0.7), 0 0 28px -10px ${accent.glowColor}`,
                    }}
                  >
                    {/* Top Google-coloured accent bar */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-0 z-30 h-1.5 opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                      style={{ backgroundColor: accent.topBarColor }}
                    />

                    {/* Full-card photographic background */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                      <Image
                        src={photoSrc}
                        alt={item.title}
                        fill
                        preload={cardIndex < 3}
                        fetchPriority={cardIndex < 2 ? "high" : "low"}
                        decoding="async"
                        sizes="(min-width: 1024px) 320px, (min-width: 640px) 300px, 280px"
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      {/* Google-inspired colour gradient overlay */}
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 transition-opacity duration-300"
                        style={{ background: accent.gradientStyle }}
                      />
                    </div>

                    {/* Upper framed photographic window for crisp visual depth */}
                    <div className="relative z-10 m-3.5 mb-0 h-[46%] overflow-hidden rounded-2xl border border-white/20 shadow-inner">
                      <Image
                        src={photoSrc}
                        alt=""
                        aria-hidden="true"
                        fill
                        decoding="async"
                        sizes="(min-width: 1024px) 300px, 260px"
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15"
                      />
                      {/* Subtle category number pill in top-right of photo */}
                      <span className="absolute right-3 top-3 rounded-full border border-white/25 bg-black/55 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                        {accent.badgeLabel}
                      </span>
                    </div>

                    {/* Lower Card Content: Distinctive Icon, Large Readable Title, Supporting Description */}
                    <div className="relative z-20 flex flex-1 flex-col justify-between p-6 pt-4 sm:p-7 sm:pt-5">
                      {/* Distinctive Icon Badge */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border ${accent.iconBgClass} shadow-md backdrop-blur-md transition-transform duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-[#080C1B]`}
                        >
                          <ExpectCardIcon index={cardIndex} />
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div className="mt-3">
                        <h3 className="text-2xl font-extrabold leading-[1.12] tracking-tight text-white drop-shadow-sm sm:text-[26px]">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm font-medium leading-[1.48] text-white/90 sm:text-[15px]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Bottom Controls & Pagination Indicators (touch-friendly on mobile + desktop) */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => scrollToCard(activeIndex - 1)}
                disabled={!canPrev}
                aria-label={uiCopy.expectShowcase.previousCardSr}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-all sm:hidden ${
                  canPrev ? "active:scale-95" : "opacity-35"
                }`}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                  <path
                    d="m15 18-6-6 6-6"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div
                className="flex items-center gap-2.5"
                role="tablist"
                aria-label="What to expect at DevFest cards"
              >
                {EXPECT_CARDS.map(({ item, accent }, i) => {
                  const isActive = i === activeIndex;
                  return (
                    <button
                      key={item.title}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-label={item.title}
                      onClick={() => scrollToCard(i)}
                      className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                        isActive
                          ? `w-8 ${accent.dotActiveClass}`
                          : "w-2.5 bg-white/30 hover:bg-white/55"
                      }`}
                    />
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => scrollToCard(activeIndex + 1)}
                disabled={!canNext}
                aria-label={uiCopy.expectShowcase.nextCardSr}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-all sm:hidden ${
                  canNext ? "active:scale-95" : "opacity-35"
                }`}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                  <path
                    d="m9 18 6-6-6-6"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
