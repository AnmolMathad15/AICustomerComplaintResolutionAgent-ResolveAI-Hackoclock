import { useEffect, useState } from "react";
import { Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlaCountdownProps {
  createdAt: string;
  slaHours: number;
  /** When true, the timer freezes at the resolved/closed state. */
  resolved?: boolean;
  className?: string;
}

function formatRemaining(ms: number): string {
  const abs = Math.abs(ms);
  const totalMinutes = Math.floor(abs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const h = hours % 24;
    return `${days}d ${h}h`;
  }
  if (hours >= 1) return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
  const seconds = Math.floor((abs % 60000) / 1000);
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

/**
 * Live SLA countdown badge. Updates every second.
 * Color states:
 *   resolved   → emerald (frozen)
 *   > 50% left → emerald
 *   25-50% left → amber
 *   0-25% left → orange
 *   breached    → red, shows time overdue
 */
export function SlaCountdown({
  createdAt,
  slaHours,
  resolved,
  className,
}: SlaCountdownProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (resolved) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [resolved]);

  const created = new Date(createdAt).getTime();
  const deadline = created + slaHours * 60 * 60 * 1000;
  const remaining = deadline - now;
  const totalMs = slaHours * 60 * 60 * 1000;
  const pctLeft = Math.max(0, Math.min(1, remaining / totalMs));

  if (resolved) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-medium",
          "border-emerald-500/40 text-emerald-300 bg-emerald-500/10",
          className,
        )}
        title={`Closed within SLA (${slaHours}h)`}
      >
        <CheckCircle2 className="w-3 h-3" />
        Within SLA
      </div>
    );
  }

  const breached = remaining <= 0;
  let cls = "border-emerald-500/40 text-emerald-300 bg-emerald-500/10";
  let Icon = Clock;
  let label = `${formatRemaining(remaining)} left`;

  if (breached) {
    cls = "border-red-500/50 text-red-300 bg-red-500/15 animate-pulse";
    Icon = AlertTriangle;
    label = `Breached by ${formatRemaining(remaining)}`;
  } else if (pctLeft <= 0.25) {
    cls = "border-orange-500/50 text-orange-300 bg-orange-500/15";
  } else if (pctLeft <= 0.5) {
    cls = "border-amber-500/40 text-amber-300 bg-amber-500/10";
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-medium tabular-nums",
        cls,
        className,
      )}
      title={`SLA: ${slaHours}h · Deadline ${new Date(deadline).toLocaleString()}`}
      data-testid="sla-countdown"
    >
      <Icon className="w-3 h-3" />
      {label}
    </div>
  );
}
