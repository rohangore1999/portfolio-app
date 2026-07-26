// import GalleryClient from "@/components/gallery/GalleryClient";
import GalleryPolaroidClient from "@/components/gallery-polaroid/GalleryPolaroidClient";

export const metadata = {
  title: "Gallery",
  description:
    "Mobile photography collection showcasing urban landscapes, street scenes, and moments captured through my lens.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    type: "website",
    url: "/gallery",
    title: "Gallery | Rohan Gore",
    description:
      "Mobile photography collection showcasing urban landscapes and street scenes.",
    siteName: "Rohan Gore",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rohan Gore Photography Gallery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallery | Rohan Gore",
    description:
      "Mobile photography collection showcasing urban landscapes and street scenes.",
    images: ["/og-image.jpg"],
  },
};

export default function GalleryPage() {
  // return <GalleryClient />;
  return <GalleryPolaroidClient />;
}
