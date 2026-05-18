import type { Metadata } from "next";

import {
  getGbpHealth,
  getLocalQueries,
  getMapPackGrid,
  getReviewSnapshot,
  getSessionContext,
  getTechnicalIssues,
} from "@/lib/data";

import { LocalSeoClient } from "./client";

export const metadata: Metadata = {
  title: "Local SEO",
};

export default async function LocalSeoPage() {
  const session = await getSessionContext();
  const [queries, gridDefault, reviews, gbp, issues] = await Promise.all([
    getLocalQueries(session.dealership.id),
    getMapPackGrid(session.dealership.id),
    getReviewSnapshot(session.dealership.id),
    getGbpHealth(session.dealership.id),
    getTechnicalIssues(session.dealership.id),
  ]);

  return (
    <LocalSeoClient
      queries={queries}
      initialQuery={queries[0] ?? "dealer near me"}
      initialGrid={gridDefault}
      reviews={reviews}
      gbp={gbp}
      issues={issues}
      dealershipName={session.dealership.name}
      city={session.dealership.city}
      state={session.dealership.state}
    />
  );
}
