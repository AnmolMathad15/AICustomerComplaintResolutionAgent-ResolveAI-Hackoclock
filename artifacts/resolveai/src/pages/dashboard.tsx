import { Layout } from "@/components/layout";
import { useGetDashboardStats } from "@workspace/api-client-react";
import { useCompany } from "@/lib/company-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, BrainCircuit, CheckCircle2, BarChart2, Activity } from "lucide-react";
import { useT } from "@/components/language-provider";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

function CountUp({ value, suffix = "", decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const duration = 1500;
    let raf: number;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{display.toFixed(decimals)}{suffix}</>;
}

export default function Dashboard() {
  const { selectedCompanyId, selectedCompany } = useCompany();
  const params = selectedCompanyId !== "all" ? { companyId: selectedCompanyId } : undefined;
  const { data: stats, isLoading, isError } = useGetDashboardStats(params, {
    query: { refetchInterval: 5000 },
  });
  const t = useT();

  if (isLoading) {
    return (
      <Layout pageTitle="Command Center">
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || !stats) {
    return (
      <Layout pageTitle="Command Center">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Failed to load dashboard data</h2>
          <p className="text-muted-foreground">Please check your connection and try again.</p>
        </div>
      </Layout>
    );
  }

  const complaintsChartData = Object.entries(stats.complaintsByType).map(([name, value]) => ({
    name: name.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    count: value,
  }));

  const activityFeed = [
    { id: 1, text: "New complaint from Rahul Sharma", time: "2s ago", color: "bg-orange-500" },
    { id: 2, text: "AI resolved billing ticket #4821", time: "1m ago", color: "bg-emerald-500" },
    { id: 3, text: "Escalated to John Doe", time: "4m ago", color: "bg-red-500" },
    { id: 4, text: "Sentiment turned positive on #4810", time: "8m ago", color: "bg-cyan-500" },
    { id: 5, text: "5 new tickets in last hour", time: "12m ago", color: "bg-indigo-500" },
  ];

  const cards = [
    {
      title: t("dashboard.totalComplaints"),
      value: stats.totalToday,
      sub: t("dashboard.activeVolume"),
      icon: BarChart2,
      color: "text-cyan-400",
      testid: "stat-total",
    },
    {
      title: t("dashboard.aiResolved"),
      value: stats.resolvedByAi,
      sub: `${(stats.resolvedRate * 100).toFixed(1)}% ${t("dashboard.resolutionRate")}`,
      icon: CheckCircle2,
      color: "text-emerald-400",
      testid: "stat-resolved",
    },
    {
      title: t("dashboard.escalated"),
      value: stats.escalated,
      sub: t("dashboard.requiresHuman"),
      icon: AlertCircle,
      color: "text-red-400",
      testid: "stat-escalated",
    },
    {
      title: t("dashboard.avgConfidence"),
      value: stats.avgConfidence * 100,
      decimals: 1,
      suffix: "%",
      sub: t("dashboard.acrossModels"),
      icon: BrainCircuit,
      color: "text-orange-400",
      testid: "stat-confidence",
    },
  ];

  return (
    <Layout pageTitle="Command Center">
      <div className="space-y-8">
        <div className="fade-in-up">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-glow-orange">
            {t("dashboard.title")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("dashboard.subtitle")}
            {selectedCompany && (
              <span className="ml-2">
                · Filter:{" "}
                <span className="text-orange-300 font-medium">{selectedCompany.name}</span>
              </span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <Card
                key={c.title}
                className="fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {c.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${c.color}`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold tabular-nums ${c.color}`} data-testid={c.testid}>
                    <CountUp value={c.value} decimals={c.decimals ?? 0} suffix={c.suffix ?? ""} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{c.sub}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 fade-in-up" style={{ animationDelay: "400ms" }}>
            <CardHeader>
              <CardTitle>{t("dashboard.sentimentTrend")}</CardTitle>
            </CardHeader>
            <CardContent className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.sentimentTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="hour" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "rgba(10,10,25,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                  <Legend />
                  <Line type="monotone" dataKey="positive" stroke="#22c55e" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="neutral" stroke="#94a3b8" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="fade-in-up" style={{ animationDelay: "500ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-orange-400" />
                {t("dashboard.activityFeed")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {activityFeed.map((a) => (
                  <li key={a.id} className="flex items-start gap-3 text-sm">
                    <span className={`mt-1.5 w-2 h-2 rounded-full ${a.color} shrink-0 ping-dot`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground/90 leading-snug">{a.text}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{a.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="fade-in-up" style={{ animationDelay: "600ms" }}>
          <CardHeader>
            <CardTitle>{t("dashboard.complaintsByCategory")}</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complaintsChartData} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="name"
                  stroke="rgba(255,255,255,0.4)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  angle={-30}
                  textAnchor="end"
                />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  contentStyle={{ background: "rgba(10,10,25,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}
                />
                <Bar dataKey="count" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
