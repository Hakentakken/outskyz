export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="h-8 w-8 animate-pulse rounded-full border border-gold/40" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}