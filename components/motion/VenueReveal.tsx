"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RollingText } from "@/components/motion/RollingText";
import { ticketCta } from "@/lib/cta";
import { prefersReducedMotion, shouldUseStaticBaseline } from "@/lib/motion-prefs";
import { useClientValue } from "@/lib/useClientValue";
import { siteConfig, uiCopy } from "@/site.config";

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin);

const FLOATING_PARTICLES = [
  { left: "8%", top: "14%", size: 4, color: "#FBBC04", delay: 0 },
  { left: "18%", top: "28%", size: 3, color: "#4285F4", delay: 0.4 },
  { left: "29%", top: "12%", size: 3.5, color: "#FBBC04", delay: 0.9 },
  { left: "44%", top: "18%", size: 3, color: "#EA4335", delay: 1.3 },
  { left: "58%", top: "10%", size: 4, color: "#FBBC04", delay: 0.6 },
  { left: "71%", top: "22%", size: 3, color: "#34A853", delay: 1.1 },
  { left: "84%", top: "16%", size: 3.5, color: "#4285F4", delay: 0.2 },
  { left: "91%", top: "34%", size: 3, color: "#FBBC04", delay: 1.5 },
  { left: "14%", top: "62%", size: 3, color: "#34A853", delay: 0.8 },
  { left: "87%", top: "68%", size: 4, color: "#EA4335", delay: 1.2 },
] as const;

const GOPURAM_TIERS = [
  { y: 120, halfW: 54, h: 18, windows: 3, accent: "#FBBC04" },
  { y: 142, halfW: 62, h: 19, windows: 3, accent: "#4285F4" },
  { y: 165, halfW: 70, h: 20, windows: 5, accent: "#EA4335" },
  { y: 189, halfW: 79, h: 21, windows: 5, accent: "#34A853" },
  { y: 214, halfW: 88, h: 22, windows: 5, accent: "#FBBC04" },
  { y: 240, halfW: 98, h: 23, windows: 7, accent: "#4285F4" },
  { y: 267, halfW: 109, h: 24, windows: 7, accent: "#EA4335" },
  { y: 295, halfW: 120, h: 25, windows: 9, accent: "#34A853" },
  { y: 324, halfW: 132, h: 28, windows: 9, accent: "#FBBC04" },
] as const;

const SIDE_GOPURAM_TIERS = [
  { y: 212, halfW: 28, h: 14 },
  { y: 230, halfW: 34, h: 15 },
  { y: 249, halfW: 40, h: 16 },
  { y: 269, halfW: 46, h: 17 },
  { y: 290, halfW: 53, h: 18 },
  { y: 312, halfW: 60, h: 20 },
] as const;

/**
 * Detailed architectural SVG illustration inspired by the Meenakshi Amman Temple
 * in Madurai: central 9-tier Raja Gopuram crowned with 7 golden Kalasams and
 * Kirtimukha sala-sikhara vault, flanking West & North Gopurams in perspective
 * depth, Ayiram Kaal Mandapam pillared colonnades, and the stepped Potramarai
 * Kulam (Golden Lotus Tank) in the foreground.
 */
