import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#1DB954",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 16,
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontWeight: 900,
          fontSize: 36,
          color: "#0B0D0F",
          letterSpacing: "-0.04em",
        }}
      >
        A3
      </div>
    ),
    { ...size },
  );
}
