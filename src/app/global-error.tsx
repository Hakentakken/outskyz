"use client";

import { fontDisplay, fontBody } from "@/config/fonts";

export default function GlobalError({
  unstable_retry,
}: {
  unstable_retry: () => void;
}) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontBody.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
          <h1 className="font-display text-5xl text-gold sm:text-6xl">500</h1>
          <p className="max-w-md text-ivory/60">
            A critical error occurred. Please refresh or try again later.
          </p>
          <button
            onClick={() => unstable_retry()}
            className="mt-2 rounded-sm border border-gold/40 px-8 py-3 text-sm uppercase tracking-widest text-gold transition-colors hover:bg-gold/10"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}