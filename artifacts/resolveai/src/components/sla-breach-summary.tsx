import { useEffect, useState, useMemo } from "react";
import {
  useListComplaints,
  getListComplaintsQueryKey,
} from "@workspace/api-client-react";

type Complaint = {
  status?: string;
  slaHours?: number;
  createdAt: string;
};
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Clock, AlertTriangle, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlaBreachSummaryProps {
  companyId?: string;
  className?: string;
}

type Bucket = "ok" | "approaching" | "breached";

function bucketFor(c: Complaint, now: number): Bucket | null {
  // Resolved tickets are excluded from "active" SLA tracking.
  if (c.status === "resolved") return null;
  const slaHours = c.slaHours ?? 24;
  const created = new Date(c.createdAt).getTime();
  const deadline = created + slaHours * 60 * 60 * 1000;
  const remaining = deadline - now;
  if (remaining <= 0) return "breached";
  const totalMs = slaHours * 60 * 60 * 1000;
  const pctLeft = remaining / totalMs;
  if (pctLeft <= 0.25) return "approaching";
  return "ok";
}

/**
 * Live SLA health overview. Polls the active complaint list and bucketizes
 * every open ticket into Within / Approaching (≤25% time left) / Breached.
 */
export function SlaBreachSummary({ companyId, className }: SlaBreachSummaryProps) {
  const params = companyId && companyId !== "all" ? { companyId } : undefined;
  const { data: complaints } = useListComplaints(params, {
    query: {
      refetchInterval: 5000,
      queryKey: getListComplaintsQueryKey(params),
    },
  });

  // Tick once a minute to refresh the buckets even between fetches.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const summary = useMemo(() => {
    const tally = { ok: 0, approaching: 0, breached: 0, active: 0 };
    if (!complaints) return tally;
    for (const c of complaints) {
      const b = bucketFor(c, now);
      if (!b) continue;
      tally.active += 1;
      tally[b] += 1;
    }
    return tally;
  }, [complaints, now]);

  const total = summary.active || 1; // avoid div/0
  const pct = (n: number) => Math.round((n / total) * 100);

  const items: Array<{
    key: Bucket;
    label: string;
    count: number;
    color: string;
    bar: string;
    Icon: typeof ShieldCheck;
  }> = [
    {
      key: "ok",
      label: "Within SLA",
      count: summary.ok,
      color: "text-emerald-400",
      bar: "bg-emerald-500/70",
      Icon: ShieldCheck,
    },
    {
      key: "approaching",
      label: "Approaching",
      count: summary.approaching,
      color: "text-amber-400",
      bar: "bg-amber-500/70",
      Icon: Clock,
    },
    {
      key: "breached",
      label: "Breached",
      count: summary.breached,
      color: "text-red-400",
      bar: "bg-red-500/70",
      Icon: AlertTriangle,
    },
  ];

  return (
    <Card
      className={cn("fade-in-up", className)}
      data-testid="sla-breach-summary"
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          SLA Health
        </CardTitle>
        <ShieldAlert
          className={cn(
            "h-4 w-4",
            summary.breached > 0
              ? "text-red-400"
              : summary.approaching > 0
                ? "text-amber-400"
                : "text-emerald-400",
          )}
        />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tabular-nums text-foreground">
            {summary.active}
          </span>
          <span className="text-xs text-muted-foreground">active tickets</span>
        </div>

        {/* Stacked bar */}
        <div className="flex h-2 w-full overflow-hidden rounded-full bg-white/5">
          {items.map((it) =>
            it.count > 0 ? (
              <div
                key={it.key}
                className={cn("h-full transition-all", it.bar)}
                style={{ width: `${pct(it.count)}%` }}
                title={`${it.label}: ${it.count}`}
              />
            ) : null,
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          {items.map((it) => {
            const Icon = it.Icon;
            return (
              <div
                key={it.key}
                className="rounded-lg border border-white/5 bg-white/[0.02] px-2 py-1.5"
                data-testid={`sla-bucket-${it.key}`}
              >
                <div className="flex items-center gap-1.5">
                  <Icon className={cn("h-3 w-3", it.color)} />
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {it.label}
                  </span>
                </div>
                <div className={cn("mt-1 text-lg font-semibold tabular-nums", it.color)}>
                  {it.count}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
