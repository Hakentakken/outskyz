import { JourneyMark } from "@/components/ui/JourneyMark";

/** Only shown while a route is loading; there is no artificial loading delay. */
export default function Loading() {
  return (
    <div
      role="status"
      className="bg-void flex min-h-[75svh] flex-col items-center justify-center gap-8 px-6 pt-24 pb-16"
    >
      <JourneyMark />
      <p className="text-muted text-sm">Your next chapter is on its way.</p>
    </div>
  );
}
