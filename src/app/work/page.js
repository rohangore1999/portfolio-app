import WorkPageClient from "@/components/work/WorkPageClient";
import { allProjects } from "@/constants/work";
import JsonLd from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Work",
  description:
    "Selected projects by Rohan Gore — including Pulse Notch, a native macOS WHOOP heart-rate companion, alongside AI, developer-tool, and full-stack products.",
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
      "Selected projects by Rohan Gore — engineering ideas into native macOS apps, AI products, developer tools, and full-stack web.",
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
      "Selected projects by Rohan Gore — native macOS apps, AI products, developer tools, and full-stack web.",
    images: ["/og-image.jpg"],
  },
};

export default function WorkPage() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Projects by Rohan Gore",
    itemListOrder: "https://schema.org/ItemListUnordered",
    numberOfItems: allProjects.length,
    itemListElement: allProjects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/work/${project.slug}`,
      name: project.title,
    })),
  };

  return (
    <>
      <JsonLd data={itemListSchema} />
      <WorkPageClient />
    </>
  );
}