function MeenakshiArchitecturalSvg({
  svgRef,
}: {
  svgRef: React.RefObject<SVGSVGElement | null>;
}) {
  const cx = 600;
  const leftTowerCx = 210;
  const rightTowerCx = 990;

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1200 500"
      fill="none"
      role="img"
      aria-label="Detailed architectural line-art illustration of the Meenakshi Amman Temple gopurams, pillared mandapams, and Golden Lotus Tank in Madurai"
      className="h-auto w-full select-none"
    >
      <defs>
        <linearGradient id="meenakshi-gold-stroke" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBBC04" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#4285F4" stopOpacity="0.82" />
        </linearGradient>
        <linearGradient id="meenakshi-side-stroke" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.38" />
        </linearGradient>
        <radialGradient id="meenakshi-sanctum-glow" cx="50%" cy="46%" r="45%">
          <stop offset="0%" stopColor="#FBBC04" stopOpacity="0.24" />
          <stop offset="48%" stopColor="#4285F4" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#080C1B" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient temple sanctum radial aura */}
      <ellipse cx={cx} cy="250" rx="460" ry="210" fill="url(#meenakshi-sanctum-glow)" />

      {/* Subtle architectural blueprint elevation grid & sacred geometry arcs */}
      <g opacity="0.28">
        <circle
          data-arch-stroke
          cx={cx}
          cy="352"
          r="310"
          stroke="#4285F4"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
        <circle
          data-arch-stroke
          cx={cx}
          cy="352"
          r="225"
          stroke="#FBBC04"
          strokeWidth="1"
          strokeDasharray="3 5"
        />
        <line
          data-arch-stroke
          x1={cx}
          y1="26"
          x2={cx}
          y2="474"
          stroke="#FBBC04"
          strokeWidth="0.9"
          strokeDasharray="3 5"
        />
        <line
          data-arch-stroke
          x1="40"
          y1="352"
          x2="1160"
          y2="352"
          stroke="#FFFFFF"
          strokeWidth="1.2"
        />
      </g>

      {/* ================= DISTANT FLANKING GOPURAMS (WEST & NORTH TOWERS) ================= */}
      {[leftTowerCx, rightTowerCx].map((towerX, idx) => {
        const accentColor = idx === 0 ? "#4285F4" : "#34A853";
        return (
          <g key={towerX} opacity="0.72">
            {/* Sala Sikhara Barrel Roof */}
            <path
              data-arch-stroke
              d={`M ${towerX - 26} 212 Q ${towerX - 22} 194 ${towerX} 194 Q ${towerX + 22} 194 ${towerX + 26} 212 Z`}
              stroke={accentColor}
              strokeWidth="1.4"
            />
            {/* 5 Kalasam finials on flanking tower */}
            {[-16, -8, 0, 8, 16].map((offset) => (
              <path
                key={offset}
                data-arch-stroke
                d={`M ${towerX + offset} 194 L ${towerX + offset} 182 M ${towerX + offset - 2} 188 L ${towerX + offset + 2} 188`}
                stroke="#FBBC04"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            ))}
            {/* Sculpted tiers of flanking gopuram */}
            {SIDE_GOPURAM_TIERS.map((tier, tIdx) => (
              <g key={tier.y}>
                <rect
                  data-arch-stroke
                  x={towerX - tier.halfW}
                  y={tier.y}
                  width={tier.halfW * 2}
                  height={tier.h}
                  rx="1.5"
                  stroke="url(#meenakshi-side-stroke)"
                  strokeWidth="1.25"
                />
                {/* Central Kudu dormer arch on each tier */}
                <path
                  data-arch-stroke
                  d={`M ${towerX - 7} ${tier.y + tier.h} L ${towerX - 7} ${tier.y + 5} Q ${towerX} ${tier.y + 1} ${towerX + 7} ${tier.y + 5} L ${towerX + 7} ${tier.y + tier.h}`}
                  stroke={tIdx % 2 === 0 ? "#FBBC04" : accentColor}
                  strokeWidth="1.1"
                />
                {/* Pilaster niches */}
                {[-tier.halfW + 10, -tier.halfW + 22, tier.halfW - 22, tier.halfW - 10].map(
                  (px) => (
                    <line
                      key={px}
                      data-arch-stroke
                      x1={towerX + px}
                      y1={tier.y + 3}
                      x2={towerX + px}
                      y2={tier.y + tier.h - 2}
                      stroke="#FFFFFF"
                      strokeOpacity="0.45"
                      strokeWidth="1"
                    />
                  ),
                )}
              </g>
            ))}
            {/* Flanking tower stone base (Adhisthana) */}
            <rect
              data-arch-stroke
              x={towerX - 64}
              y="332"
              width="128"
              height="20"
              stroke="#FFFFFF"
              strokeOpacity="0.65"
              strokeWidth="1.3"
            />
          </g>
        );
      })}

      {/* ================= AYIRAM KAAL MANDAPAM (PILLARED CORRIDORS) ================= */}
      {[
        { startX: 274, endX: 462, side: "left" },
        { startX: 738, endX: 926, side: "right" },
      ].map((wing) => (
        <g key={wing.side}>
          {/* Upper entablature (Prastara & Kapota cornice) */}
          <rect
            data-arch-stroke
            x={wing.startX}
            y="296"
            width={wing.endX - wing.startX}
            height="10"
            stroke="#FBBC04"
            strokeOpacity="0.8"
            strokeWidth="1.3"
          />
          <rect
            data-arch-stroke
            x={wing.startX - 4}
            y="306"
            width={wing.endX - wing.startX + 8}
            height="8"
            stroke="#4285F4"
            strokeOpacity="0.75"
            strokeWidth="1.2"
          />
          {/* Carved Mandapam Pillars & Cusped Dravidian Arches */}
          {[0, 1, 2, 3, 4, 5].map((col) => {
            const bayW = (wing.endX - wing.startX) / 6;
            const x1 = wing.startX + col * bayW;
            const x2 = x1 + bayW;
            const mid = (x1 + x2) / 2;
            return (
              <g key={col}>
                {/* Pillar shaft */}
                <line
                  data-arch-stroke
                  x1={x1}
                  y1="314"
                  x2={x1}
                  y2="352"
                  stroke="#FFFFFF"
                  strokeOpacity="0.78"
                  strokeWidth="1.8"
                />
                {/* Yali capital bracket */}
                <path
                  data-arch-stroke
                  d={`M ${x1 - 5} 314 L ${x1 + 5} 314 L ${x1 + 3} 320 L ${x1 - 3} 320 Z`}
                  stroke="#FBBC04"
                  strokeWidth="1"
                />
                {/* Ornate arch between pillars */}
                <path
                  data-arch-stroke
                  d={`M ${x1 + 2} 330 Q ${mid} 316 ${x2 - 2} 330`}
                  stroke={col % 2 === 0 ? "#4285F4" : "#EA4335"}
                  strokeWidth="1.2"
                />
              </g>
            );
          })}
          {/* Closing outer pillar */}
          <line
            data-arch-stroke
            x1={wing.endX}
            y1="314"
            x2={wing.endX}
            y2="352"
            stroke="#FFFFFF"
            strokeOpacity="0.78"
            strokeWidth="1.8"
          />
        </g>
      ))}

      {/* ================= CENTRAL RAJA GOPURAM (MEENAKSHI SOUTH TOWER) ================= */}
      <g>
        {/* Outer concave Dravidian silhouette guide curves */}
        <path
          data-arch-stroke
          d={`M ${cx - 50} 120 Q ${cx - 84} 230 ${cx - 134} 352`}
          stroke="#FBBC04"
          strokeWidth="2"
        />
        <path
          data-arch-stroke
          d={`M ${cx + 50} 120 Q ${cx + 84} 230 ${cx + 134} 352`}
          stroke="#FBBC04"
          strokeWidth="2"
        />

        {/* Sala Sikhara (Vaulted Wagon Roof at Gopuram Apex) */}
        <path
          data-arch-stroke
          d={`M ${cx - 52} 120 C ${cx - 48} 94, ${cx - 28} 84, ${cx} 84 C ${cx + 28} 84, ${cx + 48} 94, ${cx + 52} 120 Z`}
          stroke="url(#meenakshi-gold-stroke)"
          strokeWidth="2"
        />
        {/* Ornamental Kirtimukha / Yali Finial Arch at Center of Sala Roof */}
        <path
          data-arch-stroke
          d={`M ${cx - 16} 120 C ${cx - 16} 98, ${cx + 16} 98, ${cx + 16} 120`}
          stroke="#EA4335"
          strokeWidth="1.6"
        />
        <circle
          data-arch-stroke
          cx={cx}
          cy="103"
          r="5"
          stroke="#FBBC04"
          strokeWidth="1.5"
        />

        {/* 7 Sacred Golden Kalasams (Roof Finials) */}
        {[-36, -24, -12, 0, 12, 24, 36].map((offset) => (
          <g key={offset}>
            <path
              data-arch-stroke
              d={`M ${cx + offset} 86 L ${cx + offset} 64`}
              stroke="#FBBC04"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle
              data-arch-stroke
              cx={cx + offset}
              cy="76"
              r="3.2"
              stroke="#FBBC04"
              strokeWidth="1.4"
            />
            <circle
              data-arch-stroke
              cx={cx + offset}
              cy="69"
              r="2"
              stroke="#FFFFFF"
              strokeWidth="1.2"
            />
          </g>
        ))}

        {/* 9 Sculpted Gopuram Tiers (Talas) */}
        {GOPURAM_TIERS.map((tier, index) => {
          const left = cx - tier.halfW;
          const right = cx + tier.halfW;
          const width = tier.halfW * 2;
          const bottom = tier.y + tier.h;

          return (
            <g key={tier.y}>
              {/* Tier structural cornice & frieze */}
              <rect
                data-arch-stroke
                x={left}
                y={tier.y}
                width={width}
                height={tier.h}
                rx="2"
                stroke="url(#meenakshi-gold-stroke)"
                strokeWidth="1.65"
              />
              {/* Horizontal Moulding Band (Kapota) */}
              <line
                data-arch-stroke
                x1={left - 4}
                y1={bottom}
                x2={right + 4}
                y2={bottom}
                stroke={tier.accent}
                strokeWidth="1.5"
              />

              {/* Central Axial Gopuram Window (Sala Gavaksha) */}
              <path
                data-arch-stroke
                d={`M ${cx - 11} ${bottom} L ${cx - 11} ${tier.y + 6} Q ${cx} ${tier.y - 1} ${cx + 11} ${tier.y + 6} L ${cx + 11} ${bottom}`}
                stroke="#FBBC04"
                strokeWidth="1.5"
              />

              {/* Rhythmic Dravidian Kuta & Panjara Niches across the tier */}
              {Array.from({ length: tier.windows }).map((_, wIdx) => {
                const spacing = (width - 28) / (tier.windows + 1);
                const wx = left + 14 + spacing * (wIdx + 1);
                if (Math.abs(wx - cx) < 14) return null;
                return (
                  <path
                    key={wIdx}
                    data-arch-stroke
                    d={`M ${wx - 5} ${bottom - 1} L ${wx - 5} ${tier.y + 6} Q ${wx} ${tier.y + 2} ${wx + 5} ${tier.y + 6} L ${wx + 5} ${bottom - 1}`}
                    stroke={index % 2 === 0 ? "#FFFFFF" : tier.accent}
                    strokeOpacity="0.78"
                    strokeWidth="1.15"
                  />
                );
              })}
            </g>
          );
        })}

        {/* Grand Temple Gateway Base (Adhisthana & Sanctum Threshold) */}
        <rect
          data-arch-stroke
          x={cx - 142}
          y="352"
          width="284"
          height="22"
          stroke="#FBBC04"
          strokeWidth="1.8"
        />
        {/* Tall Gateway Portal (Gopura Vasal) */}
        <path
          data-arch-stroke
          d={`M ${cx - 22} 374 L ${cx - 22} 326 Q ${cx} 312 ${cx + 22} 326 L ${cx + 22} 374`}
          stroke="#FBBC04"
          strokeWidth="2.2"
        />
        <path
          data-arch-stroke
          d={`M ${cx - 15} 374 L ${cx - 15} 332 Q ${cx} 322 ${cx + 15} 332 L ${cx + 15} 374`}
          stroke="#EA4335"
          strokeWidth="1.4"
        />
      </g>

      {/* ================= POTRAMARAI KULAM (GOLDEN LOTUS TANK & STEPPED GHATS) ================= */}
      <g>
        {/* Stepped Temple Tank Ghats */}
        {[0, 1, 2].map((step) => {
          const sy = 374 + step * 12;
          const inset = step * 34;
          return (
            <line
              key={step}
              data-arch-stroke
              x1={110 + inset}
              y1={sy}
              x2={1090 - inset}
              y2={sy}
              stroke={step === 0 ? "#FBBC04" : "#4285F4"}
              strokeOpacity={0.75 - step * 0.15}
              strokeWidth={1.6 - step * 0.2}
            />
          );
        })}

        {/* Sacred Golden Lotus (Potramarai) at the heart of the tank */}
        <g transform={`translate(${cx}, 432)`}>
          {/* Lotus water ripples */}
          <ellipse
            data-arch-stroke
            cx="0"
            cy="10"
            rx="185"
            ry="16"
            stroke="#4285F4"
            strokeOpacity="0.65"
            strokeWidth="1.3"
          />
          <ellipse
            data-arch-stroke
            cx="0"
            cy="10"
            rx="110"
            ry="10"
            stroke="#FBBC04"
            strokeOpacity="0.8"
            strokeWidth="1.4"
          />
          {/* Central Lotus Petals */}
          <path
            data-arch-stroke
            d="M 0 -22 C -10 -10, -12 4, 0 10 C 12 4, 10 -10, 0 -22 Z"
            stroke="#FBBC04"
            strokeWidth="1.8"
          />
          <path
            data-arch-stroke
            d="M 0 10 C -14 2, -26 -8, -18 -18 C -8 -14, -4 -4, 0 10 Z"
            stroke="#FBBC04"
            strokeWidth="1.6"
          />
          <path
            data-arch-stroke
            d="M 0 10 C 14 2, 26 -8, 18 -18 C 8 -14, 4 -4, 0 10 Z"
            stroke="#FBBC04"
            strokeWidth="1.6"
          />
          <path
            data-arch-stroke
            d="M 0 10 C -22 8, -40 0, -34 -10 C -20 -8, -10 0, 0 10 Z"
            stroke="#EA4335"
            strokeWidth="1.4"
          />
          <path
            data-arch-stroke
            d="M 0 10 C 22 8, 40 0, 34 -10 C 20 -8, 10 0, 0 10 Z"
            stroke="#EA4335"
            strokeWidth="1.4"
          />
        </g>

        {/* Shimmering Gopuram Reflection Lines in the Tank Water */}
        {[415, 428, 442, 456, 470].map((ry, rIdx) => {
          const halfSpan = 290 - rIdx * 38;
          return (
            <line
              key={ry}
              data-arch-stroke
              x1={cx - halfSpan}
              y1={ry}
              x2={cx + halfSpan}
              y2={ry}
              stroke={rIdx % 2 === 0 ? "#4285F4" : "#34A853"}
              strokeOpacity={0.48 - rIdx * 0.06}
              strokeWidth="1.2"
              strokeDasharray="18 10 8 10"
            />
          );
        })}
      </g>
    </svg>
  );
}

