"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  title,
  subtitle,
  className,
  align = "left",
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={cn(
        "mb-14 flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <div className={cn("flex items-center gap-4", align === "center" && "justify-center")}>
        {align === "center" && (
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-accent/50" />
        )}
        <h2 className="text-3xl md:text-5xl font-syne font-bold tracking-tight text-text">
          {title}
        </h2>
        <div className="h-px flex-1 min-w-[1.5rem] bg-gradient-to-r from-accent/40 to-transparent" />
      </div>
      {subtitle && (
        <p
          className={cn(
            "text-base md:text-lg text-muted font-lora leading-relaxed",
            align === "center" ? "max-w-2xl" : "max-w-xl"
          )}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
