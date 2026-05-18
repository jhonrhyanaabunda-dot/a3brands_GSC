import "server-only";

import type { UserRecord } from "./types";
import { listDealerships } from "./dealerships";

let cachedUsers: UserRecord[] | null = null;

export async function listUsers(): Promise<UserRecord[]> {
  if (cachedUsers) return cachedUsers;

  const dealerships = await listDealerships();
  const allDealerIds = dealerships.map((d) => d.id);
  const firstThree = allDealerIds.slice(0, 3);
  const firstTwo = allDealerIds.slice(0, 2);

  const now = Date.now();
  const days = (n: number) => new Date(now - n * 24 * 60 * 60 * 1000).toISOString();
  const hours = (n: number) => new Date(now - n * 60 * 60 * 1000).toISOString();

  cachedUsers = [
    {
      id: "usr-principal",
      name: "Charles Rourke",
      email: "principal@lonestarford.com",
      role: "ADMIN",
      title: "Principal Dealer",
      dealerships: allDealerIds,
      active: true,
      lastLogin: hours(2),
      createdAt: days(412),
    },
    {
      id: "usr-marketing",
      name: "Priya Desai",
      email: "marketing@lonestarford.com",
      role: "MARKETING_DIRECTOR",
      title: "Marketing Director",
      dealerships: allDealerIds,
      active: true,
      lastLogin: hours(6),
      createdAt: days(280),
    },
    {
      id: "usr-gm",
      name: "Marcus Hill",
      email: "gm@lonestarford.com",
      role: "GENERAL_MANAGER",
      title: "General Manager - Plano",
      dealerships: firstTwo,
      active: true,
      lastLogin: hours(28),
      createdAt: days(192),
    },
    {
      id: "usr-vp",
      name: "Sandra Liang",
      email: "sandra.liang@lonestarford.com",
      role: "DEALER_GROUP",
      title: "VP of Operations",
      dealerships: allDealerIds,
      active: true,
      lastLogin: hours(38),
      createdAt: days(140),
    },
    {
      id: "usr-gm-frisco",
      name: "Devin Park",
      email: "devin.park@lonestarford.com",
      role: "GENERAL_MANAGER",
      title: "General Manager - Frisco",
      dealerships: firstThree,
      active: true,
      lastLogin: hours(11),
      createdAt: days(88),
    },
    {
      id: "usr-content",
      name: "Allison Vega",
      email: "allison.vega@lonestarford.com",
      role: "MARKETING_DIRECTOR",
      title: "Content Lead",
      dealerships: allDealerIds,
      active: true,
      lastLogin: hours(50),
      createdAt: days(64),
    },
    {
      id: "usr-paused",
      name: "Tyler Sanchez",
      email: "tyler.sanchez@lonestarford.com",
      role: "GENERAL_MANAGER",
      title: "GM (paused)",
      dealerships: firstTwo,
      active: false,
      lastLogin: days(28),
      createdAt: days(220),
    },
  ];
  return cachedUsers;
}
