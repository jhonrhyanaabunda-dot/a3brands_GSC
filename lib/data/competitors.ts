import "server-only";

import type { CompetitorRecord } from "./types";
import { hashString, makeRng, rangeInt, range } from "./rng";

const COMPETITORS: Array<{
  name: string;
  domain: string;
  brand: string;
  distanceRange: [number, number];
}> = [
  { name: "AutoNation Ford", domain: "autonationford.example", brand: "FORD", distanceRange: [3, 9] },
  { name: "Group 1 Toyota", domain: "group1toyota.example", brand: "TOYOTA", distanceRange: [4, 10] },
  { name: "Sonic Automotive Honda", domain: "sonichonda.example", brand: "HONDA", distanceRange: [5, 11] },
  { name: "Lithia Chevrolet", domain: "lithiachevy.example", brand: "CHEVROLET", distanceRange: [6, 14] },
  { name: "Penske BMW", domain: "penskebmw.example", brand: "BMW", distanceRange: [7, 16] },
  { name: "Sewell Automotive", domain: "sewell.example", brand: "GENERIC", distanceRange: [3, 12] },
];

const CACHE = new Map<string, CompetitorRecord[]>();

function buildCompetitors(dealershipId: string): CompetitorRecord[] {
  const rng = makeRng(hashString(dealershipId + ":competitors"));
  return COMPETITORS.map((c, i) => {
    const visibility = rangeInt(rng, 48, 92);
    return {
      id: `cmp-${dealershipId}-${i}`,
      name: c.name,
      domain: c.domain,
      brand: c.brand,
      distanceMiles: Number(range(rng, c.distanceRange[0], c.distanceRange[1]).toFixed(1)),
      visibilityScore: visibility,
      sharedKeywords: rangeInt(rng, 64, 240),
      outrankedBy: rangeInt(rng, 8, 56),
      averagePosition: Number(range(rng, 3.4, 12.2).toFixed(1)),
      estimatedTraffic: rangeInt(rng, 4200, 38000),
      delta: Number(range(rng, -8, 8).toFixed(1)),
    };
  }).sort((a, b) => b.visibilityScore - a.visibilityScore);
}

export async function getCompetitors(dealershipId: string): Promise<CompetitorRecord[]> {
  let cached = CACHE.get(dealershipId);
  if (!cached) {
    cached = buildCompetitors(dealershipId);
    CACHE.set(dealershipId, cached);
  }
  return cached;
}

export async function getCompetitorBenchmark(
  dealershipId: string,
  yourVisibility: number,
): Promise<Array<{ name: string; visibility: number; you: boolean }>> {
  const comps = await getCompetitors(dealershipId);
  const all = [
    ...comps.map((c) => ({ name: c.name, visibility: c.visibilityScore, you: false })),
    { name: "Your group", visibility: yourVisibility, you: true },
  ];
  return all.sort((a, b) => b.visibility - a.visibility);
}
