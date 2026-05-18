"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { SESSION_COOKIES, getDealership } from "@/lib/data";

export async function switchDealership(idOrSlug: string) {
  const dealership = await getDealership(idOrSlug);
  const jar = await cookies();
  jar.set(SESSION_COOKIES.ACTIVE_DEALERSHIP, dealership.id, {
    path: "/",
    sameSite: "lax",
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 30,
  });
  revalidatePath("/", "layout");
  return { ok: true, dealershipId: dealership.id };
}
