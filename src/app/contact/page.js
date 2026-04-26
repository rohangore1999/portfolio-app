import ContactPageClient from "@/components/contact/ContactPageClient";

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
  return <ContactPageClient />;
}
