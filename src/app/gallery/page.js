import GalleryPolaroidClient from "@/components/gallery-polaroid/GalleryPolaroidClient";
import JsonLd from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";
import { galleryItems } from "@/constants/galleryData";

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
  const galleryUrl = `${SITE_URL}/gallery`;

  const imageGallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Photography Gallery by Rohan Gore",
    description:
      "Mobile photography collection by Rohan Gore — urban landscapes, street scenes, and moments captured on the go.",
    url: galleryUrl,
    author: {
      "@type": "Person",
      name: "Rohan Gore",
      url: SITE_URL,
    },
    numberOfItems: galleryItems.length,
    associatedMedia: galleryItems.map((item) => ({
      "@type": "ImageObject",
      contentUrl: `${SITE_URL}${item.image}`,
      thumbnailUrl: `${SITE_URL}${item.image}`,
      creator: {
        "@type": "Person",
        name: "Rohan Gore",
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Gallery",
        item: galleryUrl,
      },
    ],
  };

  return (
    <>
      <JsonLd data={imageGallerySchema} />
      <JsonLd data={breadcrumbSchema} />
      <GalleryPolaroidClient />
    </>
  );
}
