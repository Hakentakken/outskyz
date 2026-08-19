import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <h1 className="font-display text-5xl text-gold sm:text-6xl">404</h1>
      <p className="max-w-md text-ivory/60">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-2 inline-block rounded-sm border border-gold/40 px-8 py-3 text-sm uppercase tracking-widest text-gold transition-colors hover:bg-gold/10"
      >
        Return Home
      </Link>
    </div>
  );
}