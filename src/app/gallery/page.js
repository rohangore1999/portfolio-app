// import GalleryClient from "@/components/gallery/GalleryClient";
import GalleryPolaroidClient from "@/components/gallery-polaroid/GalleryPolaroidClient";

export const metadata = {
  title: "Gallery",
  description: "Mobile photography collection showcasing urban landscapes, street scenes, and moments captured through my lens.",
  openGraph: {
    title: "Gallery - Rohan Gore",
    description: "Mobile photography collection showcasing urban landscapes and street scenes.",
    type: "website",
  },
};

export default function GalleryPage() {
  // return <GalleryClient />;
  return <GalleryPolaroidClient />;
}
