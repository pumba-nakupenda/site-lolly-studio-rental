import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "LOLLY — Agence de Conseil en Communication";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "80px",
          backgroundColor: "#0c0f0f",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.04em",
            lineHeight: 0.9,
          }}
        >
          LOLLY
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#fed000",
            marginTop: 24,
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
          }}
        >
          Agence de Conseil en Communication
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#767777",
            marginTop: 16,
          }}
        >
          Dakar, Sénégal — lolly.sn
        </div>
      </div>
    ),
    { ...size }
  );
}