/**
 * STAGE 3 — CINEMATIC VENUE REVEAL
 *
 * Immediately follows ExpectShowcase on the homepage:
 * 1. Section Introduction ("THE VENUE", "In the heart of Madurai.", supporting copy)
 * 2. Madurai Architectural Reveal (Meenakshi Amman Temple SVG draw-on animation with
 *    layered depth, atmospheric lighting, and subtle Google-coloured accents)
 * 3. Venue Photography (Modern event venue & architectural composition with rounded
 *    edges, subtle parallax, editorial typography, and clear unconfirmed status)
 * 4. Venue Information Panel (LOCATION: Madurai, Tamil Nadu, India | EVENT DATE:
 *    12 December 2026 | VENUE: To be announced + location pin visual)
 * 5. GSAP + ScrollTrigger animations & complete reduced-motion fallback.
 */
export function VenueReveal({ brandShapes: _brandShapes }: { brandShapes: string[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const introWrapRef = useRef<HTMLDivElement>(null);
  const sparkRef = useRef<SVGSVGElement>(null);
  const archCardRef = useRef<HTMLDivElement>(null);
  const archSvgRef = useRef<SVGSVGElement>(null);
  const archBackdropRef = useRef<HTMLDivElement>(null);
  const mainPhotoWrapRef = useRef<HTMLDivElement>(null);
  const mainPhotoInnerRef = useRef<HTMLDivElement>(null);
  const secondaryPhotoInnerRef = useRef<HTMLDivElement>(null);
  const infoPanelRef = useRef<HTMLDivElement>(null);
  const particlesWrapRef = useRef<HTMLDivElement>(null);

  const skipMotion = useClientValue(prefersReducedMotion, false);
  const staticBaseline = useClientValue(shouldUseStaticBaseline, false);
  const cta = ticketCta();

  useGSAP(
    () => {
      // Ensure document --theme remains dark (0) so downstream sections keep white paper text
      document.documentElement.style.setProperty("--theme", "0");

      if (skipMotion || staticBaseline || !sectionRef.current) return;

      const section = sectionRef.current;

      // 1. Smooth background colour transition as visitor scrolls through the section
      gsap.fromTo(
        section,
        { backgroundColor: "#080C1B" },
        {
          backgroundColor: "#0D152E",
          ease: "sine.inOut",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            end: "center center",
            scrub: true,
          },
        },
      );

      // 2. Section Introduction text reveal
      if (introWrapRef.current) {
        const introItems = introWrapRef.current.querySelectorAll("[data-venue-intro]");
        gsap.fromTo(
          introItems,
          { y: 28, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: introWrapRef.current,
              start: "top 82%",
              once: true,
            },
            immediateRender: false,
          },
        );
      }

      if (sparkRef.current) {
        gsap.fromTo(
          sparkRef.current,
          { scale: 0.35, autoAlpha: 0, transformOrigin: "left bottom" },
          {
            scale: 1,
            autoAlpha: 1,
            duration: 0.6,
             delay: 0.25,
            ease: "back.out(2.2)",
            scrollTrigger: {
              trigger: introWrapRef.current,
              start: "top 82%",
              once: true,
            },
            immediateRender: false,
          },
        );
      }

      // 3. Madurai Architectural SVG Draw-On Animation
      if (archSvgRef.current && archCardRef.current) {
        const strokes = archSvgRef.current.querySelectorAll<SVGGeometryElement>("[data-arch-stroke]");

        const archTl = gsap.timeline({
          scrollTrigger: {
            trigger: archCardRef.current,
            start: "top 80%",
            end: "bottom 55%",
            scrub: 0.8,
          },
        });

        archTl.fromTo(
          strokes,
          { drawSVG: "0%" },
          {
            drawSVG: "100%",
            duration: 1.4,
            stagger: {
              each: 0.008,
              from: "center",
            },
            ease: "power2.out",
            immediateRender: false,
          },
          0,
        );

        if (archBackdropRef.current) {
          archTl.fromTo(
            archBackdropRef.current,
            { opacity: 0.14, scale: 1.04 },
            { opacity: 0.38, scale: 1, duration: 1.4, ease: "sine.out" },
            0,
          );
        }
      }

      // 4. Venue Photography subtle scroll parallax
      if (mainPhotoInnerRef.current && mainPhotoWrapRef.current) {
        gsap.fromTo(
          mainPhotoInnerRef.current,
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: mainPhotoWrapRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }

      if (secondaryPhotoInnerRef.current && mainPhotoWrapRef.current) {
        gsap.fromTo(
          secondaryPhotoInnerRef.current,
          { yPercent: 6 },
          {
            yPercent: -6,
            ease: "none",
            scrollTrigger: {
              trigger: mainPhotoWrapRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }

      // 5. Venue Information Panel entrance reveal
      if (infoPanelRef.current) {
        const panelItems = infoPanelRef.current.querySelectorAll("[data-venue-info-item]");
        gsap.fromTo(
          panelItems,
          { y: 24, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.65,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: infoPanelRef.current,
              start: "top 85%",
              once: true,
            },
            immediateRender: false,
          },
        );
      }

      // 6. Subtle floating particles animation
      if (particlesWrapRef.current) {
        const dots = particlesWrapRef.current.querySelectorAll("[data-venue-particle]");
        dots.forEach((dot, idx) => {
          gsap.to(dot, {
            y: idx % 2 === 0 ? -18 : 18,
            x: idx % 3 === 0 ? 10 : -10,
            opacity: 0.75,
            duration: 3.4 + (idx % 4) * 0.6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: (idx % 5) * 0.3,
          });
        });
      }
    },
    { scope: sectionRef, dependencies: [skipMotion, staticBaseline] },
  );

  return (
    <section
      ref={sectionRef}
      id="venue-reveal"
      aria-labelledby="venue-reveal-heading"
      className="relative overflow-hidden border-b border-white/15 bg-[#080C1B] py-20 text-white sm:py-24 lg:py-32"
    >
      {/* Subtle atmospheric lighting backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 24%, rgba(66, 133, 244, 0.14) 0%, rgba(251, 188, 4, 0.08) 32%, rgba(8, 12, 27, 0.96) 72%)",
        }}
      />

      {/* Subtle floating twilight particles */}
      <div
        ref={particlesWrapRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
      >
        {FLOATING_PARTICLES.map((p, index) => (
          <span
            key={index}
            data-venue-particle
            className="absolute rounded-full opacity-35"
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              boxShadow: `0 0 10px ${p.color}`,
            }}
          />
        ))}
      </div>

      {/* Subtle Google-coloured corner wave accents matching the Madurai visual reference */}
      <svg
        viewBox="0 0 280 96"
        fill="none"
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 z-10 h-14 w-44 opacity-90 sm:h-20 sm:w-64"
        preserveAspectRatio="none"
      >
        <path d="M0 24C64 24 118 52 162 96H0V24Z" fill="#FBBC04" />
        <path d="M0 56C88 48 176 66 268 96H0V56Z" fill="#4285F4" />
      </svg>

      <svg
        viewBox="0 0 240 88"
        fill="none"
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 z-10 h-12 w-36 opacity-85 sm:h-16 sm:w-52"
        preserveAspectRatio="none"
      >
        <path d="M240 28C184 32 132 56 88 88H240V28Z" fill="#EA4335" />
        <path d="M240 58C194 58 148 70 116 88H240V58Z" fill="#34A853" />
      </svg>

      <div className="relative z-20 mx-auto w-full max-w-[1400px] px-6 sm:px-10 lg:px-12">
        {/* ================= 1. SECTION INTRODUCTION ================= */}
        <div
          ref={introWrapRef}
          className="mx-auto flex max-w-3xl flex-col items-start text-left lg:mx-0"
        >
          {/* Eyebrow: THE VENUE */}
          <div
            data-venue-intro
            className="inline-flex items-center gap-2.5 rounded-full border border-yellow/35 bg-yellow/10 px-4 py-1.5 backdrop-blur-sm"
          >
            <span className="h-2 w-2 rounded-full bg-yellow shadow-[0_0_10px_#FBBC04]" />
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-yellow sm:text-[13px]">
              {uiCopy.venueReveal.eyebrow}
            </span>
          </div>

          {/* Main Heading: "In the heart of Madurai." + Yellow Spark Rays */}
          <h2
            id="venue-reveal-heading"
            data-venue-intro
            className="mt-5 font-extrabold italic leading-[1.05] tracking-[-0.025em] text-white text-[34px] sm:text-[50px] lg:text-[60px]"
          >
            <span className="inline-flex flex-wrap items-center gap-x-3">
              <span>{uiCopy.venueReveal.heading}</span>
              <svg
                ref={sparkRef}
                viewBox="0 0 56 52"
                fill="none"
                aria-hidden="true"
                className="-mt-4 h-8 w-9 shrink-0 sm:-mt-6 sm:h-11 sm:w-12"
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

          {/* Supporting copy */}
          <p
            data-venue-intro
            className="mt-4 max-w-2xl text-base font-normal leading-[1.6] text-white/85 sm:text-lg lg:text-[20px]"
          >
            {uiCopy.venueReveal.supportingText}
          </p>
        </div>

        {/* ================= 2. MADURAI ARCHITECTURAL REVEAL ================= */}
        <div
          ref={archCardRef}
          className="relative mt-10 overflow-hidden rounded-2xl border border-white/15 bg-[#0A1024] shadow-[0_24px_70px_rgba(0,0,0,0.65)] sm:mt-12 sm:rounded-3xl"
        >
          {/* Layered twilight temple photograph softly blended behind the architectural SVG */}
          <div
            ref={archBackdropRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-30"
          >
            <Image
              src="/venue.webp"
              alt=""
              fill
              sizes="(min-width: 1280px) 1320px, 100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1024] via-[#0A1024]/70 to-[#0A1024]/85" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A1024]/90 via-transparent to-[#0A1024]/90" />
          </div>

          {/* Top architectural metadata bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3.5 sm:px-8">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
              <span className="h-2 w-2 rounded-full bg-yellow" />
              <span>{uiCopy.venueReveal.architectureLabel}</span>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-medium text-white/65">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue" />
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-red" />
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-yellow" />
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green" />
              <span className="ml-1">9°55&apos;10&quot;N · 78°07&apos;10&quot;E · Madurai</span>
            </div>
          </div>

          {/* Animated SVG Architectural Line-Art Stage */}
          <div className="relative z-10 px-3 py-6 sm:px-8 sm:py-10">
            <MeenakshiArchitecturalSvg svgRef={archSvgRef} />
          </div>

          {/* Bottom architectural legend strip */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-[#080C1B]/60 px-5 py-3.5 text-xs text-white/75 backdrop-blur-md sm:px-8">
            <span>
              Inspired by the Dravidian Raja Gopurams, Ayiram Kaal Mandapam &amp; Golden Lotus Tank of Madurai.
            </span>
            <span className="font-semibold text-yellow">
              Where heritage meets innovation
            </span>
          </div>
        </div>

        {/* ================= 3. VENUE PHOTOGRAPHY & 4. VENUE INFORMATION PANEL ================= */}
        <div
          ref={mainPhotoWrapRef}
          className="mt-10 grid grid-cols-1 gap-8 lg:mt-12 lg:grid-cols-12 lg:gap-10"
        >
          {/* Left / Main Column (7 cols): Venue Photographic Composition */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            {/* Primary Modern Event Venue Auditorium Photograph */}
            <div className="group relative overflow-hidden rounded-2xl border border-white/15 bg-[#0D132A] shadow-[0_20px_56px_rgba(0,0,0,0.6)] sm:rounded-3xl">
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <div ref={mainPhotoInnerRef} className="absolute -inset-y-6 inset-x-0">
                  <Image
                    src="/archive/2025-keynote-hall.webp"
                    alt="Modern conference keynote auditorium hosting the developer community"
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>

                {/* Atmospheric vignette & subtle warm/blue lighting */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080C1B]/90 via-[#080C1B]/25 to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#080C1B]/65 via-transparent to-transparent"
                />

                {/* Top-left clear unconfirmed venue status badge */}
                <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#080C1B]/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-yellow" />
                    <span>Community Space Atmosphere · Official Venue TBA</span>
                  </div>
                </div>

                {/* Bottom editorial typography overlay */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow">
                    DEVFEST MADURAI 2026 EXPERIENCE
                  </p>
                  <h3 className="mt-1.5 text-xl font-bold tracking-tight text-white sm:text-2xl">
                    {uiCopy.venueReveal.photoCaptionTitle}
                  </h3>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
                    {uiCopy.venueReveal.photoCaptionBody}
                  </p>
                </div>
              </div>
            </div>

            {/* Secondary Two-Card Architectural & Community Gallery Row */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="group relative overflow-hidden rounded-2xl border border-white/15 bg-[#0D132A]">
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <div ref={secondaryPhotoInnerRef} className="absolute -inset-y-4 inset-x-0">
                    <Image
                      src="/archive/2025-full-house.webp"
                      alt="Developers, speakers, and creators gathered in a modern auditorium"
                      fill
                      sizes="(min-width: 1024px) 28vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080C1B]/85 via-transparent to-transparent" />
                  <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between">
                    <span className="text-xs font-semibold text-white/95 sm:text-sm">
                      Main Stage &amp; Breakout Tracks
                    </span>
                    <span className="h-2 w-2 rounded-full bg-blue" />
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-white/15 bg-[#0D132A]">
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src="/art/corridor.webp"
                    alt="Madurai architectural pillars and heritage corridors"
                    fill
                    sizes="(min-width: 1024px) 28vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080C1B]/85 via-transparent to-transparent" />
                  <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between">
                    <span className="text-xs font-semibold text-white/95 sm:text-sm">
                      Rooted in Madurai&apos;s Craft
                    </span>
                    <span className="h-2 w-2 rounded-full bg-green" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Structured Venue Information Panel */}
          <div className="lg:col-span-5">
            <div
              ref={infoPanelRef}
              className="flex h-full flex-col justify-between rounded-2xl border border-white/15 bg-[#0B1228]/90 p-6 shadow-[0_24px_64px_rgba(0,0,0,0.65)] backdrop-blur-md sm:rounded-3xl sm:p-8"
            >
              <div>
                {/* Header row with tasteful Location-Pin Visual & Announcement Status */}
                <div
                  data-venue-info-item
                  className="flex items-start justify-between gap-4 border-b border-white/10 pb-6"
                >
                  <div className="flex items-center gap-4">
                    {/* Tasteful Location-Pin Visual */}
                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-yellow/35 bg-yellow/10">
                      <span
                        aria-hidden="true"
                        className="absolute inset-1.5 rounded-xl border border-yellow/20"
                      />
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                        className="h-7 w-7 text-yellow"
                      >
                        <path
                          d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="10"
                          r="2.8"
                          fill="#FBBC04"
                        />
                      </svg>
                    </div>

                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue/40 bg-blue/15 px-3 py-0.5 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-pastel">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue" />
                        <span>{uiCopy.venueReveal.announcementStatus}</span>
                      </span>
                      <h3 className="mt-1.5 text-xl font-bold tracking-tight text-white sm:text-2xl">
                        Event Dispatch
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Three Core Venue Information Rows: LOCATION, EVENT DATE, VENUE */}
                <dl className="mt-6 divide-y divide-white/10">
                  {/* 1. LOCATION */}
                  <div data-venue-info-item className="py-5 first:pt-0">
                    <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-white/60">
                      <span className="h-2 w-2 rounded-full bg-blue" />
                      <span>{uiCopy.venueReveal.locationLabel}</span>
                    </dt>
                    <dd className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-[26px]">
                      {uiCopy.venueReveal.locationValue}
                    </dd>
                    <p className="mt-1 text-sm text-white/65">
                      Cultural capital of Tamil Nadu · Temple City
                    </p>
                  </div>

                  {/* 2. EVENT DATE */}
                  <div data-venue-info-item className="py-5">
                    <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-white/60">
                      <span className="h-2 w-2 rounded-full bg-yellow" />
                      <span>{uiCopy.venueReveal.dateLabel}</span>
                    </dt>
                    <dd className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-[26px]">
                      {uiCopy.venueReveal.dateValue}
                    </dd>
                    <p className="mt-1 text-sm text-white/65">
                      Saturday · One full day of talks, build sessions &amp; networking
                    </p>
                  </div>

                  {/* 3. VENUE */}
                  <div data-venue-info-item className="py-5 last:pb-0">
                    <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-white/60">
                      <span className="h-2 w-2 rounded-full bg-green" />
                      <span>{uiCopy.venueReveal.venueLabel}</span>
                    </dt>
                    <dd className="mt-2 flex flex-wrap items-center gap-3">
                      <span className="text-2xl font-extrabold tracking-tight text-yellow sm:text-[26px]">
                        {uiCopy.venueReveal.venueValue}
                      </span>
                      <span className="rounded-full border border-yellow/35 bg-yellow/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-yellow">
                        TBA
                      </span>
                    </dd>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/70">
                      We are finalising a premier conference venue in Madurai. Registered attendees will be notified first.
                    </p>
                  </div>
                </dl>
              </div>

              {/* Action Buttons & Disclaimer Footer */}
              <div data-venue-info-item className="mt-8 border-t border-white/10 pt-6">
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={siteConfig.venue.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-yellow/60 hover:bg-white/15"
                  >
                    <RollingText>{uiCopy.venueReveal.getDirectionsLabel}</RollingText>
                  </a>

                  {cta.href && (
                    <Link
                      href={cta.href}
                      className="inline-flex items-center justify-center rounded-full bg-yellow px-6 py-3 text-sm font-bold text-[#080C1B] transition-transform hover:scale-[1.02]"
                    >
                      <RollingText>{uiCopy.common.getTicketsLabel}</RollingText>
                    </Link>
                  )}
                </div>

                <p className="mt-4 text-xs leading-relaxed text-white/55">
                  {uiCopy.venueReveal.roadshowsText} · {uiCopy.venueReveal.disclaimerText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
