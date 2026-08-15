import { notFound } from "next/navigation";
import { allProjects } from "@/constants/work";
import WorkDetailClient from "@/components/work/WorkDetailClient";
import JsonLd from "@/components/JsonLd";
import blurDataAll from "@/constants/blurDataAll.json";
import { SITE_URL } from "@/lib/site";

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
  const socialImage = project.ogImage || project.image;
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
      images: socialImage
        ? [
            {
              url: socialImage,
              width: project.ogImageWidth || 1600,
              height: project.ogImageHeight || 900,
              alt: project.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Rohan Gore`,
      description,
      images: socialImage ? [socialImage] : undefined,
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
  const imageUrl = (project.ogImage || project.image)
    ? `${SITE_URL}${project.ogImage || project.image}`
    : `${SITE_URL}/og-image.jpg`;
  const description =
    project.tagline ||
    project.description ||
    `${project.title} — a ${project.category} project by Rohan Gore.`;

  const baseAuthor = {
    "@type": "Person",
    name: "Rohan Gore",
    url: SITE_URL,
  };

  const creativeWorkSchema = project.softwareApplication
    ? {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: project.title,
        description,
        image: imageUrl,
        screenshot: `${SITE_URL}/images/work/pulse-notch/notch-live-elevated-437.png`,
        url,
        applicationCategory:
          project.softwareApplication.applicationCategory,
        operatingSystem: project.softwareApplication.operatingSystem,
        softwareVersion: project.softwareApplication.softwareVersion,
        isAccessibleForFree:
          project.softwareApplication.isAccessibleForFree,
        downloadUrl: project.download?.href,
        featureList: project.softwareApplication.featureList,
        author: baseAuthor,
        creator: baseAuthor,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        sameAs: [project.github].filter(Boolean),
      }
    : {
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
    author: baseAuthor,
    creator: baseAuthor,
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
        project={{
          ...project,
          media: project.media?.map((item) => ({
            ...item,
            blurDataURL: item.type === "image" && item.src ? blurDataAll[item.src] || null : null,
          })),
        }}
        prevProject={prevProject}
        nextProject={nextProject}
      />
    </>
  );
}
