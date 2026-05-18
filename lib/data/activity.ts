import "server-only";

import type { ActivityRecord, NotificationRecord } from "./types";
import { hashString, makeRng, pick, rangeInt } from "./rng";
import { getDealership } from "./dealerships";

export async function getActivity(dealershipId: string): Promise<ActivityRecord[]> {
  const dealership = await getDealership(dealershipId);
  const rng = makeRng(hashString(dealershipId + ":activity"));
  const now = Date.now();
  const ts = (mins: number) => new Date(now - mins * 60 * 1000).toISOString();
  const b = dealership.brand.toLowerCase();
  const c = dealership.city.toLowerCase();

  const candidates: ActivityRecord[] = [
    {
      id: "act-1",
      kind: "ranking_gain",
      title: `"${b} f-150 ${c}" climbed to position 2.1`,
      detail: "from position 7.3 over the past 14 days",
      amount: "↑5.2",
      at: ts(rangeInt(rng, 6, 65)),
      href: "/keywords",
    },
    {
      id: "act-2",
      kind: "insight_created",
      title: "3 new high-priority AI insights surfaced",
      detail: "Schema deployment, lease pages, mobile speed",
      at: ts(rangeInt(rng, 90, 240)),
      href: "/insights",
    },
    {
      id: "act-3",
      kind: "report_generated",
      title: "Weekly executive summary ready",
      detail: "Distributed to 6 stakeholders",
      at: ts(rangeInt(rng, 360, 720)),
      href: "/reports",
    },
    {
      id: "act-4",
      kind: "ranking_drop",
      title: `"${b} lease deals ${c}" dropped to position 8.4`,
      detail: "AutoNation Ford gained the top spot",
      amount: "↓3.1",
      at: ts(rangeInt(rng, 600, 1100)),
      href: "/keywords",
    },
    {
      id: "act-5",
      kind: "scan_completed",
      title: "Nightly GSC sync completed",
      detail: "248 URLs crawled · 6 new technical issues",
      at: ts(rangeInt(rng, 720, 1260)),
      href: "/local-seo",
    },
    {
      id: "act-6",
      kind: "review_received",
      title: "4 new Google reviews · avg 4.9★",
      detail: "Auto-response drafted by AI",
      at: ts(rangeInt(rng, 1300, 2400)),
      href: "/local-seo",
    },
    {
      id: "act-7",
      kind: "competitor_move",
      title: "Group 1 Toyota deployed Vehicle schema",
      detail: "Their map-pack share grew 4.2pp this week",
      at: ts(rangeInt(rng, 2400, 4320)),
      href: "/competitors",
    },
    {
      id: "act-8",
      kind: "insight_resolved",
      title: "Resolved: 12 missing H1 tags",
      detail: "Inventory + service templates updated",
      at: ts(rangeInt(rng, 4320, 7200)),
      href: "/insights",
    },
  ];
  return candidates.sort((a, b) => b.at.localeCompare(a.at));
}

export async function getNotifications(): Promise<NotificationRecord[]> {
  const now = Date.now();
  const ts = (h: number) => new Date(now - h * 60 * 60 * 1000).toISOString();
  return [
    {
      id: "n-1",
      type: "RANKING_GAIN",
      title: "A3 Brands Ford of Plano jumped to position 2",
      body: "‘ford f-150 plano’ now ranks #2 (was #7).",
      href: "/keywords",
      read: false,
      createdAt: ts(2),
    },
    {
      id: "n-2",
      type: "AI_INSIGHT",
      title: "3 new high-priority AI insights",
      body: "Schema, lease landing pages, mobile speed.",
      href: "/insights",
      read: false,
      createdAt: ts(5),
    },
    {
      id: "n-3",
      type: "REPORT_READY",
      title: "Monthly SEO report ready",
      body: "Distributed to 6 stakeholders.",
      href: "/reports",
      read: true,
      createdAt: ts(22),
    },
    {
      id: "n-4",
      type: "COMPETITOR_ALERT",
      title: "Group 1 Toyota deployed Vehicle schema",
      body: "Map-pack share grew 4.2pp this week.",
      href: "/competitors",
      read: true,
      createdAt: ts(40),
    },
  ];
}
