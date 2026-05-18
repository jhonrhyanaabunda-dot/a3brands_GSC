import "server-only";

import type { DealershipRecord } from "./types";
import { hashString, makeRng, rangeInt } from "./rng";

const SEEDS: Array<
  Omit<
    DealershipRecord,
    | "id"
    | "seoHealthScore"
    | "leadOpportunityScore"
    | "localVisibilityScore"
    | "competitorRank"
    | "competitorCount"
    | "lastScannedAt"
  >
> = [
  {
    slug: "lonestar-ford-plano",
    name: "A3 Brands Ford of Plano",
    brand: "FORD",
    tier: "FLAGSHIP",
    city: "Plano",
    state: "TX",
    websiteUrl: "https://lonestarford-plano.example",
    gbpUrl: "https://www.google.com/maps/place/lonestar-ford-plano",
    marketArea: "Dallas-Fort Worth Metroplex",
  },
  {
    slug: "lonestar-toyota-frisco",
    name: "A3 Brands Toyota of Frisco",
    brand: "TOYOTA",
    tier: "STANDARD",
    city: "Frisco",
    state: "TX",
    websiteUrl: "https://lonestartoyota-frisco.example",
    gbpUrl: "https://www.google.com/maps/place/lonestar-toyota-frisco",
    marketArea: "Dallas-Fort Worth Metroplex",
  },
  {
    slug: "lonestar-honda-dallas",
    name: "A3 Brands Honda Dallas",
    brand: "HONDA",
    tier: "STANDARD",
    city: "Dallas",
    state: "TX",
    websiteUrl: "https://lonestarhonda-dallas.example",
    gbpUrl: "https://www.google.com/maps/place/lonestar-honda-dallas",
    marketArea: "Dallas-Fort Worth Metroplex",
  },
  {
    slug: "lonestar-chevrolet-austin",
    name: "A3 Brands Chevrolet Austin",
    brand: "CHEVROLET",
    tier: "STANDARD",
    city: "Austin",
    state: "TX",
    websiteUrl: "https://lonestarchevy-austin.example",
    gbpUrl: "https://www.google.com/maps/place/lonestar-chevy-austin",
    marketArea: "Austin Metro",
  },
  {
    slug: "lonestar-bmw-houston",
    name: "A3 Brands BMW Houston",
    brand: "BMW",
    tier: "FLAGSHIP",
    city: "Houston",
    state: "TX",
    websiteUrl: "https://lonestarbmw-houston.example",
    gbpUrl: "https://www.google.com/maps/place/lonestar-bmw-houston",
    marketArea: "Greater Houston",
  },
];

const NOW = Date.now();

const DEALERSHIPS: DealershipRecord[] = SEEDS.map((seed) => {
  const id = `dealer-${seed.slug}`;
  const rng = makeRng(hashString(seed.slug));
  const tierBoost = seed.tier === "FLAGSHIP" ? 6 : 0;
  return {
    ...seed,
    id,
    seoHealthScore: rangeInt(rng, 62, 88) + tierBoost,
    leadOpportunityScore: rangeInt(rng, 58, 92) + tierBoost,
    localVisibilityScore: rangeInt(rng, 60, 92) + tierBoost,
    competitorRank: rangeInt(rng, 1, 6),
    competitorCount: 6,
    lastScannedAt: new Date(NOW - rangeInt(rng, 1, 22) * 60 * 60 * 1000).toISOString(),
  };
});

export async function listDealerships(): Promise<DealershipRecord[]> {
  return DEALERSHIPS;
}

export async function getDealership(
  idOrSlug?: string,
): Promise<DealershipRecord> {
  if (!idOrSlug) return DEALERSHIPS[0]!;
  return (
    DEALERSHIPS.find((d) => d.id === idOrSlug || d.slug === idOrSlug) ??
    DEALERSHIPS[0]!
  );
}
