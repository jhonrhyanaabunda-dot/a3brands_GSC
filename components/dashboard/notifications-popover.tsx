"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, BellRing, ChevronRight, Sparkles, TrendingDown, TrendingUp, FileText, Target } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";
import type { NotificationRecord } from "@/lib/data/types";

const ICONS: Record<NotificationRecord["type"], React.ComponentType<{ className?: string }>> = {
  INFO: Sparkles,
  SUCCESS: Sparkles,
  WARNING: Sparkles,
  CRITICAL: Sparkles,
  REPORT_READY: FileText,
  AI_INSIGHT: Sparkles,
  COMPETITOR_ALERT: Target,
  RANKING_DROP: TrendingDown,
  RANKING_GAIN: TrendingUp,
};

const TINT: Record<NotificationRecord["type"], string> = {
  INFO: "bg-brand/15 text-brand",
  SUCCESS: "bg-brand/15 text-brand",
  WARNING: "bg-amber-500/15 text-amber-600",
  CRITICAL: "bg-red-500/15 text-red-600",
  REPORT_READY: "bg-brand/15 text-brand",
  AI_INSIGHT: "bg-brand/15 text-brand",
  COMPETITOR_ALERT: "bg-amber-500/15 text-amber-600",
  RANKING_DROP: "bg-red-500/15 text-red-600",
  RANKING_GAIN: "bg-brand/15 text-brand",
};

function timeAgo(iso: string) {
  const t = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(t / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export function NotificationsPopover({
  notifications,
}: {
  notifications: NotificationRecord[];
}) {
  const unread = notifications.filter((n) => !n.read).length;
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            "relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-white transition-colors hover:border-brand hover:bg-stone-50",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
          )}
          aria-label="Notifications"
        >
          {unread > 0 ? (
            <BellRing className="h-4 w-4 text-charcoal" />
          ) : (
            <Bell className="h-4 w-4 text-stone" />
          )}
          {unread > 0 ? (
            <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 font-display text-[10px] font-bold text-charcoal shadow-floating">
              {unread}
            </span>
          ) : null}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-50 w-[380px] overflow-hidden rounded-xl border border-stone-200 bg-white shadow-raised"
        >
          <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3">
            <div>
              <div className="font-display text-[14px] font-bold text-charcoal">Notifications</div>
              <div className="text-[11px] text-stone">
                {unread} unread of {notifications.length}
              </div>
            </div>
            <button
              type="button"
              className="font-display text-[12px] font-semibold text-brand hover:underline"
            >
              Mark all read
            </button>
          </div>
          <ul className="max-h-[420px] overflow-y-auto divide-y divide-stone-200">
            {notifications.map((n) => {
              const Icon = ICONS[n.type];
              return (
                <li key={n.id}>
                  <Link
                    href={n.href}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3 transition-colors hover:bg-stone-50",
                      !n.read && "bg-stone-50/60",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        TINT[n.type],
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p
                          className={cn(
                            "min-w-0 flex-1 truncate text-[14px]",
                            n.read ? "text-charcoal" : "font-bold text-charcoal",
                          )}
                        >
                          {n.title}
                        </p>
                        <span className="shrink-0 text-[11px] text-stone">
                          {timeAgo(n.createdAt)}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-[12px] text-stone">
                        {n.body}
                      </p>
                    </div>
                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-stone" />
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-stone-200 p-2">
            <Link
              href="/insights"
              className="block rounded-md px-3 py-2 text-center font-display text-[12px] font-semibold text-brand transition-colors hover:bg-stone-50"
            >
              View all activity →
            </Link>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
