import { ImageResponse } from "next/og";

// Rendered once at build time → /opengraph-image.png (used by LinkedIn, X, Slack previews)
export const dynamic = "force-static";
export const alt = "Hicham Alaoui — AI Engineer · LLM Systems for Finance";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const bars = [8, 22, 48, 74, 92, 100, 94, 80, 64, 50, 38, 29, 22, 17, 13, 10, 8, 6, 5, 4];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#17171c",
          color: "#ffffff",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, color: "rgba(255,255,255,0.6)" }}>
          <div style={{ width: 12, height: 12, borderRadius: 12, background: "#ff7759" }} />
          HICHAM ALAOUI
        </div>

        <div style={{ display: "flex", fontSize: 76, lineHeight: 1.02, letterSpacing: -2, maxWidth: 900 }}>
          I build AI systems finance teams actually use.
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 26, color: "rgba(255,255,255,0.65)" }}>
            AI Engineer · LLM Systems for Finance
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 110 }}>
            {bars.map((h, i) => (
              <div
                key={i}
                style={{
                  width: 12,
                  height: h,
                  borderRadius: 2,
                  background: i >= 12 ? "#ff7759" : "rgba(255,255,255,0.25)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
