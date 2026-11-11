"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion, shouldUseStaticBaseline } from "@/lib/motion-prefs";
import { useClientValue } from "@/lib/useClientValue";
import { uiCopy } from "@/site.config";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * STAGE 2 — SECTION 1: READY FOR DEVFEST MADURAI?
 *
 * Immediately follows the Hero with a deep navy/charcoal stage, large white
 * typography, yellow Google-coloured spark accents, a wide cinematic photograph
 * featuring enthusiastic developers and technology community attendees, soft
 * lighting, rounded photographic edges, and subtle GSAP scroll-triggered
 * entrance animations.
 */
export function ReadySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const sparkRef = useRef<SVGSVGElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const photoCardRef = useRef<HTMLDivElement>(null);
  const photoInnerRef = useRef<HTMLDivElement>(null);

  const skipMotion = useClientValue(prefersReducedMotion, false);
  const staticBaseline = useClientValue(shouldUseStaticBaseline, false);

  useGSAP(
    () => {
      if (skipMotion || staticBaseline || !sectionRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 82%",
          once: true,
        },
      });

      if (eyebrowRef.current) {
        tl.fromTo(
          eyebrowRef.current,
          { y: 18, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.55, ease: "power3.out" },
          0,
        );
      }

      if (headingRef.current) {
        const lines = headingRef.current.querySelectorAll("[data-ready-line]");
        tl.fromTo(
          lines,
          { y: 28, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.65,
            stagger: 0.12,
            ease: "power3.out",
          },
          0.08,
        );
      }

      if (sparkRef.current) {
        tl.fromTo(
          sparkRef.current,
          { scale: 0.35, autoAlpha: 0, transformOrigin: "left bottom" },
          {
            scale: 1,
            autoAlpha: 1,
            duration: 0.55,
            ease: "back.out(2.2)",
          },
          0.32,
        );
      }

      if (copyRef.current) {
        tl.fromTo(
          copyRef.current,
          { y: 22, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out" },
          0.22,
        );
      }

      if (photoCardRef.current) {
        tl.fromTo(
          photoCardRef.current,
          { y: 32, scale: 0.96, autoAlpha: 0 },
          {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.75,
            ease: "power3.out",
          },
          0.14,
        );
      }

      if (photoInnerRef.current) {
        gsap.fromTo(
          photoInnerRef.current,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
    },
    { scope: sectionRef, dependencies: [skipMotion, staticBaseline] },
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="ready-devfest-heading"
      className="relative overflow-hidden border-b border-white/15 bg-[#080C1B] py-16 sm:py-20 lg:py-24"
    >
      {/* Soft ambient lighting & subtle depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 72% 50%, rgba(66, 133, 244, 0.16) 0%, rgba(249, 171, 0, 0.1) 28%, rgba(12, 18, 38, 0.92) 62%, #080C1B 85%)",
        }}
      />

      {/* Subtle top-left and bottom-left Google-coloured geometric wave accents */}
      <svg
        viewBox="0 0 260 90"
        fill="none"
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 z-10 h-14 w-44 opacity-90 sm:h-20 sm:w-60"
        preserveAspectRatio="none"
      >
        <path d="M0 18C52 18 98 46 135 90H0V18Z" fill="#EA4335" />
        <path d="M0 52C74 44 152 62 240 90H0V52Z" fill="#34A853" />
      </svg>

      <div className="relative z-20 mx-auto w-full max-w-[1400px] px-6 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Eyebrow, Heading with Yellow Spark Rays, Supporting Copy */}
          <div className="flex flex-col items-start text-left lg:col-span-5">
            {/* Eyebrow: GET READY */}
            <div
              ref={eyebrowRef}
              className="inline-flex items-center gap-2.5 rounded-full border border-yellow/35 bg-yellow/10 px-4 py-1.5 backdrop-blur-sm"
            >
              <span className="h-2 w-2 rounded-full bg-yellow shadow-[0_0_10px_#FBBC04]" />
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-yellow sm:text-[13px]">
                {uiCopy.readySection.eyebrow}
              </span>
            </div>

            {/* Heading: "Ready for DevFest Madurai?" + Yellow Google-coloured spark accents */}
            <h2
              id="ready-devfest-heading"
              ref={headingRef}
              className="mt-5 flex flex-col font-extrabold italic leading-[1.05] tracking-[-0.025em] text-white text-[31px] sm:text-[48px] lg:text-[54px]"
            >
              <span data-ready-line className="block drop-shadow-[0_4px_20px_rgba(0,0,0,0.45)]">
                Ready for
              </span>
              <span
                data-ready-line
                className="relative mt-1 inline-flex items-center whitespace-nowrap drop-shadow-[0_4px_20px_rgba(0,0,0,0.45)]"
              >
                <span>DevFest Madurai?</span>
                <svg
                  ref={sparkRef}
                  viewBox="0 0 56 52"
                  fill="none"
                  aria-hidden="true"
                  className="-mt-5 ml-1.5 h-8 w-9 shrink-0 sm:-mt-7 sm:h-11 sm:w-12"
                >
                  <line
                    x1="8"
                    y1="24"
                    x2="22"
                    y2="4"
                    stroke="#FBBC04"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="16"
                    y1="34"
                    x2="42"
                    y2="18"
                    stroke="#FBBC04"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="20"
                    y1="44"
                    x2="48"
                    y2="42"
                    stroke="#FBBC04"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>

            {/* Supporting text (One-day event messaging) */}
            <p
              ref={copyRef}
              className="mt-5 max-w-lg text-base font-normal leading-[1.55] text-white/85 sm:text-lg lg:text-[20px]"
            >
              {uiCopy.readySection.supportingText}
            </p>
          </div>

          {/* Right Column: Wide Cinematic Photograph of Enthusiastic Developers & Community */}
          <div className="lg:col-span-7">
            <div
              ref={photoCardRef}
              className="group relative overflow-hidden rounded-2xl border border-white/15 bg-[#0D132A] shadow-[0_24px_64px_rgba(0,0,0,0.65)] sm:rounded-3xl"
            >
              {/* Soft warm & blue rim glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-1 z-0 rounded-3xl opacity-45 blur-2xl transition-opacity duration-500 group-hover:opacity-70"
                style={{
                  background:
                    "linear-gradient(125deg, rgba(66,133,244,0.45) 0%, rgba(251,188,4,0.35) 55%, rgba(52,168,83,0.35) 100%)",
                }}
              />

              <div className="relative z-10 aspect-[16/9] w-full overflow-hidden rounded-2xl sm:aspect-[16/8.5] sm:rounded-3xl">
                <div ref={photoInnerRef} className="absolute -inset-y-4 inset-x-0">
                  <Image
                    src="/archive/2025-attend.webp"
                    alt="Enthusiastic developers and technology community attendees at DevFest"
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>

                {/* Soft atmospheric lighting & edge depth vignettes */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#080C1B]/75 via-[#080C1B]/15 to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080C1B]/80 via-transparent to-[#080C1B]/20"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 82% 24%, rgba(251, 188, 4, 0.22) 0%, transparent 50%)",
                  }}
                />

                {/* Bottom overlay community highlight badge */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 sm:bottom-5 sm:left-6 sm:right-6">
                  <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-[#080C1B]/75 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md sm:text-sm">
                    <span className="h-2 w-2 rounded-full bg-yellow" />
                    <span>12 December 2026 · Madurai Developer Community</span>
                  </div>

                  <div className="hidden items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-medium text-white/90 backdrop-blur-md sm:inline-flex">
                    <span className="h-2 w-2 rounded-full bg-blue" />
                    <span className="h-2 w-2 rounded-full bg-red" />
                    <span className="h-2 w-2 rounded-full bg-yellow" />
                    <span className="h-2 w-2 rounded-full bg-green" />
                    <span className="ml-1">GDG Madurai</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
