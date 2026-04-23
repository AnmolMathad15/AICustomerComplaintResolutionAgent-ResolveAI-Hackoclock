import { cn } from "@/lib/utils";

interface ConfidenceBarProps {
  percentage: number;
  level: "HIGH" | "MEDIUM" | "LOW";
  showLabel?: boolean;
  className?: string;
}

export function ConfidenceBar({ percentage, level, showLabel = true, className }: ConfidenceBarProps) {
  const color =
    level === "HIGH"
      ? "bg-emerald-500"
      : level === "MEDIUM"
      ? "bg-amber-500"
      : "bg-destructive";

  const textColor =
    level === "HIGH"
      ? "text-emerald-600 dark:text-emerald-400"
      : level === "MEDIUM"
      ? "text-amber-600 dark:text-amber-400"
      : "text-destructive";

  return (
    <div className={cn("space-y-1", className)}>
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground font-medium">AI Confidence</span>
          <div className="flex items-center gap-1.5">
            <span className={cn("text-sm font-bold tabular-nums", textColor)}>{percentage}%</span>
            <span className={cn("text-xs font-semibold px-1.5 py-0.5 rounded", textColor,
              level === "HIGH" ? "bg-emerald-500/10" : level === "MEDIUM" ? "bg-amber-500/10" : "bg-destructive/10"
            )}>
              {level}
            </span>
          </div>
        </div>
      )}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700 ease-out", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
