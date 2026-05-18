"use server";

import { runScan } from "@/lib/scan";
import type { ScanError, ScanResult } from "@/lib/scan";

export async function performScanAction(
  input: string,
): Promise<{ ok: true; result: ScanResult } | { ok: false; error: ScanError }> {
  return runScan(input);
}
