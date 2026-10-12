import HomeClient from "./HomeClient";

export const metadata = {
  title: { absolute: "Rohan Gore - Software Engineer" },
  description:
    "Rohan Gore is a Technical Lead at Myntra in Bangalore, building full-stack applications, AI tools, and developer experiences.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: "Rohan Gore - Technical Lead & Software Engineer",
    description:
      "Technical Lead at Myntra in Bangalore, building full-stack applications, AI tools, and developer experiences.",
    siteName: "Rohan Gore",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rohan Gore - Technical Lead & Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rohan Gore - Technical Lead & Software Engineer",
    description:
      "Technical Lead at Myntra in Bangalore, building full-stack applications, AI tools, and developer experiences.",
    images: ["/og-image.jpg"],
  },
};

export default function HomePage() {
  return <HomeClient whoopPreviewEnabled />;
}
