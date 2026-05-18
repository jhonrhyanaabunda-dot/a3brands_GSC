import { NextResponse } from "next/server";

import { runScan } from "@/lib/scan";
import { generateReportPdf } from "@/lib/scan/pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Allow up to 3 minutes for the scan + PDF render to complete
export const maxDuration = 180;

export async function GET(req: Request) {
  const url = new URL(req.url).searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "?url=… required" }, { status: 400 });
  }

  const scan = await runScan(url);
  if (!scan.ok) {
    return NextResponse.json(
      { error: scan.error.message, code: scan.error.code },
      { status: 422 },
    );
  }

  let pdf: Buffer;
  try {
    pdf = await generateReportPdf(scan.result);
  } catch (err) {
    return NextResponse.json(
      {
        error: "PDF generation failed.",
        detail: (err as Error)?.message ?? "unknown",
      },
      { status: 500 },
    );
  }

  const filename = `a3-audit-${scan.result.domain}-${new Date().toISOString().slice(0, 10)}.pdf`;
  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "no-store",
    },
  });
}
