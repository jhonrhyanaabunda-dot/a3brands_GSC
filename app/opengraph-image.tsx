import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "A3 Brands GSC Intelligence Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0B0D0F",
          display: "flex",
          flexDirection: "column",
          padding: 80,
          position: "relative",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: -200,
            left: "50%",
            width: 900,
            height: 600,
            transform: "translateX(-50%)",
            background:
              "radial-gradient(ellipse at center, rgba(29,185,84,0.35) 0%, rgba(11,13,15,0) 70%)",
          }}
        />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              background: "#1DB954",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: 24,
              color: "#0B0D0F",
              boxShadow: "0 0 40px rgba(29,185,84,0.4)",
            }}
          >
            A3
          </div>
          <div
            style={{
              fontWeight: 800,
              fontSize: 26,
              color: "white",
              letterSpacing: "-0.02em",
            }}
          >
            A3 Brands
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            marginTop: 90,
            fontWeight: 900,
            fontSize: 88,
            lineHeight: 1.05,
            color: "white",
            letterSpacing: "-0.03em",
            maxWidth: 1040,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>See how your dealership</span>
          <span style={{ color: "#1DB954" }}>performs on Google.</span>
        </div>

        {/* Tag pills */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {["AI INSIGHTS", "LOCAL SEO", "MULTI-ROOFTOP", "GSC INTELLIGENCE"].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "8px 16px",
                borderRadius: 4,
                background: "rgba(29,185,84,0.15)",
                border: "1px solid #1DB954",
                color: "#1DB954",
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: "0.05em",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
