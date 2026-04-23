import { Layout } from "@/components/layout";
import {
  useListComplaints,
  useUpdateComplaint,
  useListCompanyAgents,
  getListComplaintsQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getSeverityColor, getSentimentColor, formatDate } from "@/lib/format";
import {
  MessageSquareWarning,
  Search,
  Download,
  UserCog,
  Edit3,
  Check,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useT } from "@/components/language-provider";
import { useCompany } from "@/lib/company-context";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { SlaCountdown } from "@/components/sla-countdown";

type FilterKey = "all" | "resolved" | "escalated" | "pending" | "in_progress";
type SortKey = "recent" | "priority";

// Status display label (admin-side rename: "resolved" → "AI Resolved")
function statusLabel(status: string): string {
  if (status === "resolved") return "AI Resolved";
  if (status === "in_progress") return "In Progress";
  if (status === "escalated") return "Escalated";
  if (status === "pending") return "Pending";
  return status;
}

function statusBadgeClass(status: string): string {
  switch (status) {
    case "escalated":
      return "border-red-500/40 text-red-300 bg-red-500/10 glow-red";
    case "pending":
      return "border-amber-500/40 text-amber-300 bg-amber-500/10 glow-amber";
    case "in_progress":
      return "border-sky-500/40 text-sky-300 bg-sky-500/10";
    default:
      return "border-emerald-500/40 text-emerald-300 bg-emerald-500/10 glow-emerald-soft";
  }
}

function priorityFromSentiment(sentiment: string): {
  label: string;
  cls: string;
  dot: string;
} {
  if (sentiment === "negative")
    return { label: "High Priority", cls: "text-red-300", dot: "🔴" };
  if (sentiment === "positive")
    return { label: "Low Priority", cls: "text-emerald-300", dot: "🟢" };
  return { label: "Medium", cls: "text-amber-300", dot: "🟡" };
}

function authenticityBadge(value?: string): {
  label: string;
  cls: string;
} | null {
  if (!value || value === "genuine") return null;
  if (value === "likely_fake")
    return {
      label: "Likely Fake",
      cls: "border-fuchsia-500/40 text-fuchsia-300 bg-fuchsia-500/10",
    };
  return {
    label: "Suspicious",
    cls: "border-yellow-500/40 text-yellow-300 bg-yellow-500/10",
  };
}

