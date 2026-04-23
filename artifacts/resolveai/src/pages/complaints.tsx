import { Layout } from "@/components/layout";
import { useListComplaints, type AnalyzeComplaintResponse } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getSeverityColor, getSentimentColor, formatDate } from "@/lib/format";
import { MessageSquareWarning, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Link } from "wouter";

export default function Complaints() {
  const { data: complaints, isLoading, isError } = useListComplaints();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredComplaints = useMemo(() => {
    if (!complaints) return [];
    return complaints.filter((c) => 
      c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.complaintType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [complaints, searchTerm]);

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex gap-4 mb-6">
            <Skeleton className="h-10 w-[300px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || !complaints) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <MessageSquareWarning className="w-12 h-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Failed to load complaints</h2>
          <p className="text-muted-foreground">Please check your connection and try again.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Complaint Log</h1>
          <p className="text-muted-foreground mt-1">Review AI analyses and escalation statuses.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-[350px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by customer, ticket, or type..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="input-search-complaints"
            />
          </div>
        </div>

        {filteredComplaints.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-card text-muted-foreground">
            <p>No complaints found matching your search.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComplaints.map((complaint) => (
              <Card key={complaint.ticketId} className="overflow-hidden hover:border-primary/50 transition-colors">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-0 items-stretch h-full">
                    {/* Left Info */}
                    <div className="p-5 md:col-span-3 bg-muted/20 border-r border-border/50 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-xs font-semibold text-muted-foreground">{complaint.ticketId}</span>
                        <Badge className={getSeverityColor(complaint.severity)} variant="outline">
                          {complaint.severity}
                        </Badge>
                      </div>
                      <Link href={`/customers/${complaint.customerId}`} className="font-medium hover:underline inline-block mb-1 text-foreground" data-testid={`link-customer-${complaint.customerId}`}>
                        {complaint.customerName}
                      </Link>
                      <p className="text-xs text-muted-foreground">{formatDate(complaint.createdAt)}</p>
                    </div>

                    {/* Middle Info */}
                    <div className="p-5 md:col-span-6 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="secondary" className="capitalize text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20">
                          {complaint.complaintType.replace('_', ' ')}
                        </Badge>
                        <span className={`text-xs font-medium capitalize ${getSentimentColor(complaint.sentiment)}`}>
                          {complaint.sentiment} Sentiment
                        </span>
                      </div>
                      <p className="text-sm line-clamp-2 text-muted-foreground mb-3">{complaint.complaint}</p>
                      <div className="flex items-center gap-2 mt-auto">
                        <span className="text-xs text-muted-foreground">AI Confidence:</span>
                        <div className="flex items-center gap-2 flex-1 max-w-[150px]">
                          <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-accent" 
                              style={{ width: `${complaint.confidenceScore * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">{(complaint.confidenceScore * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Info */}
                    <div className="p-5 md:col-span-3 bg-muted/10 border-l border-border/50 flex flex-col items-start justify-center">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Status</p>
                      {complaint.assignedAgent ? (
                        <div className="space-y-1">
                          <Badge variant="outline" className="border-destructive/30 text-destructive bg-destructive/10">Escalated</Badge>
                          <p className="text-xs font-medium mt-2">Agent: {complaint.assignedAgent}</p>
                        </div>
                      ) : complaint.shouldEscalate ? (
                        <Badge variant="outline" className="border-amber-500/30 text-amber-600 bg-amber-500/10 dark:text-amber-400">Needs Escalation</Badge>
                      ) : (
                        <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 bg-emerald-500/10 dark:text-emerald-400">AI Resolved</Badge>
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
