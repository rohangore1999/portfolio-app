import Link from "next/link";

export const metadata = {
  title: "Page not found",
  description: "The page you're looking for doesn't exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-8">
      <div className="max-w-2xl text-center">
        <p className="text-xs uppercase tracking-widest text-white/40 mb-6">
          404
        </p>
        <h1 className="text-5xl md:text-8xl font-light text-white leading-tight mb-8">
          Page not found
        </h1>
        <p className="text-base md:text-lg text-white/60 mb-10">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-6">
          <Link
            href="/"
            className="text-sm uppercase tracking-widest text-white/70 hover:text-white transition-all duration-200 hover:scale-105"
          >
            ← Back to Home
          </Link>
          <Link
            href="/work"
            className="text-sm uppercase tracking-widest text-orange-500 hover:text-orange-400 transition-all duration-200 hover:scale-105"
          >
            See Work →
          </Link>
        </div>
      </div>
    </div>
  );
}
