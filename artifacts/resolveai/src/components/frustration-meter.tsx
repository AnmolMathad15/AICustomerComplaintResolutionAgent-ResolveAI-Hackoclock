import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";

interface FrustrationMeterProps {
  score: number;
  className?: string;
}

export function FrustrationMeter({ score, className }: FrustrationMeterProps) {
  const level =
    score >= 75 ? "Critical" : score >= 50 ? "High" : score >= 25 ? "Moderate" : "Low";

  const color =
    score >= 75
      ? "bg-red-500"
      : score >= 50
      ? "bg-orange-500"
      : score >= 25
      ? "bg-amber-500"
      : "bg-emerald-500";

  const textColor =
    score >= 75
      ? "text-red-600 dark:text-red-400"
      : score >= 50
      ? "text-orange-600 dark:text-orange-400"
      : score >= 25
      ? "text-amber-600 dark:text-amber-400"
      : "text-emerald-600 dark:text-emerald-400";

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <Flame className="w-3.5 h-3.5" />
          Frustration Meter
        </div>
        <div className="flex items-center gap-1.5">
          <span className={cn("text-sm font-bold tabular-nums", textColor)}>{score}/100</span>
          <span className={cn("text-xs font-semibold", textColor)}>{level}</span>
        </div>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden relative">
        <div
          className={cn("h-full rounded-full transition-all duration-700 ease-out", color)}
          style={{ width: `${score}%` }}
        />
        {score >= 75 && (
          <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
        )}
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground/60">
        <span>Calm</span>
        <span>Moderate</span>
        <span>High</span>
        <span>Critical</span>
      </div>
    </div>
  );
}
