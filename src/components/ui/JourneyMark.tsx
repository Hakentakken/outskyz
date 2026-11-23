import { Plane } from "lucide-react";

export function JourneyMark() {
  return (
    <div className="journey-mark text-center">
      <p className="font-display text-ivory text-4xl tracking-tight">
        Outskyz<span className="text-gold">.</span>
      </p>
      <div className="journey-flight mx-auto my-7" aria-hidden="true">
        <span className="journey-flight-origin" />
        <span className="journey-flight-path" />
        <Plane className="journey-flight-plane h-5 w-5" />
        <span className="journey-flight-destination" />
      </div>
      <p className="text-gold text-[0.6rem] tracking-[0.3em] uppercase">
        One ultimate take-off
      </p>
    </div>
  );
}
