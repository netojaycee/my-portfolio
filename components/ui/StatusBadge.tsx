import { ProjectStatus } from "@/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles = {
    LIVE: "bg-green/10 text-green border-green/20",
    IN_DEVELOPMENT: "bg-blue/10 text-blue border-blue/20",
    PRIVATE: "bg-muted/10 text-muted border-muted/20",
  };

  const labels = {
    LIVE: "Live",
    IN_DEVELOPMENT: "In Development",
    PRIVATE: "Private",
  };

  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-full text-xs font-mono font-medium border uppercase tracking-wider",
        styles[status],
        className
      )}
    >
      <span className="flex items-center gap-1.5">
        <span className={cn("w-1.5 h-1.5 rounded-full", status === "LIVE" ? "animate-pulse bg-green" : "bg-current")} />
        {labels[status]}
      </span>
    </span>
  );
}
