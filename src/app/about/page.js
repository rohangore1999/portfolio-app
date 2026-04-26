import AboutPageClient from "@/components/about/AboutPageClient";

export const metadata = {
  title: "About",
  description:
    "About Rohan Gore — software engineer at Myntra building full-stack web applications, AI tools, and developer experiences. Also into bodybuilding and mobile photography.",
  keywords: [
    "Rohan Gore",
    "About Rohan Gore",
    "Software Engineer Myntra",
    "Full Stack Developer",
    "React Engineer",
    "Next.js Developer",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    url: "/about",
    title: "About | Rohan Gore",
    description:
      "Software engineer building full-stack web apps, AI tools, and developer experiences. Bodybuilding and photography on the side.",
    siteName: "Rohan Gore",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rohan Gore",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Rohan Gore",
    description:
      "Software engineer building full-stack web apps, AI tools, and developer experiences.",
    images: ["/og-image.jpg"],
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
