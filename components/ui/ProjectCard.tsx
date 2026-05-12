"use client";

import { Project } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ArrowRight } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { GitHubIcon } from "./Icons";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

export function ProjectCard({ project, featured }: ProjectCardProps) {
  const heroImage = project.images.sort((a, b) => a.order - b.order)[0]?.url || "/placeholder-project.jpg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface",
        "transition-all duration-300 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5",
        "before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:bg-accent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
        featured ? "md:flex-row md:min-h-[420px]" : "h-full"
      )}
    >
      {/* Image */}
      <div
        className={cn(
          "relative overflow-hidden shrink-0",
          featured ? "md:w-[45%] aspect-video md:aspect-auto" : "aspect-video"
        )}
      >
        <Image
          src={heroImage}
          alt={project.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-bg/20 to-transparent" />
        <div className="absolute top-4 left-4">
          <StatusBadge status={project.status} />
        </div>
      </div>

      {/* Content */}
      <div
        className={cn(
          "flex flex-1 flex-col p-6 md:p-8",
          featured ? "md:justify-center" : ""
        )}
      >
        {/* Stack chips */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 5).map((item) => (
            <span
              key={item.id}
              className="px-2 py-0.5 rounded-md bg-surface-2 border border-border text-[10px] font-mono text-muted uppercase tracking-wider"
            >
              {item.name}
            </span>
          ))}
          {project.stack.length > 5 && (
            <span className="text-[10px] font-mono text-dim self-center">
              +{project.stack.length - 5}
            </span>
          )}
        </div>

        <h3 className="mb-2 text-xl md:text-2xl font-syne font-bold text-text group-hover:text-accent transition-colors duration-200">
          {project.name}
        </h3>
        <p className="mb-6 text-sm text-muted font-lora leading-relaxed line-clamp-3">
          {project.tagline}
        </p>

        <div className="mt-auto flex items-center gap-4">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-2 text-sm font-syne font-bold uppercase tracking-[0.12em] text-text hover:text-accent transition-colors"
          >
            Case Study <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2 ml-auto">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-surface-2 border border-border text-muted hover:text-text hover:border-accent/40 transition-all"
                aria-label="View source on GitHub"
              >
                <GitHubIcon className="w-3.5 h-3.5" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-surface-2 border border-border text-muted hover:text-accent hover:border-accent/40 transition-all"
                aria-label="View live project"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
