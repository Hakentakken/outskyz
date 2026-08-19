"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <h1 className="font-display text-5xl text-gold sm:text-6xl">500</h1>
      <p className="max-w-md text-ivory/60">
        Something went wrong on our end. Please try again.
      </p>
      <button
        onClick={() => unstable_retry()}
        className="mt-2 rounded-sm border border-gold/40 px-8 py-3 text-sm uppercase tracking-widest text-gold transition-colors hover:bg-gold/10"
      >
        Try Again
      </button>
    </div>
  );
}