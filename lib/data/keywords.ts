import "server-only";

import type { KeywordIntent, KeywordRecord } from "./types";
import { hashString, makeRng, rangeInt, range } from "./rng";
import { getDealership } from "./dealerships";

interface Template {
  build: (b: string, c: string) => string;
  intent: KeywordIntent;
  isBranded: boolean;
  volumeRange: [number, number];
  difficultyRange: [number, number];
  positionBias: number; // smaller → ranks better
}

const TEMPLATES: Template[] = [
  // Branded - strong rankings
  { build: (b, c) => `${b.toLowerCase()} dealer near me`, intent: "LOCAL", isBranded: true, volumeRange: [4400, 9900], difficultyRange: [32, 48], positionBias: -3 },
  { build: (b, c) => `${b.toLowerCase()} dealership ${c.toLowerCase()}`, intent: "LOCAL", isBranded: true, volumeRange: [2900, 7400], difficultyRange: [30, 46], positionBias: -3 },
  { build: (b, c) => `new ${b.toLowerCase()} for sale ${c.toLowerCase()}`, intent: "TRANSACTIONAL", isBranded: true, volumeRange: [1900, 4400], difficultyRange: [40, 58], positionBias: -2 },
  { build: (b, c) => `${b.toLowerCase()} lease deals ${c.toLowerCase()}`, intent: "COMMERCIAL", isBranded: true, volumeRange: [880, 2400], difficultyRange: [42, 62], positionBias: 1 },
  { build: (b, c) => `best ${b.toLowerCase()} dealer ${c.toLowerCase()}`, intent: "COMMERCIAL", isBranded: true, volumeRange: [320, 1200], difficultyRange: [38, 56], positionBias: -1 },

  // Service
  { build: (b, c) => `${b.toLowerCase()} service center ${c.toLowerCase()}`, intent: "SERVICE", isBranded: true, volumeRange: [720, 2400], difficultyRange: [28, 42], positionBias: -2 },
  { build: (b, c) => `${b.toLowerCase()} oil change ${c.toLowerCase()}`, intent: "SERVICE", isBranded: false, volumeRange: [480, 1600], difficultyRange: [32, 48], positionBias: 2 },
  { build: (b, c) => `${b.toLowerCase()} brake service ${c.toLowerCase()}`, intent: "SERVICE", isBranded: false, volumeRange: [320, 880], difficultyRange: [30, 46], positionBias: 3 },
  { build: (b, c) => `${b.toLowerCase()} tire rotation ${c.toLowerCase()}`, intent: "SERVICE", isBranded: false, volumeRange: [180, 590], difficultyRange: [26, 42], positionBias: 4 },

  // Inventory
  { build: (b) => `${b.toLowerCase()} f-150 inventory`, intent: "INVENTORY", isBranded: true, volumeRange: [1200, 3600], difficultyRange: [52, 68], positionBias: 5 },
  { build: (b) => `2026 ${b.toLowerCase()} models`, intent: "INFORMATIONAL", isBranded: true, volumeRange: [720, 2900], difficultyRange: [48, 64], positionBias: 3 },
  { build: (b) => `${b.toLowerCase()} certified pre-owned`, intent: "COMMERCIAL", isBranded: true, volumeRange: [880, 2400], difficultyRange: [44, 60], positionBias: 2 },
  { build: (b, c) => `used ${b.toLowerCase()} ${c.toLowerCase()}`, intent: "COMMERCIAL", isBranded: false, volumeRange: [1900, 5400], difficultyRange: [50, 66], positionBias: 4 },
  { build: (b, c) => `${b.toLowerCase()} suv ${c.toLowerCase()}`, intent: "COMMERCIAL", isBranded: false, volumeRange: [880, 2900], difficultyRange: [48, 64], positionBias: 6 },

  // Finance
  { build: (b, c) => `${b.toLowerCase()} financing ${c.toLowerCase()}`, intent: "COMMERCIAL", isBranded: true, volumeRange: [320, 880], difficultyRange: [36, 52], positionBias: 1 },
  { build: (b) => `${b.toLowerCase()} 0 down payment`, intent: "COMMERCIAL", isBranded: true, volumeRange: [210, 720], difficultyRange: [40, 58], positionBias: 4 },
];

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

