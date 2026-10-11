import { SITE_URL } from "@/lib/site";

export default function StructuredData() {
  const baseUrl = SITE_URL;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Rohan Gore",
    url: baseUrl,
    jobTitle: "Technical Lead",
    worksFor: { "@type": "Organization", name: "Myntra" },
    homeLocation: { "@type": "Place", name: "Bangalore, India" },
    description:
      "Technical Lead at Myntra in Bangalore, building full-stack applications, AI tools, and developer experiences.",
    image: `${baseUrl}/og-image.jpg`,
    sameAs: [
      "https://github.com/rohangore1999",
      "https://www.linkedin.com/in/rohan-gore-355178179/",
    ],
    knowsAbout: [
      "Software Engineering",
      "Full Stack Development",
      "Web Development",
      "React",
      "Next.js",
      "Node.js",
      "Python",
      "AI/ML",
      "RAG Systems",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Rohan Gore",
    url: baseUrl,
    description:
      "Personal website and portfolio of Rohan Gore, Software Engineer.",
    author: {
      "@type": "Person",
      name: "Rohan Gore",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
