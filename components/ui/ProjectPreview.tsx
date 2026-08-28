import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectStatus } from "@/types";

interface ProjectPreviewProps {
  slug: string;
  category: string;
  status: ProjectStatus;
  className?: string;
}

const STATUS_LINE: Record<ProjectStatus, string> = {
  LIVE: "HTTP/2 200 OK",
  IN_DEVELOPMENT: "BUILD IN PROGRESS",
  PRIVATE: "ACCESS RESTRICTED",
};

const STATUS_COLOR: Record<ProjectStatus, string> = {
  LIVE: "text-green",
  IN_DEVELOPMENT: "text-blue",
  PRIVATE: "text-muted",
};

// A deliberate stand-in for a real screenshot, not an apology for a missing
// one — reuses the site's own terminal/dot-grid identity (see Navbar logo,
// Hero background) so a project without curated images still looks intentional.
export function ProjectPreview({ slug, category, status, className }: ProjectPreviewProps) {
  return (
    <div className={cn("relative w-full h-full dot-grid bg-surface-2 flex flex-col overflow-hidden", className)}>
      {/* Chrome bar */}
      <div className="flex items-center gap-2 px-4 h-9 border-b border-border bg-surface/70 backdrop-blur-sm shrink-0">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-gold/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-green/60" />
        <span className="ml-3 text-[10px] font-mono text-dim truncate">~/{slug}</span>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
        <div className="w-14 h-14 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
          <Terminal className="w-7 h-7" />
        </div>
        <div className="text-center space-y-1">
          <p className="font-mono text-xs text-dim">$ deploy --project {slug}</p>
          <p className={cn("font-mono text-xs font-bold uppercase tracking-widest", STATUS_COLOR[status])}>
            {STATUS_LINE[status]}
          </p>
        </div>
        <span className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] border border-border rounded-full px-3 py-1">
          {category}
        </span>
      </div>
    </div>
  );
}