function ComplaintRow({
  complaint,
  index,
}: {
  complaint: any;
  index: number;
}) {
  const t = useT();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { mutate: update, isPending } = useUpdateComplaint();
  const { data: agents = [] } = useListCompanyAgents(complaint.companyId ?? "amazon");
  const [editingResolution, setEditingResolution] = useState(false);
  const [draftRes, setDraftRes] = useState<string>(complaint.resolution ?? "");

  const status: string =
    complaint.status ?? (complaint.shouldEscalate ? "escalated" : "resolved");
  const priority = priorityFromSentiment(complaint.sentiment);
  const authBadge = authenticityBadge(complaint.authenticity);

  const onStatusChange = (next: string) => {
    update(
      { ticketId: complaint.ticketId, data: { status: next as any } },
      {
        onSuccess: () => {
          toast({ title: "Status updated", description: `${complaint.ticketId} → ${statusLabel(next)}` });
          refresh();
        },
      },
    );
  };

  const severityBorder = (s: string) => {
    switch (s.toUpperCase()) {
      case "HIGH":
        return "border-l-red-500";
      case "MEDIUM":
        return "border-l-orange-500";
      case "LOW":
        return "border-l-emerald-500";
      default:
        return "border-l-white/10";
    }
  };

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: getListComplaintsQueryKey() });
  };

  const onAssign = (agentId: string) => {
    update(
      { ticketId: complaint.ticketId, data: { assignedAgentId: agentId, status: "escalated" } },
      {
        onSuccess: () => {
          toast({ title: "Agent assigned", description: `Ticket ${complaint.ticketId} routed.` });
          refresh();
        },
      }
    );
  };

  const onSaveOverride = () => {
    update(
      {
        ticketId: complaint.ticketId,
        data: { resolutionOverride: draftRes, status: "resolved" },
      },
      {
        onSuccess: () => {
          toast({ title: "Resolution overridden", description: "AI decision updated." });
          setEditingResolution(false);
          refresh();
        },
      }
    );
  };

  return (
    <Card
      className={cn("overflow-hidden border-l-4 fade-in-up", severityBorder(complaint.severity))}
      style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
    >
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 items-stretch">
          <div className="p-5 md:col-span-3 border-r border-white/5 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-mono text-[10px] font-semibold text-muted-foreground">
                {complaint.ticketId}
              </span>
              <Badge className={getSeverityColor(complaint.severity)} variant="outline">
                {complaint.severity}
              </Badge>
            </div>
            <Link
              href={`/customers/${complaint.customerId}`}
              className="font-medium hover:text-orange-400 transition-colors text-foreground"
            >
              {complaint.customerName}
            </Link>
            <p className="text-xs text-muted-foreground mt-0.5">{formatDate(complaint.createdAt)}</p>
            <div className="mt-2">
              <SlaCountdown
                createdAt={complaint.createdAt}
                slaHours={complaint.slaHours ?? 24}
                resolved={status === "resolved"}
              />
            </div>
            {complaint.companyName && (
              <p className="text-[10px] text-cyan-300/80 mt-1.5 inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                {complaint.companyName}
              </p>
            )}
          </div>

          <div className="p-5 md:col-span-6 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <Badge
                variant="secondary"
                className="capitalize text-xs bg-orange-500/10 text-orange-300 border-orange-500/20"
              >
                {complaint.complaintType.replace("_", " ")}
              </Badge>
              <span
                className={`text-xs font-medium capitalize ${getSentimentColor(complaint.sentiment)}`}
              >
                {complaint.sentiment} {t("complaints.sentimentSuffix")}
              </span>
              {complaint.resolutionOverride && (
                <Badge
                  variant="outline"
                  className="text-[10px] border-purple-500/40 text-purple-300 bg-purple-500/10"
                >
                  Human override
                </Badge>
              )}
            </div>
            <p className="text-sm line-clamp-2 text-muted-foreground mb-3">{complaint.complaint}</p>

            {editingResolution ? (
              <div className="flex items-center gap-2">
                <Input
                  value={draftRes}
                  onChange={(e) => setDraftRes(e.target.value)}
                  className="h-8 text-xs glass border-white/10"
                  placeholder="Override resolution…"
                />
                <button
                  onClick={onSaveOverride}
                  disabled={isPending}
                  className="h-8 px-2 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setEditingResolution(false);
                    setDraftRes(complaint.resolution ?? "");
                  }}
                  className="h-8 px-2 rounded-md glass border border-white/10 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-auto">
                <span className="text-xs text-muted-foreground">{t("complaints.aiConfidence")}</span>
                <div className="flex items-center gap-2 flex-1 max-w-[180px]">
                  <div className="h-1.5 flex-1 bg-white/8 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-orange-400 fill-bar"
                      style={{ width: `${complaint.confidenceScore * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium tabular-nums">
                    {(complaint.confidenceScore * 100).toFixed(0)}%
                  </span>
                </div>
                <button
                  onClick={() => setEditingResolution(true)}
                  className="ml-2 h-7 px-2 rounded-md glass border border-white/10 text-[10px] text-muted-foreground hover:text-orange-300 hover:border-orange-500/30 transition-all inline-flex items-center gap-1"
                  title="Override AI resolution"
                  data-testid={`override-${complaint.ticketId}`}
                >
                  <Edit3 className="w-3 h-3" />
                  Override
                </button>
              </div>
            )}
          </div>

          <div className="p-5 md:col-span-3 border-l border-white/5 flex flex-col items-start justify-center gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn("text-[11px] font-medium", priority.cls)}>
                {priority.dot} {priority.label}
              </span>
              {authBadge && (
                <Badge
                  variant="outline"
                  className={cn("text-[10px]", authBadge.cls)}
                  title={(complaint.authenticityReasons ?? []).join(" • ")}
                  data-testid={`authenticity-${complaint.ticketId}`}
                >
                  {authBadge.label}
                </Badge>
              )}
            </div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              {t("complaints.status")}
            </p>
            <Badge variant="outline" className={statusBadgeClass(status)}>
              {statusLabel(status)}
            </Badge>
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              disabled={isPending}
              className="w-full h-7 text-[11px] rounded-md bg-white/[0.04] border border-white/10 px-2 focus:outline-none focus:border-orange-500/40"
              data-testid={`status-${complaint.ticketId}`}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">AI Resolved</option>
              <option value="escalated">Escalated</option>
            </select>

            {complaint.assignedAgent && (
              <div className="text-[11px] text-foreground/80">
                <span className="text-muted-foreground">Agent:</span>{" "}
                <span className="font-medium">{complaint.assignedAgent}</span>
                {complaint.agentSpecialty && (
                  <div className="text-[10px] text-muted-foreground">
                    {complaint.agentSpecialty}
                  </div>
                )}
              </div>
            )}

            <div className="mt-1 w-full">
              <label className="text-[10px] text-muted-foreground inline-flex items-center gap-1 mb-1">
                <UserCog className="w-3 h-3" />
                Assign agent
              </label>
              <select
                value={complaint.assignedAgentId ?? ""}
                onChange={(e) => onAssign(e.target.value)}
                disabled={isPending}
                className="w-full h-7 text-[11px] rounded-md bg-white/[0.04] border border-white/10 px-2 focus:outline-none focus:border-orange-500/40"
                data-testid={`assign-${complaint.ticketId}`}
              >
                <option value="">— select —</option>
                {agents.map((a: any) => (
                  <option key={a.id} value={a.id}>
                    {a.name} · {a.specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Complaints() {
  const { selectedCompanyId, selectedCompany } = useCompany();
  const params = selectedCompanyId !== "all" ? { companyId: selectedCompanyId } : undefined;
  const { data: complaints, isLoading, isError } = useListComplaints(params, {
    query: { refetchInterval: 3000, queryKey: getListComplaintsQueryKey(params) },
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sort, setSort] = useState<SortKey>("recent");
  const t = useT();

  const filteredComplaints = useMemo(() => {
    if (!complaints) return [];
    const filtered = complaints
      .filter(
        (c: any) =>
          c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.complaintType.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((c: any) => {
        const status = c.status ?? (c.shouldEscalate ? "escalated" : "resolved");
        if (filter === "all") return true;
        return status === filter;
      });

    if (sort === "priority") {
      // Lower priorityRank = higher priority (negative + HIGH first).
      // Tier breaks ties by recency.
      return [...filtered].sort((a: any, b: any) => {
        const ra = a.priorityRank ?? 999;
        const rb = b.priorityRank ?? 999;
        if (ra !== rb) return ra - rb;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }
    return filtered;
  }, [complaints, searchTerm, filter, sort]);

  const exportCsv = () => {
    if (!filteredComplaints.length) return;
    const header = [
      "Ticket",
      "Customer",
      "Company",
      "Type",
      "Severity",
      "Sentiment",
      "Confidence",
      "Status",
      "Agent",
      "Created",
    ];
    const rows = filteredComplaints.map((c: any) => [
      c.ticketId,
      c.customerName,
      c.companyName ?? "",
      c.complaintType,
      c.severity,
      c.sentiment,
      `${(c.confidenceScore * 100).toFixed(0)}%`,
      c.status ?? (c.shouldEscalate ? "escalated" : "resolved"),
      c.assignedAgent ?? "",
      c.createdAt,
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resolveai-complaints.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Layout pageTitle="Complaints">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-full max-w-md" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || !complaints) {
    return (
      <Layout pageTitle="Complaints">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <MessageSquareWarning className="w-12 h-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Failed to load complaints</h2>
          <p className="text-muted-foreground">Please check your connection and try again.</p>
        </div>
      </Layout>
    );
  }

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: t("complaints.filterAll") },
    { key: "resolved", label: t("complaints.filterAiResolved") },
    { key: "in_progress", label: "In Progress" },
    { key: "escalated", label: t("complaints.filterEscalated") },
    { key: "pending", label: t("complaints.filterPending") },
  ];

  return (
    <Layout pageTitle="Complaints">
      <div className="space-y-6">
        <div className="fade-in-up">
          <h1 className="text-3xl font-bold tracking-tight text-glow-orange">
            {t("complaints.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("complaints.subtitle")}
            {selectedCompany && (
              <span className="ml-2">
                · <span className="text-orange-300">{selectedCompany.name}</span>
              </span>
            )}
            <span className="ml-2 inline-flex items-center gap-1.5 text-[10px] text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ping-dot" />
              LIVE
            </span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between fade-in-up">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("complaints.search")}
              className="pl-9 glass border-white/10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-9 text-xs rounded-full glass border border-white/10 px-3 focus:outline-none focus:border-orange-500/40"
              data-testid="sort-select"
              title="Sort complaints"
            >
              <option value="recent">Newest first</option>
              <option value="priority">Priority (negative first)</option>
            </select>
            <button
              onClick={exportCsv}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full glass border-white/10 text-sm hover:border-orange-500/40 transition-all"
            >
              <Download className="w-4 h-4" />
              {t("complaints.export")}
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 fade-in-up">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap",
                filter === f.key
                  ? "bg-orange-500/15 border-orange-500/50 text-orange-300 glow-orange"
                  : "border-white/10 text-foreground/70 hover:border-orange-500/30 hover:text-orange-300"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filteredComplaints.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl text-muted-foreground">
            <MessageSquareWarning className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>{t("complaints.empty")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComplaints.map((complaint: any, i: number) => (
              <ComplaintRow key={complaint.ticketId} complaint={complaint} index={i} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
