import { Terminal, Mail } from "lucide-react";
import Link from "next/link";
import { GitHubIcon, LinkedInIcon } from "../ui/Icons";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border py-14 md:py-20 mt-auto">
      <div className="container mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-white shadow-md shadow-accent/20">
                <Terminal className="w-5 h-5" />
              </div>
              <span className="text-xl font-syne font-bold tracking-tight text-text">
                JOHN EDEH
              </span>
            </div>
            <p className="text-muted font-lora text-sm max-w-sm mb-7 leading-relaxed">
              Full-Stack and DevOps Engineer based in Lagos, Nigeria.
              Building production-grade applications and the robust infrastructure they run on.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/netojaycee"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted hover:text-accent hover:border-accent transition-all"
                aria-label="GitHub"
              >
                <GitHubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/in/jc-edeh"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted hover:text-blue-400 hover:border-blue-400 transition-all"
                aria-label="LinkedIn"
              >
                <LinkedInIcon className="w-4 h-4" />
              </a>
              <a
                href="mailto:netojaycee@gmail.com"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted hover:text-accent hover:border-accent transition-all"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[10px] font-syne font-bold uppercase tracking-[0.2em] text-text mb-5">
              Navigation
            </h4>
            <ul className="flex flex-col gap-3">
              {["Home", "About", "Projects", "Skills", "Experience", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={`#${item.toLowerCase()}`}
                    className="text-sm text-muted hover:text-accent transition-colors font-lora"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Meta */}
          <div>
            <h4 className="text-[10px] font-syne font-bold uppercase tracking-[0.2em] text-text mb-5">
              Management
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/admin"
                  className="text-sm text-muted hover:text-accent transition-colors font-lora"
                >
                  Admin Panel
                </Link>
              </li>
            </ul>
            <div className="mt-8 pt-6 border-t border-border/40">
              <span className="text-[9px] font-mono text-dim uppercase tracking-widest block mb-1">
                Built with
              </span>
              <span className="text-[11px] font-mono text-muted leading-relaxed">
                Next.js 16 · Prisma 7<br />Tailwind v4 · Neon DB
              </span>
            </div>
          </div>
        </div>

        <div className="pt-7 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-dim font-lora">
          <p>© {currentYear} John Chinonso Edeh. All rights reserved.</p>
          <p>Designed &amp; Built by John Edeh</p>
        </div>
      </div>
    </footer>
  );
}
