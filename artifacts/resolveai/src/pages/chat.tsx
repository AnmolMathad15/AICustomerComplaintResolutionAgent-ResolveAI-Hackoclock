import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/layout";
import { useAnalyzeComplaint, useListCustomers, type AnalyzeComplaintResponse } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfidenceBar } from "@/components/confidence-bar";
import { FrustrationMeter } from "@/components/frustration-meter";
import { EscalationCard } from "@/components/escalation-card";
import { getSeverityColor, getSentimentColor } from "@/lib/format";
import {
  Send,
  BrainCircuit,
  User,
  Bot,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  FileText,
  Clock,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/components/language-provider";
import { VoiceInput } from "@/components/voice-input";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  customerId?: string;
  result?: AnalyzeComplaintResponse;
  timestamp: Date;
}

function TypingIndicator() {
  const t = useT();
  return (
    <div className="flex gap-3 items-start slide-in-left">
      <div className="w-8 h-8 rounded-full bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0 mt-1">
        <Bot className="w-4 h-4 text-orange-400" />
      </div>
      <div className="glass rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce [animation-delay:0ms]" />
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce [animation-delay:150ms]" />
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce [animation-delay:300ms]" />
          </div>
          <span className="text-xs text-muted-foreground ml-1">{t("chat.analyzing")}</span>
        </div>
      </div>
    </div>
  );
}

function UserBubble({ message }: { message: ChatMessage }) {
  return (
    <div className="flex gap-3 items-start justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="max-w-[75%] space-y-1">
        <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        <p className="text-[10px] text-muted-foreground text-right px-1">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
      <div className="w-8 h-8 rounded-full bg-muted border flex items-center justify-center shrink-0 mt-1">
        <User className="w-4 h-4 text-muted-foreground" />
      </div>
    </div>
  );
}