function makeKeyword(
  template: Template,
  brand: string,
  city: string,
  rng: () => number,
  i: number,
): KeywordRecord {
  const query = template.build(brand, city);
  const searchVolume = rangeInt(rng, template.volumeRange[0], template.volumeRange[1]);
  const difficulty = rangeInt(rng, template.difficultyRange[0], template.difficultyRange[1]);
  const cpcCents = rangeInt(rng, 80, 1450);
  const basePosition = 6 + template.positionBias + (rng() - 0.5) * 4;
  const currentPosition = Math.max(1, Math.round(basePosition * 10) / 10);
  const previousPosition = Math.max(
    1,
    Math.round((currentPosition + (rng() - 0.4) * 3.5) * 10) / 10,
  );
  const bestPosition = Math.max(
    1,
    Math.round(Math.min(currentPosition, previousPosition) - rng() * 1.2),
  );

  // CTR curve based on position
  const ctr = clamp(
    currentPosition <= 1
      ? 28 + rng() * 6
      : currentPosition <= 3
        ? 14 + rng() * 6
        : currentPosition <= 5
          ? 7 + rng() * 4
          : currentPosition <= 10
            ? 2.4 + rng() * 2
            : currentPosition <= 20
              ? 0.6 + rng() * 1.2
              : 0.2 + rng() * 0.5,
    0.05,
    36,
  );
  const impressions = Math.max(
    50,
    Math.round((searchVolume / 30) * (1 + (rng() - 0.5) * 0.4)),
  );
  const clicks = Math.max(0, Math.round((ctr / 100) * impressions));

  return {
    id: `kw-${i}-${hashString(query)}`,
    query,
    intent: template.intent,
    isBranded: template.isBranded,
    searchVolume,
    difficulty,
    cpcCents,
    currentPosition,
    previousPosition,
    bestPosition,
    clicks,
    impressions,
    ctr: Number(ctr.toFixed(2)),
    url: `/inventory`,
  };
}

const CACHE = new Map<string, KeywordRecord[]>();

function buildKeywordsFor(dealershipId: string, brand: string, city: string): KeywordRecord[] {
  const rng = makeRng(hashString(dealershipId + ":keywords"));
  return TEMPLATES.map((tpl, i) => makeKeyword(tpl, brand, city, rng, i));
}

export async function getKeywords(dealershipId: string): Promise<KeywordRecord[]> {
  let cached = CACHE.get(dealershipId);
  if (!cached) {
    const dealership = await getDealership(dealershipId);
    cached = buildKeywordsFor(dealershipId, dealership.brand, dealership.city);
    CACHE.set(dealershipId, cached);
  }
  return cached;
}

export async function getTopMovers(dealershipId: string, limit = 6): Promise<KeywordRecord[]> {
  const keywords = await getKeywords(dealershipId);
  return [...keywords]
    .sort((a, b) => Math.abs(b.previousPosition - b.currentPosition) - Math.abs(a.previousPosition - a.currentPosition))
    .slice(0, limit);
}

export async function keywordSummary(dealershipId: string) {
  const keywords = await getKeywords(dealershipId);
  const total = keywords.length;
  const top10 = keywords.filter((k) => k.currentPosition <= 10).length;
  const top3 = keywords.filter((k) => k.currentPosition <= 3).length;
  const declined = keywords.filter((k) => k.currentPosition > k.previousPosition).length;
  const improved = keywords.filter((k) => k.currentPosition < k.previousPosition).length;
  return { total, top10, top3, declined, improved };
}
