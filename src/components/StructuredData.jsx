export default function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rohangore.com";

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Rohan Gore",
    url: baseUrl,
    jobTitle: "Software Engineer",
    description:
      "Software Engineer specializing in full-stack development, building scalable web applications with modern technologies.",
    image: `${baseUrl}/og-image.jpg`,
    sameAs: [
      "https://github.com/rohangore1999",
      "https://www.linkedin.com/in/rohan-gore-038766187/",
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
