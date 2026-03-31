export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Rohan Gore",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://rohangore.com",
    jobTitle: "Software Engineer",
    description:
      "Software Engineer specializing in full-stack development, building scalable web applications with modern technologies.",
    image: `${process.env.NEXT_PUBLIC_SITE_URL || "https://rohangore.com"}/og-image.jpg`,
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
