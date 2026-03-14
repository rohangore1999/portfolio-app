import { Manrope } from "next/font/google";
import "./globals.css";
import { TransitionProvider } from "@/context/TransitionContext";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
});

export const metadata = {
  title: "Rohan Gore",
  description: "Personal website of Rohan Gore",
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
        <TransitionProvider>{children}</TransitionProvider>
      </body>
    </html>
  );
}
