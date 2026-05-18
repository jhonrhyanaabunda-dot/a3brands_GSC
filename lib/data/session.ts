import "server-only";

import { cookies } from "next/headers";

import type { SessionContext } from "./types";
import { getDealership, listDealerships } from "./dealerships";

const ACTIVE_DEALERSHIP_COOKIE = "a3.active_dealership";

function isDemoMode() {
  return process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE !== "false";
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Returns the current session context for dashboard pages.
 * In demo mode, returns a deterministic principal-dealer user.
 * When connected to a real DB, this is the seam where Auth.js + Prisma lookups
 * replace the demo path.
 */
export async function getSessionContext(): Promise<SessionContext> {
  const cookieStore = await cookies();
  const activeDealershipId = cookieStore.get(ACTIVE_DEALERSHIP_COOKIE)?.value;
  const dealership = await getDealership(activeDealershipId);

  if (isDemoMode()) {
    return {
      user: {
        id: "usr-demo-principal",
        name: "Charles Rourke",
        email: "principal@lonestarford.com",
        role: "ADMIN",
        title: "Principal Dealer",
        avatarInitials: initialsOf("Charles Rourke"),
      },
      dealership,
      isDemo: true,
    };
  }

  // Real-auth path (kept here so the seam is obvious for the next milestone).
  // Once a DB is connected, swap this branch to `await auth()` + a Prisma fetch.
  return {
    user: {
      id: "usr-demo-principal",
      name: "Charles Rourke",
      email: "principal@lonestarford.com",
      role: "ADMIN",
      title: "Principal Dealer",
      avatarInitials: initialsOf("Charles Rourke"),
    },
    dealership,
    isDemo: false,
  };
}

export async function listSwitchableDealerships() {
  return listDealerships();
}

export const SESSION_COOKIES = { ACTIVE_DEALERSHIP: ACTIVE_DEALERSHIP_COOKIE };
