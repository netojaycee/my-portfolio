"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Download, ChevronDown, Terminal as TerminalIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const roles = [
  "Full-Stack Engineer",
  "DevOps Engineer",
  "SaaS Builder",
  "Infrastructure Engineer",
];

interface TerminalLine {
  type: "prompt" | "output" | "success" | "info" | "blank";
  prefix?: string;
  dir?: string;
  text: string;
}

const terminalLines: TerminalLine[] = [
  { type: "prompt", dir: "~/john-portfolio", text: "git checkout main" },
  { type: "output", text: "Switched to branch 'main' — up to date." },
  { type: "blank", text: "" },
  { type: "prompt", dir: "~/john-portfolio", text: "pnpm build && pnpm deploy" },
  { type: "info", text: "Building production bundle..." },
  { type: "success", text: "✓  Next.js 16 optimised (0 warnings)" },
  { type: "success", text: "✓  Prisma schema pushed to Neon DB" },
  { type: "success", text: "✓  Docker images pushed to registry" },
  { type: "success", text: "✓  Terraform infra verified — no drift" },
  { type: "success", text: "✓  Deployed to production  🚀" },
];

export function Hero() {
  const [displayedRole, setDisplayedRole] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);

  // Typewriter effect
  useEffect(() => {
    if (isPaused) return;
    const current = roles[roleIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (charIndex < current.length) {
            setDisplayedRole(current.slice(0, charIndex + 1));
            setCharIndex((c) => c + 1);
          } else {
            setIsPaused(true);
            setTimeout(() => {
              setIsPaused(false);
              setIsDeleting(true);
            }, 2200);
          }
        } else {
          if (charIndex > 0) {
            setDisplayedRole(current.slice(0, charIndex - 1));
            setCharIndex((c) => c - 1);
          } else {
            setIsDeleting(false);
            setRoleIndex((i) => (i + 1) % roles.length);
          }
        }
      },
      isDeleting ? 45 : 95
    );

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, roleIndex, isPaused]);

  // Terminal line-by-line reveal with looping
  useEffect(() => {
    if (visibleLines < terminalLines.length) {
      const delay =
        terminalLines[visibleLines].type === "blank" ? 150
        : terminalLines[visibleLines].type === "prompt" ? 500
        : 350;
      const t = setTimeout(() => setVisibleLines((v) => v + 1), delay);
      return () => clearTimeout(t);
    }
    const reset = setTimeout(() => setVisibleLines(0), 3500);
    return () => clearTimeout(reset);
  }, [visibleLines]);

  const lineColor = (type: TerminalLine["type"]) => {
    if (type === "prompt") return "";
    if (type === "success") return "text-green-400";
    if (type === "info") return "text-yellow-400";
    if (type === "output") return "text-white/50";
    return "text-white/30";
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden dot-grid"
    >
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg/30 via-bg/60 to-bg pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-8 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 xl:gap-20">
          {/* Left — Content */}
          <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Badge */}
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-[11px] font-mono font-bold uppercase tracking-[0.2em] mb-8"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Available for Work — Lagos, Nigeria
              </motion.span>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-syne font-extrabold tracking-tighter text-text mb-4 leading-[1.05]"
              >
                Hi, I&apos;m{" "}
                <span className="gradient-text">John Edeh</span>.
              </motion.h1>

              {/* Typewriter role */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="h-12 md:h-14 flex items-center justify-center lg:justify-start mb-6"
              >
                <span className="text-2xl md:text-3xl font-syne font-semibold text-muted">
                  I build as a{" "}
                  <span className="text-text">
                    {displayedRole}
                    <span className="cursor-blink text-accent ml-0.5">|</span>
                  </span>
                </span>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="text-base md:text-lg text-muted font-lora max-w-xl mb-10 leading-relaxed mx-auto lg:mx-0"
              >
                I architect production-grade web platforms and the automated cloud
                infrastructure they run on — from Next.js frontends to Terraform
                pipelines and Nginx reverse-proxies.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <Link
                  href="#projects"
                  className="w-full sm:w-auto h-13 px-8 py-3.5 bg-accent text-white font-syne font-bold text-sm uppercase tracking-[0.15em] flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-accent/25 hover:bg-accent-hover hover:shadow-accent/40 hover:shadow-xl transition-all duration-200 group"
                >
                  View My Work
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="/john-edeh-cv.pdf"
                  download
                  className="w-full sm:w-auto h-13 px-8 py-3.5 bg-surface border border-border text-text font-syne font-bold text-sm uppercase tracking-[0.15em] flex items-center justify-center gap-2 rounded-xl hover:bg-surface-2 hover:border-accent/40 transition-all duration-200"
                >
                  Download CV
                  <Download className="w-4 h-4" />
                </a>
              </motion.div>

              {/* Quick stats row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75, duration: 0.5 }}
                className="mt-12 flex items-center justify-center lg:justify-start gap-8 border-t border-border/50 pt-8"
              >
                {[
                  { val: "5+", label: "Years" },
                  { val: "6+", label: "Projects" },
                  { val: "99.9%", label: "Uptime" },
                ].map((s) => (
                  <div key={s.label} className="text-center lg:text-left">
                    <div className="text-2xl font-syne font-bold text-text">{s.val}</div>
                    <div className="text-[10px] font-mono text-muted uppercase tracking-widest mt-0.5">
                      {s.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Right — Animated Terminal */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex-1 w-full max-w-lg lg:max-w-xl"
          >
            <div className="relative group">
              {/* Glow */}
              <div className="absolute -inset-px bg-gradient-to-r from-accent/30 via-orange-400/20 to-accent/30 rounded-2xl blur-md opacity-60 group-hover:opacity-90 transition duration-700" />

              <div className="relative bg-[#0c0c12] rounded-2xl border border-white/10 shadow-2xl overflow-hidden font-mono text-sm">
                {/* Window chrome */}
                <div className="bg-white/[0.04] border-b border-white/[0.07] px-5 py-3.5 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="flex items-center gap-2 text-white/30 text-xs">
                    <TerminalIcon className="w-3 h-3" />
                    <span>bash — john@edeh-prod:~</span>
                  </div>
                  <div className="w-14" />
                </div>

                {/* Terminal body */}
                <div className="p-5 space-y-1.5 min-h-[280px]">
                  <AnimatePresence>
                    {terminalLines.slice(0, visibleLines).map((line, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className="leading-relaxed"
                      >
                        {line.type === "prompt" ? (
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-green-400 shrink-0">❯</span>
                            <span className="text-blue-400 shrink-0">{line.dir}</span>
                            <span className="text-white/90">{line.text}</span>
                          </div>
                        ) : line.type === "blank" ? (
                          <div className="h-2" />
                        ) : (
                          <div className={`pl-5 ${lineColor(line.type)}`}>
                            {line.text}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Active cursor at bottom */}
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-green-400">❯</span>
                    <span className="text-blue-400">~/john-portfolio</span>
                    <span className="w-2 h-4 bg-accent cursor-blink inline-block ml-1 rounded-sm" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted"
      >
        <span className="text-[10px] font-mono uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-accent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
