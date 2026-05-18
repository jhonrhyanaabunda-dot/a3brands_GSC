import "server-only";

import type {
  GbpHealthRecord,
  LocalRankingPoint,
  ReviewSnapshotRecord,
  TechnicalIssueRecord,
} from "./types";
import { hashString, makeRng, rangeInt, range } from "./rng";
import { getDealership } from "./dealerships";

const GRID_SIZE = 5; // 5x5

export async function getMapPackGrid(
  dealershipId: string,
  query?: string,
): Promise<LocalRankingPoint[]> {
  const dealership = await getDealership(dealershipId);
  const q = query ?? `${dealership.brand.toLowerCase()} dealer near me`;
  const rng = makeRng(hashString(dealershipId + ":local:" + q));
  const offset = (GRID_SIZE - 1) / 2;
  const points: LocalRankingPoint[] = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const distance = Math.sqrt(
        (x - offset) ** 2 + (y - offset) ** 2,
      );
      const noise = (rng() - 0.5) * 3;
      const position = Math.max(1, Math.round(distance * 2.5 + 1 + noise));
      points.push({
        query: q,
        city: dealership.city,
        state: dealership.state,
        gridX: x,
        gridY: y,
        position,
        inMapPack: position <= 3,
      });
    }
  }
  return points;
}

export async function getLocalQueries(dealershipId: string): Promise<string[]> {
  const dealership = await getDealership(dealershipId);
  const b = dealership.brand.toLowerCase();
  return [
    `${b} dealer near me`,
    `${b} dealership ${dealership.city.toLowerCase()}`,
    `new ${b} ${dealership.city.toLowerCase()}`,
    `used ${b} ${dealership.city.toLowerCase()}`,
    `${b} service ${dealership.city.toLowerCase()}`,
  ];
}

export async function getReviewSnapshot(
  dealershipId: string,
): Promise<ReviewSnapshotRecord> {
  const rng = makeRng(hashString(dealershipId + ":reviews"));
  return {
    totalReviews: rangeInt(rng, 480, 2400),
    averageRating: Number(range(rng, 4.1, 4.8).toFixed(2)),
    newReviews30d: rangeInt(rng, 14, 86),
    responseRate: Number(range(rng, 62, 96).toFixed(1)),
    sentimentPositive: Number(range(rng, 0.62, 0.84).toFixed(2)),
    sentimentNeutral: Number(range(rng, 0.08, 0.18).toFixed(2)),
    sentimentNegative: Number(range(rng, 0.05, 0.18).toFixed(2)),
  };
}

export async function getGbpHealth(
  dealershipId: string,
): Promise<GbpHealthRecord> {
  const rng = makeRng(hashString(dealershipId + ":gbp"));
  const photos = rangeInt(rng, 0, 14);
  const posts = rangeInt(rng, 0, 12);
  const qaCoverage = rangeInt(rng, 28, 90);
  const hoursAccuracy = rangeInt(rng, 88, 100);
  const napConsistency = rangeInt(rng, 70, 98);
  const score = Math.round(
    (Math.min(photos, 7) / 7) * 18 +
      (Math.min(posts, 4) / 4) * 18 +
      (qaCoverage / 100) * 16 +
      (hoursAccuracy / 100) * 22 +
      (napConsistency / 100) * 26,
  );
  return {
    verified: true,
    photosLast14d: photos,
    postsLast30d: posts,
    qAndACoverage: qaCoverage,
    hoursAccuracy,
    napConsistency,
    score,
  };
}

const ISSUE_TEMPLATES: Array<Omit<TechnicalIssueRecord, "id" | "detectedAt" | "resolved">> = [
  {
    title: "12 pages missing H1 tag",
    description: "Inventory and service templates render without an H1. Add semantic heading to /inventory/*, /service/*.",
    url: "/inventory/",
    category: "TECHNICAL",
    severity: "MEDIUM",
  },
  {
    title: "Broken canonical loops on /inventory/*",
    description: "4 self-referential canonicals detected. Collapse to single canonical per VDP.",
    url: "/inventory/",
    category: "TECHNICAL",
    severity: "HIGH",
  },
  {
    title: "Mobile viewport meta missing on 3 pages",
    description: "Landing pages /landing/ford-lease, /landing/service-special, /landing/gm-coupon ship without viewport meta.",
    url: "/landing/",
    category: "PERFORMANCE",
    severity: "LOW",
  },
  {
    title: "Duplicate title tags across 18 service pages",
    description: "Service pages share identical titles. Add city + service modifier per page.",
    url: "/service/",
    category: "CONTENT",
    severity: "MEDIUM",
  },
  {
    title: "Render-blocking CSS over the fold",
    description: "Above-the-fold CSS is 128KB. Inline critical CSS and defer the rest.",
    url: "/",
    category: "PERFORMANCE",
    severity: "HIGH",
  },
  {
    title: "Missing AggregateRating schema on home",
    description: "Home page lacks AggregateRating despite 4.7 GBP rating. Add JSON-LD.",
    url: "/",
    category: "SCHEMA",
    severity: "MEDIUM",
  },
];

export async function getTechnicalIssues(
  dealershipId: string,
): Promise<TechnicalIssueRecord[]> {
  const rng = makeRng(hashString(dealershipId + ":issues"));
  const now = Date.now();
  return ISSUE_TEMPLATES.map((it, i) => ({
    id: `iss-${dealershipId}-${i}`,
    ...it,
    resolved: rng() < 0.15,
    detectedAt: new Date(now - rangeInt(rng, 1, 21) * 24 * 60 * 60 * 1000).toISOString(),
  }));
}
