"use client";

import { motion, type Variants } from "framer-motion";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

interface Skill {
  id: string;
  name: string;
  level: string;
  order: number;
}

interface Category {
  id: string;
  title: string;
  icon: string;
  description: string;
  skills: Skill[];
}

interface SkillsClientProps {
  categories: Category[];
}

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

type LucideIconKey = keyof typeof Icons;

export function SkillsClient({ categories }: SkillsClientProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {categories.map((category) => {
        const iconKey = category.icon as LucideIconKey;
        const IconComponent =
          iconKey in Icons
            ? (Icons[iconKey] as React.ComponentType<{ className?: string }>)
            : Icons.Code;

        return (
          <motion.div
            key={category.id}
            variants={item}
            className="group relative p-7 rounded-2xl bg-surface border border-border hover:border-accent/35 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 flex flex-col h-full overflow-hidden"
          >
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent/3 rounded-bl-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 group-hover:bg-accent/20 transition-all duration-300 shrink-0">
                <IconComponent className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-syne font-bold text-text leading-tight">
                {category.title}
              </h3>
            </div>

            <p className="text-muted text-sm font-lora mb-6 line-clamp-2 leading-relaxed">
              {category.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-auto">
              {category.skills.map((skill) => (
                <span
                  key={skill.id}
                  className={cn(
                    "px-3 py-1 rounded-full text-[11px] font-mono border transition-all duration-200",
                    skill.level === "EXPERT"
                      ? "bg-accent/10 border-accent/30 text-accent"
                      : skill.level === "PROFICIENT"
                        ? "bg-blue-500/5 border-blue-500/25 text-blue-400"
                        : "bg-surface-2 border-border text-dim hover:text-text hover:border-muted"
                  )}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
