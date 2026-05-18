"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Brain,
  LayoutDashboard,
  LineChart,
  MapPin,
  Search,
  Settings,
  Shield,
  Target,
} from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  match: (p: string) => boolean;
};

const NAV: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    match: (p) => p === "/dashboard",
  },
  {
    label: "AI Insights",
    href: "/insights",
    icon: Brain,
    badge: 8,
    match: (p) => p.startsWith("/insights"),
  },
  {
    label: "Keywords",
    href: "/keywords",
    icon: LineChart,
    match: (p) => p.startsWith("/keywords"),
  },
  {
    label: "Competitors",
    href: "/competitors",
    icon: Target,
    match: (p) => p.startsWith("/competitors"),
  },
  {
    label: "Local SEO",
    href: "/local-seo",
    icon: MapPin,
    match: (p) => p.startsWith("/local-seo"),
  },
  {
    label: "Reports",
    href: "/reports",
    icon: BarChart3,
    match: (p) => p.startsWith("/reports"),
  },
];

const SECONDARY: NavItem[] = [
  {
    label: "Admin",
    href: "/admin",
    icon: Shield,
    match: (p) => p.startsWith("/admin"),
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    match: (p) => p.startsWith("/settings"),
  },
];

export function Sidebar() {
  const pathname = usePathname() ?? "/";

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-stone-200 bg-stone-50 lg:block">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b border-stone-200 px-4">
          <Logo variant="dark" size="sm" />
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="px-2 font-display text-[10px] font-bold uppercase tracking-[0.15em] text-stone">
            Platform
          </p>
          <ul className="mt-3 space-y-1">
            {NAV.map((item) => (
              <SidebarLink key={item.href} item={item} pathname={pathname} />
            ))}
          </ul>

          <p className="mt-7 px-2 font-display text-[10px] font-bold uppercase tracking-[0.15em] text-stone">
            Workspace
          </p>
          <ul className="mt-3 space-y-1">
            {SECONDARY.map((item) => (
              <SidebarLink key={item.href} item={item} pathname={pathname} />
            ))}
          </ul>
        </nav>

        <div className="border-t border-stone-200 p-3">
          <Link
            href="/scan"
            className="group flex items-center gap-3 rounded-lg border border-brand bg-brand/10 px-3 py-2.5 text-[14px] text-charcoal transition-colors hover:bg-brand/15"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand/20 text-brand">
              <Search className="h-3.5 w-3.5" />
            </span>
            <span className="min-w-0">
              <div className="font-display text-[14px] font-bold leading-none text-charcoal">
                New scan
              </div>
              <div className="mt-1 text-[11px] text-stone">
                Audit any dealership URL
              </div>
            </span>
          </Link>
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const active = item.match(pathname);
  const Icon = item.icon;
  return (
    <li>
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] transition-colors",
          active
            ? "bg-brand/10 text-charcoal"
            : "text-stone hover:bg-white hover:text-charcoal",
        )}
      >
        {active ? (
          <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand" />
        ) : null}
        <Icon
          className={cn(
            "h-4 w-4 transition-colors",
            active ? "text-brand" : "text-stone group-hover:text-charcoal",
          )}
        />
        <span className="min-w-0 flex-1 truncate font-display">{item.label}</span>
        {item.badge ? (
          <span
            className={cn(
              "ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 font-display text-[10px] font-bold",
              active
                ? "bg-brand text-charcoal"
                : "bg-stone-200 text-stone",
            )}
          >
            {item.badge}
          </span>
        ) : null}
      </Link>
    </li>
  );
}
