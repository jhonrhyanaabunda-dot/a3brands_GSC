"use server";

import { z } from "zod";

import { saveLead } from "@/lib/leads";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  company: z.string().max(160).optional(),
  role: z.string().max(80).optional(),
  websiteUrl: z.string().max(300).optional(),
  scanDomain: z.string().max(200).optional(),
  scanScore: z.number().int().min(0).max(100).optional(),
  source: z.enum(["scan", "demo", "contact"]),
});

export type LeadFormState =
  | { status: "idle" }
  | { status: "ok"; id: string }
  | { status: "error"; message: string };

export async function submitLead(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const raw = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim() || undefined,
    role: String(formData.get("role") ?? "").trim() || undefined,
    websiteUrl: String(formData.get("websiteUrl") ?? "").trim() || undefined,
    scanDomain: String(formData.get("scanDomain") ?? "").trim() || undefined,
    scanScore: formData.get("scanScore")
      ? Number(formData.get("scanScore"))
      : undefined,
    source: (formData.get("source") as "scan" | "demo" | "contact") ?? "scan",
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Invalid form input.",
    };
  }

  try {
    const rec = await saveLead(parsed.data);
    return { status: "ok", id: rec.id };
  } catch {
    return {
      status: "error",
      message: "Couldn't save your details. Try again in a moment.",
    };
  }
}
