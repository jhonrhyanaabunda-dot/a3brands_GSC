import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Minimal file-backed lead store. Writes JSONL to /tmp/a3-leads.jsonl so
 * lead capture demonstrably works without a database. Swap for Prisma /
 * HubSpot / Postmark when ready.
 */

const LEAD_FILE = path.join("/tmp", "a3-leads.jsonl");

export interface LeadRecord {
  id: string;
  name: string;
  email: string;
  company?: string;
  role?: string;
  websiteUrl?: string;
  scanScore?: number;
  scanDomain?: string;
  source: "scan" | "demo" | "contact";
  createdAt: string;
  userAgent?: string;
}

function newId() {
  return (
    Date.now().toString(36) +
    "-" +
    Math.random().toString(36).slice(2, 8)
  );
}

export async function saveLead(
  partial: Omit<LeadRecord, "id" | "createdAt">,
): Promise<LeadRecord> {
  const record: LeadRecord = {
    id: newId(),
    createdAt: new Date().toISOString(),
    ...partial,
  };
  try {
    await fs.appendFile(LEAD_FILE, JSON.stringify(record) + "\n", "utf8");
  } catch (err) {
    // File write isn't critical for the user flow - log and continue
    // eslint-disable-next-line no-console
    console.error("[leads] failed to persist:", err);
  }
  return record;
}

export async function recentLeads(limit = 25): Promise<LeadRecord[]> {
  try {
    const text = await fs.readFile(LEAD_FILE, "utf8");
    const lines = text.trim().split("\n");
    return lines
      .slice(-limit)
      .map((l) => JSON.parse(l) as LeadRecord)
      .reverse();
  } catch {
    return [];
  }
}
