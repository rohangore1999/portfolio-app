import WorkPageClient from "@/components/work/WorkPageClient";
import { allProjects } from "@/constants/work";

export const metadata = {
  title: "Work",
  description:
    "Selected projects by Rohan Gore — a VS Code extension, a RAG-powered design-system assistant for Myntra, an AI Chrome extension for YouTube, and a voice-enabled e-commerce agent.",
  keywords: [
    "Rohan Gore Projects",
    "Software Engineering Portfolio",
    "Full Stack Projects",
    ...allProjects.flatMap((p) => p.tags || []),
  ],
  alternates: { canonical: "/work" },
  openGraph: {
    type: "website",
    url: "/work",
    title: "Work | Rohan Gore",
    description:
      "Selected projects by Rohan Gore — engineering ideas into products across AI, developer tools, and full-stack web.",
    siteName: "Rohan Gore",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rohan Gore — Work",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Work | Rohan Gore",
    description:
      "Selected projects by Rohan Gore — engineering ideas into products.",
    images: ["/og-image.jpg"],
  },
};

export default function WorkPage() {
  return <WorkPageClient />;
}
