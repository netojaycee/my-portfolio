import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";
import { SITE_NAME } from "@/lib/seo";

export const alt = `${SITE_NAME} — Full-Stack & DevOps Engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const photo = fs.readFileSync(path.join(process.cwd(), "public/me.jpeg"));
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0a0a0f",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "72px",
            flex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "#f97316",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              {">_"}
            </div>
            <div style={{ display: "flex", fontSize: 24, color: "#94a3b8", letterSpacing: 2 }}>
              JOHNEDEH.COM
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 68, fontWeight: 800, color: "#e2e8f0" }}>
            John Edeh
          </div>
          <div style={{ display: "flex", fontSize: 34, color: "#f97316", fontWeight: 600, marginTop: 14 }}>
            Full-Stack &amp; DevOps Engineer
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: "#64748b",
              marginTop: 26,
              maxWidth: 620,
              lineHeight: 1.4,
            }}
          >
            Building platforms and the infrastructure they run on. Lagos, Nigeria.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            width: 440,
            height: "100%",
            position: "relative",
          }}
        >
          <img
            src={photoSrc}
            width={440}
            height={630}
            style={{ objectFit: "cover", objectPosition: "top" }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 80,
              height: "100%",
              background:
                "linear-gradient(to right, #0a0a0f, rgba(10,10,15,0))",
              display: "flex",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
