"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { fadeUp, staggerContainer, fadeUpViewport } from "@/lib/animations";

interface Step {
  time: string;
  title: string;
  description: string;
}

interface Props {
  steps: Step[];
}

export function AdventureExperience({ steps }: Props) {
  return (
    <motion.div
      className="mt-12 space-y-6"
      variants={staggerContainer}
      {...fadeUpViewport}
    >
      {steps.map((step) => (
        <motion.div
          key={step.title}
          variants={fadeUp}
          className="flex gap-6"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-gold/30 bg-gold/10 text-gold">
            <Calendar className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-lg text-gold">{step.time}</span>
              <h3 className="font-display text-xl text-ivory">{step.title}</h3>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted">{step.description}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}