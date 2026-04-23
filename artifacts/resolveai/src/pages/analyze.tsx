import { useState } from "react";
import { Layout } from "@/components/layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useAnalyzeComplaint,
  useListCustomers,
  useEscalateComplaint,
  type AnalyzeComplaintResponse,
} from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/components/language-provider";
import { getSeverityColor, getSentimentColor } from "@/lib/format";
import { ConfidenceBar } from "@/components/confidence-bar";
import { FrustrationMeter } from "@/components/frustration-meter";
import { EscalationCard } from "@/components/escalation-card";
import {
  BrainCircuit,
  AlertTriangle,
  FileText,
  CheckCircle,
  ShieldAlert,
  Zap,
  ChevronDown,
  Clock,
  Sparkles,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { FormLabel as Label } from "@/components/ui/form";
import { cn } from "@/lib/utils";

const analyzeSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  complaint: z.string().min(10, "Complaint must be at least 10 characters"),
});

type AnalyzeFormValues = z.infer<typeof analyzeSchema>;

export default function Analyze() {
  const { toast } = useToast();
  const [result, setResult] = useState<AnalyzeComplaintResponse | null>(null);
  const [escalateReason, setEscalateReason] = useState("");
  const [isEscalateDialogOpen, setIsEscalateDialogOpen] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const { language } = useLanguage();
  const { data: customers, isLoading: customersLoading } = useListCustomers();
  const analyzeMutation = useAnalyzeComplaint();
  const escalateMutation = useEscalateComplaint();

  const form = useForm<AnalyzeFormValues>({
    resolver: zodResolver(analyzeSchema),
    defaultValues: { customerId: "", complaint: "" },
  });

  const onSubmit = (data: AnalyzeFormValues) => {
    setShowBreakdown(false);
    analyzeMutation.mutate(
      { data: { ...data, language } },
      {
        onSuccess: (response) => {
          setResult(response);
          toast({ title: "Analysis Complete", description: "Complaint processed by AI engine." });
        },
        onError: () => {
          toast({ title: "Analysis Failed", description: "Error processing complaint.", variant: "destructive" });
        },
      }
    );
  };

  const handleEscalate = () => {
    if (!result) return;
    escalateMutation.mutate(
      { data: { ticketId: result.ticketId, customerId: result.customerId, reason: escalateReason || "Manual escalation from dashboard" } },
      {
        onSuccess: (response) => {
          setIsEscalateDialogOpen(false);
          setEscalateReason("");
          setResult((prev) =>
            prev ? { ...prev, shouldEscalate: true, assignedAgent: response.assignedAgent, escalationSummary: response.summary } : null
          );
          toast({ title: "Escalated", description: `Ticket assigned to ${response.assignedAgent}` });
        },
        onError: () => {
          toast({ title: "Escalation Failed", description: "Could not escalate the ticket.", variant: "destructive" });
        },
      }
    );
  };

  const confidencePercentage = result
    ? (result as any).confidencePercentage ?? Math.round((result.confidenceScore ?? 0) * 100)
    : 0;
  const confidenceLevel = (result as any)?.confidenceLevel ?? "MEDIUM";
  const policyCode = (result as any)?.policyCode ?? result?.policyReference;
  const breakdown = (result as any)?.confidenceBreakdown;
  const escalationObj = (result as any)?.escalation;

  return (
    <Layout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Analysis</h1>
          <p className="text-muted-foreground mt-1">Submit a complaint for automated resolution assessment.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form */}
          <div className="lg:col-span-5 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  New Assessment
                </CardTitle>
                <CardDescription>Enter details to run through the resolution engine.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="customerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customer</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-customer">
                                <SelectValue placeholder={customersLoading ? "Loading..." : "Select customer"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {customers?.map((c) => (
                                <SelectItem key={c.customerId} value={c.customerId}>
                                  {c.name} ({c.tier})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="complaint"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Complaint Text</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Paste the customer's message here..."
                              className="min-h-[150px] resize-y"
                              data-testid="input-complaint"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={analyzeMutation.isPending}
                      data-testid="button-analyze"
                    >
                      {analyzeMutation.isPending ? (
                        <>
                          <BrainCircuit className="w-4 h-4 mr-2 animate-pulse" />
                          Analyzing complaint...
                        </>
                      ) : (
                        <>
                          <BrainCircuit className="w-4 h-4 mr-2" />
                          Run Analysis
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Result Panel */}
          <div className="lg:col-span-7">
            {analyzeMutation.isPending ? (
              <Card className="h-full animate-pulse">
                <CardHeader>
                  <Skeleton className="h-5 w-40 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            ) : result ? (
              <Card className="h-full border-primary/20 shadow-lg shadow-primary/5 animate-in fade-in slide-in-from-bottom-2 duration-400">
                <CardHeader className="bg-muted/30 pb-4 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="font-mono text-xs">{result.ticketId}</Badge>
                        <span className="text-xs text-muted-foreground">{new Date(result.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <CardTitle className="text-xl">{result.customerName}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">{(result as any).customerTier ?? ""} Customer</p>
                    </div>
                    <Badge className={getSeverityColor(result.severity)}>
                      {result.severity} SEVERITY
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-6 space-y-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</p>
                      <Badge variant="secondary" className="capitalize font-medium">
                        {result.complaintType.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sentiment</p>
                      <p className={cn("font-medium capitalize text-sm", getSentimentColor(result.sentiment))}>
                        {result.sentiment}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">SLA</p>
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        {result.slaHours}h
                      </div>
                    </div>
                  </div>

                  {/* Confidence Bar */}
                  <ConfidenceBar percentage={confidencePercentage} level={confidenceLevel} />

                  {/* Frustration Meter */}
                  <FrustrationMeter score={result.frustrationScore ?? 0} />

                  <Separator />

                  {/* Resolution */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                      <CheckCircle className="w-4 h-4" />
                      AI Proposed Resolution
                    </div>
                    <p className="text-sm leading-relaxed bg-muted/50 p-4 rounded-md border">
                      {result.resolution}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <FileText className="w-3.5 h-3.5" />
                      Policy: <span className="font-mono font-medium ml-0.5">{policyCode}</span>
                    </div>
                  </div>

                  {/* Why AI made this decision */}
                  {breakdown && (
                    <div className="space-y-2">
                      <button
                        onClick={() => setShowBreakdown((v) => !v)}
                        className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors w-full"
                      >
                        <Sparkles className="w-4 h-4" />
                        Why did AI make this decision?
                        <ChevronDown className={cn("w-4 h-4 ml-auto transition-transform", showBreakdown && "rotate-180")} />
                      </button>
                      {showBreakdown && (
                        <div className="rounded-lg bg-muted/40 border p-4 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                          <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Confidence Breakdown</p>
                          <div className="space-y-3">
                            {[
                              { label: "Complaint Classification", score: breakdown.classificationScore, weight: breakdown.classificationWeight, hint: "How well keywords match complaint categories" },
                              { label: "Policy Match", score: breakdown.policyMatchScore, weight: breakdown.policyMatchWeight, hint: "Whether a matching policy was found" },
                              { label: "Customer History", score: breakdown.historyFactor, weight: breakdown.historyWeight, hint: "Prior tickets of the same type" },
                            ].map((item) => (
                              <div key={item.label} className="space-y-1.5">
                                <div className="flex justify-between items-baseline">
                                  <div>
                                    <span className="text-sm font-medium">{item.label}</span>
                                    <span className="text-xs text-muted-foreground ml-2">{item.hint}</span>
                                  </div>
                                  <span className="text-sm font-bold tabular-nums">
                                    {Math.round(item.score * 100)}%
                                    <span className="text-xs text-muted-foreground font-normal ml-1">×{item.weight}</span>
                                  </span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary/80 rounded-full transition-all duration-500"
                                    style={{ width: `${item.score * 100}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground pt-1 border-t">
                            Formula: (Classification × 0.5) + (Policy × 0.3) + (History × 0.2) = <strong>{confidencePercentage}%</strong>
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Escalation */}
                  {result.shouldEscalate && escalationObj && (
                    <EscalationCard
                      ticketId={result.ticketId}
                      escalation={escalationObj}
                      slaHours={result.slaHours}
                    />
                  )}
                  {result.shouldEscalate && !escalationObj && (
                    <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 space-y-2">
                      <div className="flex items-center gap-2 font-semibold text-destructive">
                        <AlertTriangle className="w-4 h-4" />
                        Escalation Recommended
                      </div>
                      <p className="text-sm text-destructive/80">
                        {result.escalationSummary || "High frustration detected. Requires human review."}
                      </p>
                      {result.assignedAgent && (
                        <p className="text-sm font-medium">
                          Assigned to: {result.assignedAgent} (SLA: {result.slaHours}h)
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="bg-muted/30 border-t pt-4 flex justify-end gap-3">
                  {!result.assignedAgent && (
                    <Dialog open={isEscalateDialogOpen} onOpenChange={setIsEscalateDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant={result.shouldEscalate ? "default" : "outline"}
                          className={result.shouldEscalate ? "bg-destructive hover:bg-destructive/90 text-white" : ""}
                        >
                          <ShieldAlert className="w-4 h-4 mr-2" />
                          Escalate to Agent
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Escalate Ticket</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Reason for escalation</Label>
                            <Textarea
                              placeholder="Why does this need human review?"
                              value={escalateReason}
                              onChange={(e) => setEscalateReason(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsEscalateDialogOpen(false)}>Cancel</Button>
                          <Button onClick={handleEscalate} disabled={escalateMutation.isPending}>
                            {escalateMutation.isPending ? "Escalating..." : "Confirm Escalation"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                  {result.assignedAgent && (
                    <Badge variant="outline" className="px-3 py-1">Status: Escalated</Badge>
                  )}
                  {!result.assignedAgent && !result.shouldEscalate && (
                    <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      Approve Resolution
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ) : (
              <div className="h-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-12 text-center text-muted-foreground bg-muted/10">
                <FileText className="w-12 h-12 mb-4 opacity-20" />
                <h3 className="text-lg font-medium text-foreground mb-1">Awaiting Input</h3>
                <p className="max-w-xs text-sm">
                  Select a customer and enter their complaint to generate an AI resolution assessment.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
