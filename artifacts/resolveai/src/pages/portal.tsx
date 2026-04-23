import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  Building2,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ArrowLeft,
  User,
  Bell,
  ImagePlus,
  X as XIcon,
  ShieldAlert,
} from "lucide-react";
import {
  useAnalyzeComplaint,
  useListComplaints,
  useListCompanies,
  getListComplaintsQueryKey,
} from "@workspace/api-client-react";
import type { AnalyzeComplaintResponse, Company } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { BackgroundAmbient } from "@/components/background-ambient";
import { LanguageSelector } from "@/components/language-selector";
import { useLanguage, useT } from "@/components/language-provider";
import { ExpandableText } from "@/components/expandable-text";
import { localizeResolution, voiceLocaleFor } from "@/lib/localize-resolution";
import { VoiceInput } from "@/components/voice-input";
import { cn } from "@/lib/utils";

const CUSTOMER_KEY = "resolveai.portal.customerId";

function StatusBadge({ status }: { status: string }) {
  const t = useT();
  const map: Record<string, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
    resolved: {
      label: t("portal.status.resolved"),
      cls: "border-emerald-500/40 text-emerald-300 bg-emerald-500/10",
      icon: CheckCircle2,
    },
    escalated: {
      label: t("portal.status.escalated"),
      cls: "border-red-500/40 text-red-300 bg-red-500/10",
      icon: AlertTriangle,
    },
    pending: {
      label: t("portal.status.pending"),
      cls: "border-amber-500/40 text-amber-300 bg-amber-500/10",
      icon: Clock,
    },
  };
  const { label, cls, icon: Icon } = map[status] ?? map.pending;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-medium",
        cls
      )}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

