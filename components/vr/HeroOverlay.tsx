import { ArrowUpRight, Download, Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/Icons";
import { CONTACT, HERO } from "./content";
import { TrackedLink } from "./TrackedLink";

// Server component: real, crawlable text that is visible the instant the page
// loads — before (and regardless of whether) the 3D scene boots.
export function HeroOverlay() {
  return (
    <>
    <section
      aria-label="About John Edeh"
      className="pointer-events-auto rounded-2xl border border-border bg-surface/85 p-3 backdrop-blur-xl sm:p-5 [@media(max-height:520px)]:hidden"
    >
      <div className="flex flex-col gap-2 sm:gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div className="min-w-0 lg:max-w-3xl lg:flex-1">
          <TrackedLink
            event="cta_click"
            cta="punch_badge"
            href={CONTACT.punch}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-1.5 inline-flex max-w-full items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.06em] text-accent transition-colors hover:bg-accent/15 sm:mb-2 sm:px-3 sm:text-[11px] sm:tracking-[0.1em]"
          >
            <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-accent" />
            <span className="truncate">{HERO.badge}</span>
            <ArrowUpRight className="h-3 w-3 shrink-0" />
          </TrackedLink>
          <h1 className="font-syne text-xl font-extrabold leading-none tracking-tight text-text sm:text-3xl">
            {HERO.name}
            <span className="ml-3 hidden align-middle font-mono text-[11px] font-medium tracking-normal text-muted sm:inline sm:text-xs">
              {HERO.role}
            </span>
          </h1>
          <p className="mt-2 hidden text-sm leading-relaxed text-dim sm:block">{HERO.pitch}</p>
        </div>

        <dl className="hidden shrink-0 grid-cols-3 gap-5 min-[1360px]:grid">
          {HERO.stats.map((s) => (
            <div key={s.label}>
              <dt className="font-syne text-2xl font-bold tracking-tight text-text">{s.value}</dt>
              <dd className="mt-0.5 max-w-[7.5rem] font-mono text-[10px] uppercase leading-tight tracking-wider text-muted">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex shrink-0 flex-wrap gap-2">
          <TrackedLink
            event="cta_click"
            cta="hire_me"
            href={`mailto:${CONTACT.email}`}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-accent-hover"
          >
            <Mail className="h-4 w-4" />
            Hire me
          </TrackedLink>
          <TrackedLink
            event="cta_click"
            cta="cv"
            href={CONTACT.cv}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-text transition-colors hover:border-accent hover:text-accent"
          >
            <Download className="h-4 w-4" />
            CV
          </TrackedLink>
          <TrackedLink
            event="cta_click"
            cta="linkedin"
            href={CONTACT.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="inline-flex items-center rounded-lg border border-border px-3 py-2.5 text-text transition-colors hover:border-accent hover:text-accent"
          >
            <LinkedInIcon className="h-4 w-4" />
          </TrackedLink>
          <TrackedLink
            event="cta_click"
            cta="github"
            href={CONTACT.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="inline-flex items-center rounded-lg border border-border px-3 py-2.5 text-text transition-colors hover:border-accent hover:text-accent"
          >
            <GitHubIcon className="h-4 w-4" />
          </TrackedLink>
        </div>
      </div>
    </section>
    {/* Short viewports (landscape phones): slim bar so the scene stays visible. */}
    <section
      aria-label="Contact John Edeh"
      className="pointer-events-auto hidden items-center justify-between gap-3 rounded-xl border border-border bg-surface/85 px-3 py-2 backdrop-blur-xl [@media(max-height:520px)]:flex"
    >
      <span className="font-syne text-base font-extrabold text-text">{HERO.name}</span>
      <span className="truncate font-mono text-[10px] uppercase tracking-wider text-accent">{HERO.badge}</span>
      <TrackedLink
        event="cta_click"
        cta="hire_me_slim"
        href={`mailto:${CONTACT.email}`}
        className="shrink-0 rounded-lg bg-accent px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-black"
      >
        Hire me
      </TrackedLink>
    </section>
    </>
  );
}
