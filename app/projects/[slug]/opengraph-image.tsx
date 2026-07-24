import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug, published: true },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
  });

  const heroUrl = project?.images[0]?.url;
  let heroSrc: string | undefined;
  if (heroUrl) {
    try {
      const res = await fetch(heroUrl);
      const buf = await res.arrayBuffer();
      const contentType = res.headers.get("content-type") ?? "image/jpeg";
      heroSrc = `data:${contentType};base64,${Buffer.from(buf).toString("base64")}`;
    } catch {
      heroSrc = undefined;
    }
  }

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
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "#f97316",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              {">_"}
            </div>
            <div style={{ display: "flex", fontSize: 22, color: "#94a3b8", letterSpacing: 2 }}>
              JOHNEDEH.COM
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 60, fontWeight: 800, color: "#e2e8f0" }}>
            {project?.name ?? "Project"}
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#f97316", fontWeight: 600, marginTop: 14 }}>
            {project?.tagline ?? ""}
          </div>
        </div>
        {heroSrc && (
          <div style={{ display: "flex", width: 480, height: "100%", position: "relative" }}>
            <img
              src={heroSrc}
              width={480}
              height={630}
              style={{ objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 80,
                height: "100%",
                background: "linear-gradient(to right, #0a0a0f, rgba(10,10,15,0))",
                display: "flex",
              }}
            />
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}
