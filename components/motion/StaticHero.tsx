"use client";

import { useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { heroCopy } from "@/components/motion/HeroCopy";

const MaduraiHero3DBrackets = dynamic(
  () => import("./MaduraiHero3DBrackets").then((m) => ({ default: m.MaduraiHero3DBrackets })),
  { ssr: false },
);

export function StaticHero({
  offerFullExperience = false,
  enable3D = true,
}: {
  offerFullExperience?: boolean;
  enable3D?: boolean;
}) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      document.documentElement.classList.add("boot-done");
    }, 900);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="relative flex min-h-[100dvh] w-full flex-col justify-center overflow-hidden border-b border-white/20 bg-[#080C1B] pt-24 pb-20 lg:pt-28 lg:pb-24">
      {/* Subtle unsharp-mask filter to keep the Meenakshi Temple gopurams crisp on large displays */}
      <svg width="0" height="0" className="pointer-events-none absolute" aria-hidden="true">
        <defs>
          <filter id="madurai-temple-sharpen">
            <feConvolveMatrix
              order="3"
              preserveAlpha="true"
              kernelMatrix="0 -0.45 0 -0.45 2.8 -0.45 0 -0.45 0"
            />
          </filter>
        </defs>
      </svg>

      {/* 1. Base dark navy & twilight sky atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 75% 62%, rgba(218, 106, 78, 0.22) 0%, rgba(122, 54, 102, 0.2) 28%, rgba(26, 24, 62, 0.42) 54%, rgba(8, 12, 27, 0.92) 88%)",
        }}
      />

      {/* 2. Madurai temple interior backdrop (lower-right) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-[78%] w-full sm:w-[88%] lg:h-[80%] lg:w-[72%]"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.55) 10%, black 22%), linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.62) 8%, black 18%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.55) 10%, black 22%), linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.62) 8%, black 18%)",
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      >
        <div className="relative h-full w-full overflow-hidden">
          {/* The supplied temple image is softly masked into the navy hero. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/world/madurai-temple-hero.jpg"
            alt=""
            className="absolute left-0 w-full max-w-none select-none object-cover"
            style={{
              top: "-2%",
              height: "108%",
              objectPosition: "center center",
              filter: "url(#madurai-temple-sharpen) brightness(1.14) contrast(1.1) saturate(1.12)",
            }}
          />
        </div>
      </div>

      {/* 3. Ambient colour glow behind the 3D Glass Brackets */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[8%] top-[8%] h-[320px] w-[460px] rounded-full opacity-50 blur-[85px]"
        style={{
          background:
            "conic-gradient(from 205deg at 50% 50%, #4285F4 0deg, #EA4335 95deg, #FBBC04 195deg, #34A853 295deg, #4285F4 360deg)",
        }}
      />

      {/* 4. Hero Content & Three.js 3D Translucent Glass Brackets */}
      <div className="relative z-20 mx-auto flex w-full max-w-[1400px] flex-col px-6 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
          {/* Left Column: Typography, Metadata & CTAs */}
          <div className="relative z-30 flex flex-col items-start text-left lg:col-span-6">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/90 sm:text-[15px]">
              GDG MADURAI PRESENTS
            </p>

            <h1 className="mt-3 flex flex-col font-extrabold italic leading-[0.94] tracking-[-0.03em] text-[58px] sm:text-[78px] lg:text-[92px]">
              {/* Line 1: DevFest + 3 yellow spark rays */}
              <span className="relative inline-flex items-center text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.45)]">
                <span>DevFest</span>
                <svg
                  viewBox="0 0 60 56"
                  fill="none"
                  aria-hidden="true"
                  className="-mt-8 ml-2 h-11 w-12 shrink-0 sm:-mt-10 sm:h-14 sm:w-14"
                >
                  <line
                    x1="10"
                    y1="26"
                    x2="24"
                    y2="4"
                    stroke="#FBBC04"
                    strokeWidth="5.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="20"
                    y1="36"
                    x2="46"
                    y2="20"
                    stroke="#FBBC04"
                    strokeWidth="5.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="24"
                    y1="47"
                    x2="54"
                    y2="45"
                    stroke="#FBBC04"
                    strokeWidth="5.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>

              {/* Line 2: Madurai in Google brand colours (M=Blue, ad=Red, ur=Yellow, ai=Green) */}
              <span
                className="mt-1 inline-flex tracking-[-0.03em] drop-shadow-[0_6px_24px_rgba(0,0,0,0.45)]"
                aria-label="Madurai"
              >
                <span className="text-[#4285F4]">M</span>
                <span className="text-[#EA4335]">a</span>
                <span className="text-[#EA4335]">d</span>
                <span className="text-[#FBBC04]">u</span>
                <span className="text-[#FBBC04]">r</span>
                <span className="text-[#34A853]">a</span>
                <span className="text-[#34A853]">i</span>
              </span>
            </h1>

            <p className="mt-5 max-w-md text-lg font-normal leading-[1.36] text-white/95 sm:text-[23px]">
              Madurai’s biggest tech festival
              <br />
              by Google Developer Groups
            </p>

            {/* Event Metadata Row: 12 December 2026 & Venue To be announced */}
            <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm font-medium text-white sm:text-[16px]">
              <div className="inline-flex items-center gap-2.5">
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  aria-hidden="true"
                  className="text-white/90"
                >
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="17"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M8 2.5v3M16 2.5v3M3 9.5h18"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
                <span>12 December 2026</span>
              </div>

              <div className="inline-flex items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  aria-hidden="true"
                  className="text-white/90"
                >
                  <path
                    d="M12 21s-6.5-5.8-6.5-11A6.5 6.5 0 1 1 18.5 10c0 5.2-6.5 11-6.5 11Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <circle cx="12" cy="10" r="2.3" stroke="currentColor" strokeWidth="1.8" />
                </svg>
                <span>To be announced · Madurai, Tamil Nadu</span>
              </div>
            </div>

            {/* Action Buttons: [Get tickets ↗] and [See agenda] */}
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a
                href={heroCopy.ticket.href}
                target={heroCopy.ticket.external ? "_blank" : undefined}
                rel={heroCopy.ticket.external ? "noreferrer" : undefined}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-bold text-[#0A0E1A] shadow-[0_8px_28px_rgba(0,0,0,0.4)] transition-transform hover:scale-[1.02] hover:bg-white/95"
              >
                <span>{heroCopy.ticket.label.replace(" →", "")}</span>
                <span aria-hidden="true" className="text-sm font-bold">
                  ↗
                </span>
              </a>

              <Link
                href="/agenda"
                className="inline-flex items-center justify-center rounded-full border border-white/65 bg-white/[0.08] px-9 py-3.5 text-base font-medium text-white backdrop-blur-md transition-colors hover:border-white hover:bg-white/[0.16]"
              >
                See agenda
              </Link>
            </div>

            {offerFullExperience && (
              <p className="mt-4 text-xs text-white/60">
                <a href="?lite=0" className="underline hover:text-white">
                  Switch to full 3D motion experience
                </a>
              </p>
            )}
          </div>

          {/* Right Column: Interactive Three.js 3D Translucent Glass Brackets positioned above the temple towers */}
          <div className="relative z-20 flex h-[300px] w-full items-start justify-center sm:h-[360px] lg:col-span-6 lg:h-[440px]">
            {enable3D ? (
              <MaduraiHero3DBrackets className="h-[340px] w-full sm:h-[390px] lg:-mt-16 lg:h-[440px] lg:scale-105" />
            ) : null}
          </div>
        </div>
      </div>

      {/* 5. Bottom-Left Yellow & Blue Geometric Corner Waves (matching mockup reference) */}
      <svg
        viewBox="0 0 460 150"
        fill="none"
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 z-20 h-[85px] w-[260px] sm:h-[125px] sm:w-[390px]"
        preserveAspectRatio="none"
      >
        {/* Top-left Yellow wedge */}
        <path d="M0 0C55 22 105 58 148 110L0 110Z" fill="#FBBC04" />
        {/* Bottom sweeping Blue wave */}
        <path d="M0 58C115 48 245 86 450 150L0 150Z" fill="#1A73E8" />
      </svg>

      {/* 6. Bottom-Right Red Geometric Corner Wave aligned seamlessly */}
      <svg
        viewBox="0 0 440 130"
        fill="none"
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 z-20 h-[82px] w-[250px] sm:h-[118px] sm:w-[400px]"
        preserveAspectRatio="none"
      >
        <path d="M440 8C305 38 175 85 0 130L440 130Z" fill="#EA4335" />
      </svg>
    </section>
  );
}