function AiResultBubble({ message }: { message: ChatMessage }) {
  const result = message.result!;
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <div className="flex gap-3 items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-1">
        <Bot className="w-4 h-4 text-primary" />
      </div>
      <div className="max-w-[85%] space-y-3">
        <div className="bg-card border rounded-2xl rounded-tl-sm shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-4 pt-4 pb-3 border-b bg-muted/20">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-mono text-[10px]">{result.ticketId}</Badge>
              <Badge className={getSeverityColor(result.severity)} variant="outline">
                {result.severity}
              </Badge>
              <Badge variant="secondary" className="capitalize text-xs">
                {result.complaintType.replace("_", " ")}
              </Badge>
              <span className={cn("text-xs font-medium capitalize", getSentimentColor(result.sentiment))}>
                {result.sentiment} sentiment
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="px-4 py-4 space-y-4">
            {/* Resolution */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                AI Resolution
              </div>
              <p className="text-sm leading-relaxed text-foreground">{result.resolution}</p>
            </div>

            {/* Confidence + Frustration */}
            <div className="space-y-3">
              <ConfidenceBar
                percentage={result.confidencePercentage ?? Math.round((result.confidenceScore ?? 0) * 100)}
                level={result.confidenceLevel ?? "MEDIUM"}
              />
              <FrustrationMeter score={result.frustrationScore ?? 0} />
            </div>

            {/* Policy + SLA */}
            <div className="flex flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-md">
                <FileText className="w-3.5 h-3.5" />
                <span className="font-mono font-medium">{(result as any).policyCode ?? result.policyReference}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-md">
                <Clock className="w-3.5 h-3.5" />
                SLA: <span className="font-semibold ml-0.5">{result.slaHours}h</span>
              </div>
            </div>

            {/* Why AI made this decision */}
            {result.confidenceBreakdown && (
              <div>
                <button
                  onClick={() => setShowBreakdown((v) => !v)}
                  className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Why did AI make this decision?
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", showBreakdown && "rotate-180")} />
                </button>
                {showBreakdown && (
                  <div className="mt-2.5 rounded-lg bg-muted/50 border p-3 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Confidence Breakdown</p>
                    <div className="space-y-2">
                      {[
                        {
                          label: "Complaint Classification",
                          score: result.confidenceBreakdown.classificationScore,
                          weight: result.confidenceBreakdown.classificationWeight,
                        },
                        {
                          label: "Policy Match",
                          score: result.confidenceBreakdown.policyMatchScore,
                          weight: result.confidenceBreakdown.policyMatchWeight,
                        },
                        {
                          label: "Customer History",
                          score: result.confidenceBreakdown.historyFactor,
                          weight: result.confidenceBreakdown.historyWeight,
                        },
                      ].map((item) => (
                        <div key={item.label} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{item.label}</span>
                            <span className="font-medium tabular-nums">
                              {Math.round(item.score * 100)}%
                              <span className="text-muted-foreground/60 text-[10px] ml-1">×{item.weight}</span>
                            </span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary/70 rounded-full"
                              style={{ width: `${item.score * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Escalation */}
          {result.shouldEscalate && result.escalation && (
            <div className="px-4 pb-4">
              <EscalationCard
                ticketId={result.ticketId}
                escalation={result.escalation as any}
                slaHours={result.slaHours}
              />
            </div>
          )}
          {result.shouldEscalate && !result.escalation && (
            <div className="px-4 pb-4">
              <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
                <p className="text-sm text-destructive/80">
                  {result.escalationSummary ?? "High frustration detected. Requires human review."}
                </p>
              </div>
            </div>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground px-1">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: customers, isLoading: customersLoading } = useListCustomers();
  const analyzeMutation = useAnalyzeComplaint();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, analyzeMutation.isPending]);

  const handleSend = () => {
    if (!input.trim() || !selectedCustomerId) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      customerId: selectedCustomerId,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const complaintText = input.trim();
    setInput("");

    analyzeMutation.mutate(
      { data: { complaint: complaintText, customerId: selectedCustomerId } },
      {
        onSuccess: (result) => {
          const aiMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: result.resolution,
            result,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiMessage]);
        },
        onError: () => {
          const errorMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Sorry, I couldn't process that complaint. Please try again.",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const t = useT();
  return (
    <Layout pageTitle="Chat AI">
      <div className="flex flex-col h-[calc(100vh-10rem)] -mt-2">
        <div className="mb-4 fade-in-up">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3 text-glow-orange">
            <BrainCircuit className="w-7 h-7 text-orange-400" />
            {t("chat.title")}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{t("chat.subtitle")}</p>
        </div>

        {/* Customer Selector */}
        <div className="mb-4">
          {customersLoading ? (
            <Skeleton className="h-10 w-64" />
          ) : (
            <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
              <SelectTrigger className="w-64 glass border-white/10">
                <SelectValue placeholder={t("chat.selectCustomer")} />
              </SelectTrigger>
              <SelectContent>
                {customers?.map((c) => (
                  <SelectItem key={c.customerId} value={c.customerId}>
                    {c.name} · <span className="text-muted-foreground">{c.tier}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto rounded-xl border bg-muted/20 p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-3">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <BrainCircuit className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{t("chat.aiAssistantTitle")}</p>
                <p className="text-sm mt-1 max-w-xs">{t("chat.aiAssistantHint")}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-xs text-left">
                {[
                  "My refund still hasn't arrived after 2 weeks",
                  "I was charged twice for my subscription",
                  "The app keeps crashing every time I open it",
                  "My package is delayed by 10 days with no update",
                ].map((example) => (
                  <button
                    key={example}
                    onClick={() => setInput(example)}
                    className="text-left px-3 py-2 rounded-lg border border-border/60 bg-card hover:border-primary/40 hover:bg-primary/5 transition-colors text-muted-foreground hover:text-foreground"
                  >
                    "{example}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) =>
                msg.role === "user" ? (
                  <UserBubble key={msg.id} message={msg} />
                ) : (
                  <AiResultBubble key={msg.id} message={msg} />
                )
              )}
              {analyzeMutation.isPending && <TypingIndicator />}
            </>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="mt-3 flex gap-2 items-end">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selectedCustomerId ? t("chat.placeholder") : t("chat.placeholderNoCustomer")}
            disabled={!selectedCustomerId || analyzeMutation.isPending}
            className="flex-1 min-h-[52px] max-h-40 resize-none bg-card"
            rows={2}
          />
          <VoiceInput
            className="h-[52px] w-[52px] shrink-0"
            onTranscript={(t) =>
              setInput((prev) => (prev ? `${prev} ${t}` : t))
            }
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || !selectedCustomerId || analyzeMutation.isPending}
            className="h-[52px] px-5 shrink-0 glow-orange glow-orange-hover"
          >
            {analyzeMutation.isPending ? (
              <BrainCircuit className="w-5 h-5 animate-pulse" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </Layout>
  );
}
