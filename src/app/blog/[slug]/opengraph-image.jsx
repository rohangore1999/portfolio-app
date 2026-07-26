import { ImageResponse } from "next/og";
import { getPostBySlug, getAllSlugs } from "@/lib/mdx";

export const alt = "Blog post cover";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function OgImage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  const title = post?.title || "Blog";
  const category = post?.category || "Engineering";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          backgroundColor: "#000000",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "2px",
              color: "#a0a0a0",
              borderBottom: "2px solid #333",
              paddingBottom: "8px",
            }}
          >
            {category}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            style={{
              fontSize: title.length > 50 ? "40px" : "52px",
              fontWeight: 700,
              lineHeight: 1.2,
              maxWidth: "900px",
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#333",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                fontWeight: 700,
              }}
            >
              RG
            </div>
            <div style={{ fontSize: "18px", fontWeight: 500 }}>Rohan Gore</div>
          </div>
          <div style={{ fontSize: "16px", color: "#666" }}>rohangore.com</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