export default function Portal() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = useT();
  const { data: companies = [] } = useListCompanies();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [customerId] = useState(() => {
    if (typeof window === "undefined") return "C001";
    let id = localStorage.getItem(CUSTOMER_KEY);
    if (!id) {
      const pool = ["C001", "C002", "C003", "C004", "C005"];
      id = pool[Math.floor(Math.random() * pool.length)];
      localStorage.setItem(CUSTOMER_KEY, id);
    }
    return id;
  });
  const [draft, setDraft] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [platform, setPlatform] = useState<"amazon" | "flipkart" | "swiggy" | "other" | "">("");
  const [orderId, setOrderId] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const submittedRef = useRef<Set<string>>(new Set());

  const onPickImage = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      toast({ title: "Image too large", description: "Please use an image under 4 MB." });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImageBase64(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  };

  const { mutate: analyze, isPending } = useAnalyzeComplaint();

  // Live polling: refetch every 3 seconds for selected company + this customer
  const portalListParams = {
    customerId,
    ...(selectedCompanyId ? { companyId: selectedCompanyId } : {}),
  };
  const { data: complaints = [], refetch } = useListComplaints(portalListParams, {
    query: {
      refetchInterval: 3000,
      queryKey: getListComplaintsQueryKey(portalListParams),
    },
  });

  const selectedCompany: Company | undefined = useMemo(
    () => companies.find((c) => c.id === selectedCompanyId),
    [companies, selectedCompanyId]
  );

  // Toast on status changes (diff vs previous render)
  const prevStatuses = useRef<Map<string, string>>(new Map());
  useEffect(() => {
    complaints.forEach((c) => {
      const prev = prevStatuses.current.get(c.ticketId);
      const status = c.status ?? (c.shouldEscalate ? "escalated" : "resolved");
      if (prev && prev !== status) {
        if (status === "escalated") {
          toast({
            title: t("portal.toast.escalated"),
            description: `${c.ticketId} ${t("portal.toast.escalatedDesc")} ${c.assignedAgent ?? t("portal.toast.aHumanAgent")}.`,
          });
        } else if (status === "resolved") {
          toast({
            title: t("portal.toast.resolved"),
            description: `${c.ticketId} ${t("portal.toast.resolvedDesc")}`,
          });
        }
      }
      prevStatuses.current.set(c.ticketId, status);
    });
  }, [complaints, toast, t]);

  const submit = () => {
    if (!draft.trim() || !selectedCompanyId || isPending) return;
    analyze(
      {
        data: {
          complaint: draft.trim(),
          customerId,
          companyId: selectedCompanyId,
          language,
          ...(imageBase64 ? { imageBase64 } : {}),
          ...(platform ? { platform } : {}),
          ...(orderId.trim() ? { orderId: orderId.trim() } : {}),
        },
      },
      {
        onSuccess: (result: AnalyzeComplaintResponse) => {
          submittedRef.current.add(result.ticketId);
          setDraft("");
          setImageBase64(null);
          setOrderId("");
          if (fileInputRef.current) fileInputRef.current.value = "";
          refetch();
          toast({
            title: result.shouldEscalate ? t("portal.toast.routedHuman") : t("portal.toast.resolvedInstantly"),
            description: `${result.ticketId} ${t("portal.toast.ticketCreated")}`,
          });
        },
        onError: () => {
          toast({
            title: t("portal.toast.failed"),
            description: t("portal.toast.tryAgain"),
          });
        },
      }
    );
  };

  // Step 1: company picker
  if (!selectedCompanyId) {
    return (
      <div className="min-h-screen text-foreground relative overflow-hidden">
        <BackgroundAmbient />

        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <LanguageSelector />
          <button
            onClick={() => navigate("/")}
            className="h-9 px-3 rounded-full glass border border-white/10 text-xs text-foreground/70 hover:text-orange-300 hover:border-orange-500/30 transition-all"
          >
            <ArrowLeft className="inline w-3.5 h-3.5 mr-1" />
            {t("portal.home")}
          </button>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/10 text-[11px] uppercase tracking-[0.2em] text-cyan-300/80 mb-5">
              <Sparkles className="w-3 h-3" />
              {t("portal.customerPortal")}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {t("portal.pickCompany")}
            </h1>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              {t("portal.pickCompanySubtitle")}
            </p>
            <p className="text-[11px] text-muted-foreground mt-4">
              {t("portal.signedInAs")} <span className="text-orange-300 font-mono">{customerId}</span>
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {companies.map((c, i) => (
              <motion.button
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                whileHover={{ y: -6 }}
                onClick={() => setSelectedCompanyId(c.id)}
                className="group relative overflow-hidden rounded-2xl glass border border-white/10 p-6 text-left hover:border-white/30 transition-all"
                data-testid={`portal-company-${c.id}`}
                style={{
                  boxShadow: `0 0 0 rgba(0,0,0,0)`,
                }}
              >
                <div
                  className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-30 blur-3xl group-hover:opacity-60 transition-opacity"
                  style={{ background: c.color }}
                />
                <div className="relative">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white font-bold text-lg"
                    style={{
                      background: `linear-gradient(135deg, ${c.color}, ${c.color}99)`,
                      boxShadow: `0 8px 24px ${c.color}55`,
                    }}
                  >
                    {c.name[0]}
                  </div>
                  <div className="font-semibold text-lg">{c.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{c.industry}</div>
                  <div className="mt-4 flex items-center gap-1.5 text-[11px] text-cyan-300/80">
                    <Clock className="w-3 h-3" />
                    SLA {c.slaHours}h • {c.agents.length} {t("portal.agentsSuffix")}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: chat + timeline
  return (
    <div className="min-h-screen text-foreground relative overflow-hidden">
      <BackgroundAmbient />

      {/* Top nav bar */}
      <div className="relative z-20 h-16 px-4 md:px-6 flex items-center justify-between glass-strong border-b border-white/8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedCompanyId(null)}
            className="h-8 px-3 rounded-full glass border border-white/10 text-xs hover:border-orange-500/30 transition-all"
          >
            <ArrowLeft className="inline w-3.5 h-3.5 mr-1" />
            {t("portal.switch")}
          </button>
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: selectedCompany?.color,
                boxShadow: `0 0 10px ${selectedCompany?.color}`,
              }}
            />
            <span className="font-semibold">{selectedCompany?.name}</span>
            <span className="text-xs text-muted-foreground hidden md:inline">
              · {selectedCompany?.industry}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSelector />
          <div className="flex items-center gap-2 pl-2 ml-1 border-l border-white/8 h-8">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden md:flex flex-col leading-tight">
              <span className="text-xs font-medium">{t("portal.customer")}</span>
              <span className="text-[10px] text-muted-foreground font-mono">{customerId}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: submit + policies */}
        <div className="lg:col-span-3 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl glass border border-white/10 p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <h2 className="font-semibold">{t("portal.submitTitle")}</h2>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {t("portal.submitDesc")}
            </p>
            <div className="relative">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
                }}
                rows={4}
                placeholder={t("portal.placeholder")}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-500/40 resize-none"
                data-testid="portal-complaint-input"
              />

              {/* Multimodal: platform + order id + optional image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as typeof platform)}
                  className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500/40"
                  data-testid="portal-platform"
                >
                  <option value="">Platform (optional)</option>
                  <option value="amazon">Amazon</option>
                  <option value="flipkart">Flipkart</option>
                  <option value="swiggy">Swiggy</option>
                  <option value="other">Other</option>
                </select>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Order ID (optional)"
                  className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500/40"
                  data-testid="portal-order-id"
                />
              </div>

              {imageBase64 && (
                <div className="mt-3 relative inline-block">
                  <img
                    src={imageBase64}
                    alt="attached"
                    className="h-24 rounded-lg border border-white/10 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageBase64(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black/70 border border-white/20 flex items-center justify-center hover:bg-red-500/30"
                    aria-label="Remove image"
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onPickImage(e.target.files?.[0])}
                data-testid="portal-image-input"
              />

              <div className="flex items-center justify-between mt-3 gap-2">
                <div className="flex items-center gap-2">
                  <VoiceInput
                    lang={voiceLocaleFor(language)}
                    onTranscript={(txt) =>
                      setDraft((prev) => (prev ? `${prev} ${txt}` : txt))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Attach image"
                    aria-label="Attach image"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/15 bg-white/[0.04] text-muted-foreground hover:border-orange-500/40 hover:text-orange-300 transition-all"
                    data-testid="portal-attach-image"
                  >
                    <ImagePlus className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] text-muted-foreground">
                    {t("portal.shortcutHint")}
                  </span>
                </div>
                <button
                  onClick={submit}
                  disabled={isPending || !draft.trim()}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #f97316 0%, #ec4899 100%)",
                    boxShadow: "0 8px 24px rgba(249,115,22,0.35)",
                  }}
                  data-testid="portal-submit"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t("portal.analyzing")}
                    </>
                  ) : (
                    <>
                      {t("portal.send")} <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Company policies */}
          {selectedCompany && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl glass border border-white/10 p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <h3 className="font-semibold text-sm">{selectedCompany.name} {t("portal.policiesSuffix")}</h3>
              </div>
              <ul className="space-y-2">
                {selectedCompany.policies.map((p, i) => (
                  <li key={i} className="flex gap-2 text-xs text-foreground/80">
                    <span
                      className="mt-1.5 w-1 h-1 rounded-full shrink-0"
                      style={{ background: selectedCompany.color }}
                    />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

        {/* Right: live timeline */}
        <div className="lg:col-span-2">
          <div className="sticky top-4 rounded-2xl glass border border-white/10 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-orange-400" />
                <h3 className="font-semibold text-sm">{t("portal.liveTimeline")}</h3>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ping-dot" />
                {t("portal.live")}
              </span>
            </div>

            {complaints.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">
                <Building2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
                {t("portal.empty")}
              </div>
            ) : (
              <div className="relative space-y-3 max-h-[520px] overflow-y-auto pr-1">
                <AnimatePresence initial={false}>
                  {complaints.map((c) => {
                    const status =
                      c.status ?? (c.shouldEscalate ? "escalated" : "resolved");
                    return (
                      <motion.div
                        key={c.ticketId}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        layout
                        className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
                        data-testid={`portal-ticket-${c.ticketId}`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {c.ticketId}
                          </span>
                          <StatusBadge status={status} />
                        </div>
                        <p className="text-xs text-foreground/85 line-clamp-2 mb-2">
                          {c.complaint}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span className="capitalize">
                            {c.complaintType.replace("_", " ")}
                          </span>
                          <span>{(c.confidenceScore * 100).toFixed(0)}% {t("portal.confSuffix")}</span>
                        </div>
                        {c.assignedAgent && (
                          <div className="mt-2 pt-2 border-t border-white/5 text-[11px] flex items-center gap-1.5">
                            <span className="text-muted-foreground">{t("portal.agent")}</span>
                            <span className="text-orange-300 font-medium">
                              {c.assignedAgent}
                            </span>
                          </div>
                        )}
                        {c.imageUrl && (
                          <div className="mt-2 flex gap-2 items-start">
                            <img
                              src={c.imageUrl}
                              alt="attachment"
                              className="w-16 h-16 rounded-md object-cover border border-white/10"
                            />
                            {c.imageAnalysis && (
                              <div className="text-[10px] text-foreground/75 leading-tight">
                                <div className="font-medium text-cyan-300">
                                  {c.imageAnalysis.damageDetected
                                    ? `Damage: ${c.imageAnalysis.damageType.replace("_", " ")}`
                                    : "No damage detected"}
                                </div>
                                <div>{c.imageAnalysis.confidence}% confidence</div>
                              </div>
                            )}
                          </div>
                        )}
                        {(c.platform || c.orderId) && (
                          <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
                            {c.platform && (
                              <span className="px-1.5 py-0.5 rounded border border-white/10 bg-white/[0.04] capitalize">
                                {c.platform}
                              </span>
                            )}
                            {c.orderId && (
                              <span className="px-1.5 py-0.5 rounded border border-white/10 bg-white/[0.04] font-mono">
                                {c.orderId}
                              </span>
                            )}
                          </div>
                        )}
                        {c.fraudRisk && c.fraudRisk !== "low" && (
                          <div
                            className={cn(
                              "mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px]",
                              c.fraudRisk === "high"
                                ? "border-red-500/40 text-red-300 bg-red-500/10"
                                : "border-amber-500/40 text-amber-300 bg-amber-500/10"
                            )}
                          >
                            <ShieldAlert className="w-3 h-3" />
                            Fraud risk: {c.fraudRisk}
                          </div>
                        )}
                        <div className="mt-2 text-[11px] text-foreground/70 italic">
                          <ExpandableText
                            text={`"${localizeResolution(c.decisionExplanation || c.resolution, language)}"`}
                            threshold={120}
                            className="text-foreground/70"
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
