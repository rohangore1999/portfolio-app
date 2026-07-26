import HomeClient from "./HomeClient";

export const metadata = {
  title: "Rohan Gore - Software Engineer",
  description:
    "Personal website of Rohan Gore — software engineer specializing in full-stack development, building scalable web applications with modern technologies.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: "Rohan Gore - Software Engineer",
    description:
      "Software engineer specializing in full-stack development, building scalable web applications with modern technologies.",
    siteName: "Rohan Gore",
    images: [
      {
        url: "/og-image.jpg",
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
      "Software engineer specializing in full-stack development, building scalable web applications with modern technologies.",
    images: ["/og-image.jpg"],
  },
};

export default function HomePage() {
  return (
    <>
      <link
        rel="preload"
        href="/images/home/hero-section-web.jpg"
        as="image"
        fetchPriority="high"
      />
      <HomeClient />
    </>
  );
}
