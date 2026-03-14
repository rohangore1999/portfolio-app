import HomeClient from "./HomeClient";

export const metadata = {
  title: "Rohan Gore - Software Engineer",
  description: "Personal website of Rohan Gore, a software engineer specializing in full-stack development",
};

export default function HomePage() {
  return (
    <>
      <link
        rel="preload"
        href="/images/home/hero-section-web.jpg"
        as="image"
        fetchPriority="high"
      />
      <HomeClient />
    </>
  );
}
