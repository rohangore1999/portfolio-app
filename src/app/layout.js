import { Manrope } from "next/font/google";
import "./globals.css";
import { TransitionProvider } from "@/context/TransitionContext";
import Clarity from "@/components/Clarity";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
});

export const metadata = {
  title: {
    default: "Rohan Gore - Software Engineer",
    template: "%s | Rohan Gore",
  },
  description: "Software Engineer specializing in full-stack development, building scalable web applications with modern technologies. Passionate about bodybuilding and photography.",
  keywords: ["Software Engineer", "Full Stack Developer", "Web Development", "React", "Next.js", "Photography", "Bodybuilding"],
  authors: [{ name: "Rohan Gore" }],
  creator: "Rohan Gore",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://rohangore.com'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Rohan Gore - Software Engineer",
    description: "Software Engineer specializing in full-stack development, building scalable web applications with modern technologies.",
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
    title: "Rohan Gore - Software Engineer",
    description: "Software Engineer specializing in full-stack development, building scalable web applications with modern technologies.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${manrope.variable} antialiased font-sans`}
        style={{ fontFamily: "var(--font-manrope)" }}
      >
        <Clarity />
        <TransitionProvider>{children}</TransitionProvider>
      </body>
    </html>
  );
}
