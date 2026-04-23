import { AlertTriangle, User, Clock, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface EscalationDetail {
  assignedAgent: string;
  reasons: string[];
  summary: string;
}

interface EscalationCardProps {
  ticketId: string;
  escalation: EscalationDetail;
  slaHours: number;
  className?: string;
}

export function EscalationCard({ ticketId, escalation, slaHours, className }: EscalationCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border-2 border-destructive/60 bg-destructive/5 p-4 space-y-4 shadow-sm shadow-destructive/10",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-destructive">
          <AlertTriangle className="w-4 h-4 animate-pulse" />
          Escalation Required
        </div>
        <span className="font-mono text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">
          {ticketId}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-start gap-2">
          <User className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Assigned Agent</p>
            <p className="text-sm font-semibold mt-0.5">{escalation.assignedAgent}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Clock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Response SLA</p>
            <p className="text-sm font-semibold mt-0.5">{slaHours}h</p>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Escalation Reasons</p>
        <ul className="space-y-1">
          {escalation.reasons.map((reason, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-destructive/90">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
              {reason}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
          <FileText className="w-3 h-3" />
          Summary
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed bg-background/60 rounded p-2.5 border border-destructive/20">
          {escalation.summary}
        </p>
      </div>
    </div>
  );
}
