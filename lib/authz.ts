import type { Role } from "@prisma/client";

import { auth } from "@/auth";

/**
 * Lightweight role helpers for server-side authorization.
 * Use these in server actions and RSCs - middleware handles route gating.
 */

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Administrator",
  DEALER_GROUP: "Dealer Group",
  MARKETING_DIRECTOR: "Marketing Director",
  GENERAL_MANAGER: "General Manager",
};

export const ROLE_RANK: Record<Role, number> = {
  GENERAL_MANAGER: 1,
  MARKETING_DIRECTOR: 2,
  DEALER_GROUP: 3,
  ADMIN: 4,
};

export function hasRoleAtLeast(role: Role | null | undefined, minimum: Role) {
  if (!role) return false;
  return ROLE_RANK[role] >= ROLE_RANK[minimum];
}

export async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("UNAUTHENTICATED");
  }
  return session.user;
}

export async function requireRole(minimum: Role) {
  const user = await requireUser();
  if (!hasRoleAtLeast(user.role, minimum)) {
    throw new Error("FORBIDDEN");
  }
  return user;
}

export async function requireAdmin() {
  return requireRole("ADMIN");
}
