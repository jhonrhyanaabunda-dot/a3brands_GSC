"use client";

import * as React from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

/**
 * Triggers the /api/scan/pdf endpoint and saves the response as a download.
 * Shows a loading state while the server is re-running the scan + rendering
 * the PDF (typically 8-30s) so the UI never looks broken.
 */
export function PdfDownloadButton({ url }: { url: string }) {
  const [pending, setPending] = React.useState(false);

  const handleClick = async () => {
    if (pending) return;
    setPending(true);
    const toastId = toast.loading("Generating PDF…", {
      description: "Re-running the scan and rendering the branded report.",
    });

    try {
      const res = await fetch(
        `/api/scan/pdf?url=${encodeURIComponent(url)}`,
        { cache: "no-store" },
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "PDF failed" }));
        throw new Error(body.error ?? "PDF failed");
      }
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);

      // Extract filename from Content-Disposition header if present
      const cd = res.headers.get("content-disposition") ?? "";
      const fnMatch = /filename="([^"]+)"/.exec(cd);
      const filename = fnMatch?.[1] ?? "a3-audit-report.pdf";

      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);

      toast.success("PDF downloaded.", {
        id: toastId,
        description: `Saved as ${filename}`,
        duration: 4000,
      });
    } catch (err) {
      toast.error("PDF generation failed.", {
        id: toastId,
        description: (err as Error)?.message ?? "Try again in a moment.",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      type="button"
      variant="default"
      size="default"
      onClick={handleClick}
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          GENERATING…
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          DOWNLOAD PDF REPORT
        </>
      )}
    </Button>
  );
}
