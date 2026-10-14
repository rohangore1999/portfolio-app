import { ImageResponse } from "next/og";

export const alt = "Rohan Gore - Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000000",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            backgroundColor: "#1a1a1a",
            border: "2px solid #333",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "40px",
            fontWeight: 700,
            marginBottom: "32px",
          }}
        >
          RG
        </div>
        <div
          style={{
            fontSize: "56px",
            fontWeight: 700,
            marginBottom: "16px",
          }}
        >
          Rohan Gore
        </div>
        <div
          style={{
            fontSize: "24px",
            color: "#888",
            fontWeight: 400,
          }}
        >
          Software Engineer
        </div>
        <div
          style={{
            fontSize: "16px",
            color: "#555",
            marginTop: "32px",
          }}
        >
          rohangore.com
        </div>
      </div>
    ),
    { ...size }
  );
}
