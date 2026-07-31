import ContactPageClient from "@/components/contact/ContactPageClient";
import JsonLd from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with Rohan Gore — software engineer. Reach out for collaborations, consulting, or just to say hi.",
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    url: "/contact",
    title: "Contact | Rohan Gore",
    description:
      "Get in touch with Rohan Gore for collaborations, consulting, or to say hi.",
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
    title: "Contact | Rohan Gore",
    description: "Get in touch with Rohan Gore.",
    images: ["/og-image.jpg"],
  },
};

export default function ContactPage() {
  const contactUrl = `${SITE_URL}/contact`;

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Rohan Gore",
    description:
      "Get in touch with Rohan Gore — software engineer. Reach out for collaborations, consulting, or just to say hi.",
    url: contactUrl,
    mainEntity: {
      "@type": "Person",
      name: "Rohan Gore",
      url: SITE_URL,
      email: "mailto:gorerohan15@gmail.com",
      sameAs: [
        "https://github.com/rohangore1999",
        "https://www.linkedin.com/in/rohan-gore-038766187/",
      ],
    },
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
        name: "Contact",
        item: contactUrl,
      },
    ],
  };

  return (
    <>
      <JsonLd data={contactPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <ContactPageClient />
    </>
  );
}
