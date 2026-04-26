import { notFound } from "next/navigation";
import { allProjects } from "@/constants/work";
import WorkDetailClient from "@/components/work/WorkDetailClient";
import JsonLd from "@/components/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rohangore.com";

export async function generateStaticParams() {
  return allProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = allProjects.find((item) => item.slug === slug);

  if (!project) {
    return {
      title: "Project not found",
      robots: { index: false, follow: false },
    };
  }

  const url = `/work/${project.slug}`;
  const description =
    project.tagline ||
    project.description ||
    `${project.title} — a ${project.category} project by Rohan Gore.`;

  return {
    title: project.title,
    description,
    keywords: project.tags,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `${project.title} | Rohan Gore`,
      description,
      siteName: "Rohan Gore",
      images: project.image
        ? [
            {
              url: project.image,
              width: 1600,
              height: 900,
              alt: project.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Rohan Gore`,
      description,
      images: project.image ? [project.image] : undefined,
    },
  };
}

export default async function WorkDetailPage({ params }) {
  const { slug } = await params;
  const project = allProjects.find((item) => item.slug === slug);

  if (!project) notFound();

  const currentIndex = allProjects.findIndex((item) => item.slug === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  const url = `${SITE_URL}/work/${project.slug}`;
  const imageUrl = project.image
    ? `${SITE_URL}${project.image}`
    : `${SITE_URL}/og-image.jpg`;
  const description =
    project.tagline ||
    project.description ||
    `${project.title} — a ${project.category} project by Rohan Gore.`;

  const creativeWorkSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: project.title,
    description,
    image: imageUrl,
    url,
    keywords: project.tags?.join(", "),
    genre: project.category,
    dateCreated: project.year,
    author: {
      "@type": "Person",
      name: "Rohan Gore",
      url: SITE_URL,
    },
    creator: {
      "@type": "Person",
      name: "Rohan Gore",
      url: SITE_URL,
    },
    ...(project.live && { sameAs: [project.live, project.github].filter(Boolean) }),
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
        name: "Work",
        item: `${SITE_URL}/work`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: url,
      },
    ],
  };

  return (
    <>
      <JsonLd data={creativeWorkSchema} />
      <JsonLd data={breadcrumbSchema} />
      <WorkDetailClient
        project={project}
        prevProject={prevProject}
        nextProject={nextProject}
      />
    </>
  );
}
