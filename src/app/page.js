import HomeClient from "./HomeClient";

export const metadata = {
  title: { absolute: "Rohan Gore - Software Engineer" },
  description:
    "Rohan Gore is a Technical Lead at Myntra in Bangalore. Turning AI slop into something I can put my name on.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: "Rohan Gore - Software Engineer",
    description:
      "Technical Lead at Myntra in Bangalore. Turning AI slop into something I can put my name on.",
    siteName: "Rohan Gore",
    images: [
      {
        url: "/social-rohan-cobra.jpg",
        width: 1200,
        height: 630,
        alt: "Rohan Gore - Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rohan Gore - Software Engineer",
    description:
      "Technical Lead at Myntra in Bangalore. Turning AI slop into something I can put my name on.",
    images: ["/social-rohan-cobra.jpg"],
  },
};

export default function HomePage() {
  return <HomeClient whoopPreviewEnabled />;
}
