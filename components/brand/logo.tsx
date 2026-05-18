import { cn } from "@/lib/utils";

/**
 * A3 Brands LLC - wordmark only.
 *
 * "A3 Brands LLC" + "AUTOMOTIVE SEO EXPERTS" tagline.
 * `variant="light"` on dark surfaces; `variant="dark"` on white surfaces.
 */
export function Logo({
  variant = "dark",
  size = "md",
  className,
  showTagline = true,
}: {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  className?: string;
  showTagline?: boolean;
}) {
  const sizes = {
    sm: { fontMain: 14, fontTag: 6 },
    md: { fontMain: 18, fontTag: 7 },
    lg: { fontMain: 22, fontTag: 8 },
  };
  const s = sizes[size];

  const textPrimary = variant === "light" ? "#FFFFFF" : "#2C3038";
  const textTagline = "#1DB954";

  return (
    <div
      className={cn("inline-flex flex-col leading-none", className)}
      aria-label="A3 Brands LLC - Automotive SEO Experts"
    >
      <div
        className="font-display font-black tracking-tight"
        style={{
          color: textPrimary,
          fontSize: s.fontMain,
          letterSpacing: "-0.01em",
        }}
      >
        A3 Brands
        <span
          style={{
            fontSize: s.fontMain * 0.5,
            marginLeft: 4,
            verticalAlign: "top",
            opacity: 0.6,
            letterSpacing: "0.05em",
          }}
        >
          LLC
        </span>
      </div>
      {showTagline ? (
        <div
          className="font-display font-bold uppercase"
          style={{
            color: textTagline,
            fontSize: s.fontTag,
            letterSpacing: "0.18em",
            marginTop: 3,
          }}
        >
          Automotive SEO Experts
        </div>
      ) : null}
    </div>
  );
}
