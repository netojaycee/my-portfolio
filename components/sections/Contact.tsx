"use client";

import { useState } from "react";
import { SectionHeader } from "../ui/SectionHeader";
import { Mail, Copy, Check, ExternalLink, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { GitHubIcon, LinkedInIcon } from "../ui/Icons";

const EMAIL = "netojaycee@gmail.com";
const GITHUB = "https://github.com/netojaycee";
const LINKEDIN = "https://linkedin.com/in/jc-edeh";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section id="contact" className="py-28 md:py-36 bg-bg relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-accent/4 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <SectionHeader
          title="Get In Touch."
          subtitle="Available for full-time roles and high-impact contract projects. Let's build something that matters."
          align="center"
        />

        <div className="max-w-3xl mx-auto space-y-5">
          {/* Email card — primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group p-7 rounded-2xl bg-surface border border-border hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0 group-hover:scale-110 group-hover:bg-accent/20 transition-all duration-300">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-syne font-bold text-text mb-0.5">Direct Email</h3>
                <p className="text-sm text-muted font-lora">Best for formal inquiries and collaboration requests.</p>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-2 border border-border w-full sm:w-auto sm:min-w-[280px]">
                <span className="font-mono text-sm text-text truncate flex-1">{EMAIL}</span>
                <button
                  onClick={copyToClipboard}
                  className="p-1.5 rounded-lg bg-surface border border-border text-muted hover:text-accent hover:border-accent/50 transition-all shrink-0"
                  aria-label="Copy email"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-green" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
            {copied && (
              <p className="text-xs font-mono text-green mt-3 text-center sm:text-right">
                ✓ Copied to clipboard
              </p>
            )}
          </motion.div>

          {/* Socials row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <motion.a
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="group flex items-center gap-4 p-6 rounded-2xl bg-surface border border-border hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-muted group-hover:text-accent group-hover:border-accent/40 group-hover:bg-accent/10 transition-all duration-300 shrink-0">
                <GitHubIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-syne font-bold text-text uppercase tracking-widest mb-0.5">
                  GitHub
                </div>
                <div className="text-xs text-muted font-mono truncate">github.com/netojaycee</div>
              </div>
              <ExternalLink className="w-4 h-4 text-dim group-hover:text-accent transition-colors" />
            </motion.a>

            <motion.a
              href={LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="group flex items-center gap-4 p-6 rounded-2xl bg-surface border border-border hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-muted group-hover:text-blue-400 group-hover:border-blue-400/40 group-hover:bg-blue-500/10 transition-all duration-300 shrink-0">
                <LinkedInIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-syne font-bold text-text uppercase tracking-widest mb-0.5">
                  LinkedIn
                </div>
                <div className="text-xs text-muted font-mono truncate">linkedin.com/in/jc-edeh</div>
              </div>
              <ExternalLink className="w-4 h-4 text-dim group-hover:text-blue-400 transition-colors" />
            </motion.a>
          </div>

          {/* Location footer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="flex items-center justify-center gap-2 pt-4 text-muted font-lora text-sm italic"
          >
            <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
            <span>Lagos, Nigeria — working with teams worldwide</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
