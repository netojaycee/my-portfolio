"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ExperienceBullet {
  id: string;
  text: string;
  order: number;
}

interface ExperienceTag {
  id: string;
  name: string;
}

interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  current: boolean;
  bullets: ExperienceBullet[];
  tags: ExperienceTag[];
}

interface ExperienceClientProps {
  experiences: ExperienceEntry[];
}

export function ExperienceClient({ experiences }: ExperienceClientProps) {
  return (
    <div className="relative max-w-3xl">
      {/* Vertical timeline line */}
      <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-accent/50 via-border to-transparent" />

      <div className="space-y-14">
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, duration: 0.55, ease: "easeOut" }}
            className="relative pl-10"
          >
            {/* Timeline dot */}
            <div
              className={cn(
                "absolute left-0 top-1 w-[23px] h-[23px] rounded-full border-[3px] border-bg transition-all",
                exp.current
                  ? "bg-green shadow-[0_0_12px_rgba(52,211,153,0.6)] animate-pulse"
                  : "bg-border"
              )}
            />

            {/* Content card */}
            <div className="p-6 rounded-2xl bg-surface border border-border hover:border-accent/30 hover:shadow-md hover:shadow-accent/5 transition-all duration-300 group">
              {/* Period badge */}
              <span className="inline-block text-[10px] font-mono text-accent font-bold uppercase tracking-[0.2em] mb-3 bg-accent/10 px-2.5 py-1 rounded-md">
                {exp.period}
              </span>

              <h3 className="text-xl md:text-2xl font-syne font-bold text-text mb-1 group-hover:text-accent transition-colors duration-200">
                {exp.role}
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-muted font-lora mb-4">
                <span className="text-text font-semibold text-sm">{exp.company}</span>
                <span className="text-muted/40">·</span>
                <span className="text-sm">{exp.location}</span>
              </div>

              {/* Tags */}
              {exp.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-2 py-0.5 rounded bg-surface-2 border border-border text-[10px] font-mono text-dim uppercase tracking-wider"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Bullets */}
              <ul className="space-y-3">
                {exp.bullets.map((bullet) => (
                  <li key={bullet.id} className="flex gap-3 text-muted font-lora text-sm leading-relaxed">
                    <span className="text-accent mt-1.5 shrink-0 text-xs">▸</span>
                    <span>{bullet.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
