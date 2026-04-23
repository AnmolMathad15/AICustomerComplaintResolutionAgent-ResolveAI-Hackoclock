import { Layout } from "@/components/layout";
import { useListComplaints } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getSeverityColor, getSentimentColor, formatDate } from "@/lib/format";
import { MessageSquareWarning, Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useT } from "@/components/language-provider";

type FilterKey = "all" | "resolved" | "escalated" | "pending";

export default function Complaints() {
  const { data: complaints, isLoading, isError } = useListComplaints();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const t = useT();

  const filteredComplaints = useMemo(() => {
    if (!complaints) return [];
    return complaints
      .filter((c) =>
        c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.complaintType.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((c) => {
        if (filter === "all") return true;
        if (filter === "resolved") return !c.shouldEscalate && !c.assignedAgent;
        if (filter === "escalated") return !!c.assignedAgent;
        if (filter === "pending") return c.shouldEscalate && !c.assignedAgent;
        return true;
      });
  }, [complaints, searchTerm, filter]);

  const exportCsv = () => {
    if (!filteredComplaints.length) return;
    const header = ["Ticket", "Customer", "Type", "Severity", "Sentiment", "Confidence", "Status", "Created"];
    const rows = filteredComplaints.map((c) => [
      c.ticketId,
      c.customerName,
      c.complaintType,
      c.severity,
      c.sentiment,
      `${(c.confidenceScore * 100).toFixed(0)}%`,
      c.assignedAgent ? "Escalated" : c.shouldEscalate ? "Pending" : "Resolved",
      c.createdAt,
    ]);
    const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
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
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32 w-full" />)}
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
    { key: "escalated", label: t("complaints.filterEscalated") },
    { key: "pending", label: t("complaints.filterPending") },
  ];

  const severityBorder = (s: string) => {
    switch (s.toUpperCase()) {
      case "HIGH": return "border-l-red-500";
      case "MEDIUM": return "border-l-orange-500";
      case "LOW": return "border-l-emerald-500";
      default: return "border-l-white/10";
    }
  };

  return (
    <Layout pageTitle="Complaints">
      <div className="space-y-6">
        <div className="fade-in-up">
          <h1 className="text-3xl font-bold tracking-tight text-glow-orange">{t("complaints.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("complaints.subtitle")}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between fade-in-up">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("complaints.search")}
              className="pl-9 glass border-white/10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="input-search-complaints"
            />
          </div>
          <button
            onClick={exportCsv}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full glass border-white/10 text-sm hover:border-orange-500/40 transition-all"
            data-testid="export-csv"
          >
            <Download className="w-4 h-4" />
            {t("complaints.export")}
          </button>
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
              data-testid={`filter-${f.key}`}
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
            {filteredComplaints.map((complaint, i) => (
              <Card
                key={complaint.ticketId}
                className={cn("overflow-hidden border-l-4 fade-in-up", severityBorder(complaint.severity))}
                style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
              >
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-0 items-stretch">
                    <div className="p-5 md:col-span-3 border-r border-white/5 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="font-mono text-[10px] font-semibold text-muted-foreground">{complaint.ticketId}</span>
                        <Badge className={getSeverityColor(complaint.severity)} variant="outline">
                          {complaint.severity}
                        </Badge>
                      </div>
                      <Link href={`/customers/${complaint.customerId}`} className="font-medium hover:text-orange-400 transition-colors text-foreground" data-testid={`link-customer-${complaint.customerId}`}>
                        {complaint.customerName}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatDate(complaint.createdAt)}</p>
                    </div>

                    <div className="p-5 md:col-span-6 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <Badge variant="secondary" className="capitalize text-xs bg-orange-500/10 text-orange-300 border-orange-500/20">
                          {complaint.complaintType.replace("_", " ")}
                        </Badge>
                        <span className={`text-xs font-medium capitalize ${getSentimentColor(complaint.sentiment)}`}>
                          {complaint.sentiment} {t("complaints.sentimentSuffix")}
                        </span>
                      </div>
                      <p className="text-sm line-clamp-2 text-muted-foreground mb-3">{complaint.complaint}</p>
                      <div className="flex items-center gap-2 mt-auto">
                        <span className="text-xs text-muted-foreground">{t("complaints.aiConfidence")}</span>
                        <div className="flex items-center gap-2 flex-1 max-w-[180px]">
                          <div className="h-1.5 flex-1 bg-white/8 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-orange-500 to-orange-400 fill-bar"
                              style={{ width: `${complaint.confidenceScore * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium tabular-nums">{(complaint.confidenceScore * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 md:col-span-3 border-l border-white/5 flex flex-col items-start justify-center">
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">{t("complaints.status")}</p>
                      {complaint.assignedAgent ? (
                        <div className="space-y-1">
                          <Badge variant="outline" className="border-red-500/40 text-red-300 bg-red-500/10 glow-red">{t("badges.escalated")}</Badge>
                          <p className="text-xs font-medium mt-2">Agent: {complaint.assignedAgent}</p>
                        </div>
                      ) : complaint.shouldEscalate ? (
                        <Badge variant="outline" className="border-amber-500/40 text-amber-300 bg-amber-500/10 glow-amber">{t("badges.pending")}</Badge>
                      ) : (
                        <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 bg-emerald-500/10 glow-emerald-soft">{t("badges.resolved")}</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
