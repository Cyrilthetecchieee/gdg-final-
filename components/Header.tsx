"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navRoutes } from "@/lib/routes";
import { siteConfig, uiCopy } from "@/site.config";
import { AuthButton } from "@/components/auth/AuthButton";

function GdgBracketsMark({ className = "h-7 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 34" fill="none" aria-hidden="true" className={className}>
      {/* Left '<' bracket: top arm Red (#EA4335), bottom arm Blue (#4285F4) */}
      <path
        d="M18.5 5.5L5.5 17"
        stroke="#EA4335"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 17L18.5 28.5"
        stroke="#4285F4"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right '>' bracket: top arm Green (#34A853), bottom arm Yellow (#FBBC04) */}
      <path
        d="M29.5 5.5L42.5 17"
        stroke="#34A853"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M42.5 17L29.5 28.5"
        stroke="#FBBC04"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Header() {
  const pathname = usePathname();

  const routeItems = navRoutes.map((route) => {
    const active = pathname === route.href;
    const isLive = route.href === "/live";
    return (
      <li key={route.href} data-hall-live-link={isLive ? "" : undefined}>
        <Link
          href={route.href}
          aria-current={active ? "page" : undefined}
          className={`relative inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[15px] font-medium transition-colors ${
            active
              ? "text-white after:absolute after:bottom-0 after:left-2.5 after:right-2.5 after:h-[2.5px] after:rounded-full after:bg-white"
              : "text-white/80 hover:text-white"
          }`}
        >
          <span>{route.label}</span>
          {isLive && (
            <span
              aria-hidden="true"
              className="inline-block h-2 w-2 rounded-full bg-red shadow-[0_0_8px_#EA4335]"
            />
          )}
        </Link>
      </li>
    );
  });

  const volunteerItem = (
    <li>
      <Link
        href="/volunteer"
        aria-current={pathname === "/volunteer" ? "page" : undefined}
        className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/[0.03] px-5 py-1.5 text-[14px] font-medium text-white transition-all hover:border-white hover:bg-white/10"
      >
        <span>Volunteer</span>
        <span aria-hidden="true" className="text-xs leading-none">
          ↗
        </span>
      </Link>
    </li>
  );

  return (
    <header className="site-nav nav-lite-only fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#070B18]/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-3.5 sm:px-8 lg:px-12">
        {/* Brand lockup: GDG 4-colour bracket icon + GDG Madurai */}
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-white transition-opacity hover:opacity-90"
        >
          <GdgBracketsMark className="h-7 w-9 shrink-0" />
          <span className="text-xl font-bold tracking-tight text-white sm:text-[23px]">
            {siteConfig.chapter}
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav aria-label={uiCopy.header.navAriaLabel} className="hidden lg:block">
          <ul className="flex items-center gap-3 xl:gap-5 whitespace-nowrap">
            {routeItems}
            <li className="ml-1">{volunteerItem.props.children}</li>
            <li className="ml-1">
              <AuthButton variant="pill" />
            </li>
          </ul>
        </nav>

        {/* Mobile / tablet menu disclosure */}
        <details className="relative lg:hidden [&[open]_.chevron]:rotate-180">
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-white/25 bg-[#0D1326]/90 px-4 py-2 text-sm font-medium text-white backdrop-blur-md [&::-webkit-details-marker]:hidden">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>Menu</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true" className="chevron transition-transform">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </summary>
          <nav
            aria-label={uiCopy.header.navAriaLabel}
            className="absolute right-0 mt-2 w-60 rounded-2xl border border-white/15 bg-[#0B1022]/95 p-3 shadow-2xl backdrop-blur-xl"
          >
            <ul className="flex flex-col gap-1">
              {routeItems}
              <li className="mt-2 pt-2 border-t border-white/10">
                <Link
                  href="/volunteer"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-white/50 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
                >
                  <span>Volunteer</span>
                  <span aria-hidden="true">↗</span>
                </Link>
              </li>
              <li className="mt-1">
                <AuthButton variant="pill" />
              </li>
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}
