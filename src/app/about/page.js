import AboutPageClient from "@/components/about/AboutPageClient";
import { getYearsOfExperience } from "@/lib/experience";

// Refresh the server-rendered year count without requiring a new deployment.
export const revalidate = 86400;

export const metadata = {
  title: "About",
  description:
    "About Rohan Gore — Technical Lead at Myntra. Turning AI slop into something I can put my name on. Also into bodybuilding and mobile photography.",
  keywords: [
    "Rohan Gore",
    "About Rohan Gore",
    "Technical Lead Myntra",
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
      "Technical Lead at Myntra. Turning AI slop into something I can put my name on. Fitness and photography outside work.",
    siteName: "Rohan Gore",
    images: [
      {
        url: "/social-rohan-cobra.jpg",
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
      "Technical Lead at Myntra. Turning AI slop into something I can put my name on.",
    images: ["/social-rohan-cobra.jpg"],
  },
};

export default function AboutPage() {
  return <AboutPageClient yearsOfExperience={getYearsOfExperience()} />;
}
