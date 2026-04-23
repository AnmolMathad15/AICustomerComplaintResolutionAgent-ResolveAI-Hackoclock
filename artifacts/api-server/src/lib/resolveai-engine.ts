/**
 * ResolveAI Engine
 *
 * Core AI simulation engine for complaint analysis.
 * Provides classification, sentiment analysis, confidence scoring,
 * escalation logic, and resolution generation.
 *
 * Note: This implementation uses deterministic simulation of AI model
 * behavior based on keyword analysis and policy matching, providing
 * realistic outputs without requiring HuggingFace model downloads.
 */

import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import { logger } from "./logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Types ────────────────────────────────────────────────────────────────────

export type ComplaintType =
  | "billing"
  | "refund"
  | "technical"
  | "delivery"
  | "account"
  | "product_quality"
  | "unknown";

export type Severity = "HIGH" | "MEDIUM" | "LOW";
export type Sentiment = "positive" | "neutral" | "negative";
export type TicketStatus = "resolved" | "pending" | "escalated" | "in_progress";
export type Authenticity = "genuine" | "suspicious" | "likely_fake";
export type TicketChannel = "chat" | "email" | "phone";
export type CustomerTier = "Premium" | "Standard" | "Basic";

export interface HistoryItem {
  ticketId: string;
  channel: TicketChannel;
  date: string;
  issue: string;
  complaintType: string;
  status: TicketStatus;
  resolution: string;
  agentName: string;
}

export interface Customer {
  customer_id: string;
  name: string;
  email: string;
  phone: string;
  tier: CustomerTier;
  join_date: string;
  history: {
    ticket_id: string;
    channel: string;
    date: string;
    issue: string;
    complaint_type: string;
    status: string;
    resolution: string;
    agent_name: string;
  }[];
}

export interface Policy {
  auto_resolve_limit?: number;
  max_processing_days?: number;
  resolution_template: string;
  escalate_conditions: string[];
  sla_hours: number;
}

export interface Policies {
  [key: string]: Policy;
}

export interface ConfidenceBreakdown {
  classificationScore: number;
  policyMatchScore: number;
  historyFactor: number;
  classificationWeight: number;
  policyMatchWeight: number;
  historyWeight: number;
}

export interface EscalationDetail {
  assignedAgent: string;
  reasons: string[];
  summary: string;
}

export interface AnalysisResult {
  ticketId: string;
  customerId: string;
  customerName: string;
  customerTier: string;
  complaint: string;
  complaintType: ComplaintType;
  severity: Severity;
  confidenceScore: number;
  confidencePercentage: number;
  confidenceLevel: "HIGH" | "MEDIUM" | "LOW";
  confidenceBreakdown: ConfidenceBreakdown;
  sentiment: Sentiment;
  frustrationScore: number;
  resolution: string;
  policyReference: string;
  policyCode: string;
  shouldEscalate: boolean;
  escalation: EscalationDetail | null;
  escalationSummary: string | null;
  assignedAgent: string | null;
  slaHours: number;
  createdAt: string;
}

// ─── Data Loading ─────────────────────────────────────────────────────────────

function loadCustomers(): Customer[] {
  const dataPath = path.join(__dirname, "../data/customers.json");
  const raw = readFileSync(dataPath, "utf-8");
  return JSON.parse(raw) as Customer[];
}

function loadPolicies(): Policies {
  const dataPath = path.join(__dirname, "../data/policies.json");
  const raw = readFileSync(dataPath, "utf-8");
  return JSON.parse(raw) as Policies;
}

export const customers: Customer[] = loadCustomers();
export const policies: Policies = loadPolicies();

// ─── AI Simulation: Complaint Classifier ─────────────────────────────────────

const COMPLAINT_KEYWORDS: Record<ComplaintType, string[]> = {
  billing: [
    "charge",
    "overcharged",
    "invoice",
    "payment",
    "billing",
    "bill",
    "fee",
    "price",
    "cost",
    "subscription",
    "renewed",
    "renewal",
    "deducted",
    "transaction",
    "statement",
    "amount",
    "credit card",
    "charged twice",
    "double charged",
  ],
  refund: [
    "refund",
    "money back",
    "return",
    "reimbursement",
    "credit",
    "repay",
    "reimburse",
    "refunded",
    "reversal",
    "chargeback",
    "get my money",
    "refunding",
  ],
  technical: [
    "crash",
    "bug",
    "error",
    "not working",
    "broken",
    "issue",
    "glitch",
    "technical",
    "software",
    "app",
    "website",
    "loading",
    "timeout",
    "slow",
    "freeze",
    "hang",
    "fail",
    "404",
    "500",
    "unable to",
    "cannot",
  ],
  delivery: [
    "delivery",
    "deliver",
    "shipped",
    "shipping",
    "package",
    "parcel",
    "arrived",
    "tracking",
    "lost",
    "missing",
    "delayed",
    "late",
    "not received",
    "where is",
    "dispatch",
    "courier",
    "transit",
    "logistics",
    "order",
  ],
  account: [
    "account",
    "login",
    "password",
    "access",
    "locked",
    "username",
    "authentication",
    "2fa",
    "profile",
    "sign in",
    "sign up",
    "reset",
    "verify",
    "hack",
    "unauthorized",
    "breach",
    "security",
    "suspicious",
    "compromised",
  ],
  product_quality: [
    "quality",
    "defective",
    "broken",
    "damaged",
    "faulty",
    "wrong item",
    "not as described",
    "poor quality",
    "counterfeit",
    "fake",
    "scratched",
    "missing part",
    "incomplete",
    "expired",
    "unsafe",
  ],
  unknown: [],
};

/**
 * Simulates zero-shot classification using keyword matching and scoring.
 * Returns complaint type and classification confidence.
 */
export function classifyComplaint(
  text: string
): { complaintType: ComplaintType; classificationScore: number } {
  const lower = text.toLowerCase();
  const scores: Record<string, number> = {};

  for (const [type, keywords] of Object.entries(COMPLAINT_KEYWORDS)) {
    if (type === "unknown") continue;
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) score += 1;
    }
    scores[type] = score / Math.max(keywords.length, 1);
  }

  let bestType: ComplaintType = "unknown";
  let bestScore = 0;

  for (const [type, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestType = type as ComplaintType;
    }
  }

  // Normalize score: anything above 2 keyword hits gives high confidence
  const rawHits = Object.entries(scores).reduce((max, [t, s]) => {
    return t === bestType ? s * COMPLAINT_KEYWORDS[t as ComplaintType].length : max;
  }, 0);

  let classificationScore = Math.min(0.5 + rawHits * 0.1, 0.97);
  if (bestType === "unknown") classificationScore = 0.3;

  return { complaintType: bestType, classificationScore };
}

/**
 * Determines severity based on complaint type, urgency words, and tone.
 */
export function determineSeverity(
  text: string,
  complaintType: ComplaintType,
  frustrationScore: number
): Severity {
  const lower = text.toLowerCase();

  const highUrgencyWords = [
    "urgent",
    "immediately",
    "asap",
    "emergency",
    "critical",
    "serious",
    "lawsuit",
    "legal",
    "fraudulent",
    "fraud",
    "stolen",
    "hack",
    "breach",
    "cannot work",
    "business impact",
    "losing money",
    "lost data",
  ];

  const hasHighUrgency = highUrgencyWords.some((w) => lower.includes(w));

  if (hasHighUrgency || frustrationScore > 75 || complaintType === "account") {
    return "HIGH";
  }

  const mediumUrgencyWords = [
    "important",
    "need help",
    "problem",
    "issue",
    "not happy",
    "disappointed",
    "frustrated",
    "delay",
    "waiting",
    "still",
    "again",
  ];

  const hasMediumUrgency = mediumUrgencyWords.some((w) => lower.includes(w));

  if (hasMediumUrgency || frustrationScore > 45) {
    return "MEDIUM";
  }

  return "LOW";
}

// ─── AI Simulation: Sentiment Analyzer ───────────────────────────────────────

const NEGATIVE_WORDS = [
  "terrible",
  "awful",
  "horrible",
  "worst",
  "hate",
  "disgusting",
  "furious",
  "angry",
  "unacceptable",
  "frustrated",
  "disgusted",
  "ridiculous",
  "incompetent",
  "useless",
  "failed",
  "failure",
  "disappointed",
  "outraged",
  "appalled",
  "never again",
  "scam",
  "rip off",
  "ripoff",
  "fraud",
  "cheated",
  "lied",
  "dishonest",
  "pathetic",
  "waste",
  "broken",
  "ruined",
  "destroyed",
];

const POSITIVE_WORDS = [
  "thank",
  "thanks",
  "great",
  "excellent",
  "wonderful",
  "love",
  "happy",
  "pleased",
  "appreciate",
  "good",
  "amazing",
  "fantastic",
  "helpful",
  "perfect",
  "satisfied",
  "impressed",
];

const INTENSIFIERS = [
  "very",
  "extremely",
  "absolutely",
  "completely",
  "totally",
  "really",
  "so",
  "incredibly",
];

/**
 * Simulates sentiment analysis with frustration scoring.
 * Returns sentiment label and frustration score 0-100.
 */
export function analyzeSentiment(
  text: string
): { sentiment: Sentiment; frustrationScore: number } {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);

  let negativeCount = 0;
  let positiveCount = 0;
  let intensifierMultiplier = 1;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (INTENSIFIERS.includes(word)) {
      intensifierMultiplier = 1.5;
      continue;
    }

    if (NEGATIVE_WORDS.some((nw) => lower.includes(nw))) {
      negativeCount +=
        NEGATIVE_WORDS.filter((nw) => lower.includes(nw)).length *
        intensifierMultiplier;
      break;
    }
    intensifierMultiplier = 1;
  }

  positiveCount = POSITIVE_WORDS.filter((pw) => lower.includes(pw)).length;
  negativeCount = NEGATIVE_WORDS.filter((nw) => lower.includes(nw)).length;

  // Check for intensifiers near negative words
  for (const intensifier of INTENSIFIERS) {
    if (lower.includes(intensifier)) {
      negativeCount *= 1.3;
      break;
    }
  }

  // Count exclamation marks and caps as frustration signals
  const exclamations = (text.match(/!/g) || []).length;
  const capsRatio =
    text.split("").filter((c) => c >= "A" && c <= "Z").length /
    Math.max(text.length, 1);

  // Frustration score computation
  let frustrationScore =
    Math.min(negativeCount * 15, 70) +
    exclamations * 5 +
    (capsRatio > 0.3 ? 15 : capsRatio > 0.15 ? 8 : 0);

  frustrationScore = Math.min(Math.round(frustrationScore), 100);

  let sentiment: Sentiment;
  if (negativeCount > positiveCount && negativeCount > 0) {
    sentiment = "negative";
    if (frustrationScore < 20) frustrationScore = 20;
  } else if (positiveCount > negativeCount && positiveCount > 0) {
    sentiment = "positive";
    frustrationScore = Math.min(frustrationScore, 20);
  } else {
    sentiment = "neutral";
    if (frustrationScore < 5) frustrationScore = 5;
  }

  return { sentiment, frustrationScore };
}

// ─── Confidence Scoring ───────────────────────────────────────────────────────

/**
 * Computes confidence score using the formula:
 * confidence = (classification_score * 0.5) + (policy_match_score * 0.3) + (history_factor * 0.2)
 */
export function computeConfidenceScore(
  classificationScore: number,
  complaintType: ComplaintType,
  customer: Customer | null
): { confidenceScore: number; confidencePercentage: number; confidenceLevel: "HIGH" | "MEDIUM" | "LOW"; historyFactor: number; policyMatchScore: number; breakdown: ConfidenceBreakdown } {
  // Policy match score
  let policyMatchScore: number;
  if (complaintType === "unknown") {
    policyMatchScore = 0;
  } else if (policies[complaintType]) {
    policyMatchScore = 1.0;
  } else {
    policyMatchScore = 0.5;
  }

  // History factor
  let historyFactor = 1.0; // First time = 1.0
  if (customer) {
    const sameTypeHistory = customer.history.filter(
      (h) => h.complaint_type === complaintType
    );

    if (sameTypeHistory.length > 0) {
      const hasResolved = sameTypeHistory.some((h) => h.status === "resolved");
      const unresolvedCount = sameTypeHistory.filter(
        (h) => h.status === "pending" || h.status === "escalated"
      ).length;

      if (hasResolved && unresolvedCount === 0) {
        historyFactor = 0.8; // Similar issue resolved before
      } else if (unresolvedCount >= 2) {
        historyFactor = 0.3; // Repeated unresolved
      } else {
        historyFactor = 0.6;
      }
    }
  }

  const confidenceScore =
    classificationScore * 0.5 +
    policyMatchScore * 0.3 +
    historyFactor * 0.2;

  const rounded = Math.round(confidenceScore * 100) / 100;
  const percentage = Math.round(rounded * 100);
  const level: "HIGH" | "MEDIUM" | "LOW" =
    percentage >= 75 ? "HIGH" : percentage >= 55 ? "MEDIUM" : "LOW";

  const breakdown: ConfidenceBreakdown = {
    classificationScore: Math.round(classificationScore * 100) / 100,
    policyMatchScore: Math.round(policyMatchScore * 100) / 100,
    historyFactor: Math.round(historyFactor * 100) / 100,
    classificationWeight: 0.5,
    policyMatchWeight: 0.3,
    historyWeight: 0.2,
  };

  return {
    confidenceScore: rounded,
    confidencePercentage: percentage,
    confidenceLevel: level,
    historyFactor,
    policyMatchScore,
    breakdown,
  };
}

// ─── Escalation Logic ─────────────────────────────────────────────────────────

const AGENTS = [
  "Sarah Thompson",
  "Michael Rodriguez",
  "Emily Chang",
  "David Martinez",
  "Rachel Kim",
  "James Wilson",
];

/**
 * Determines if a complaint should be escalated and generates escalation data.
 */
export function evaluateEscalation(
  complaintType: ComplaintType,
  sentiment: Sentiment,
  frustrationScore: number,
  confidenceScore: number,
  customer: Customer | null
): {
  shouldEscalate: boolean;
  escalationReasons: string[];
  assignedAgent: string | null;
} {
  const escalationReasons: string[] = [];

  // Condition 1: High frustration
  if (frustrationScore > 80) {
    escalationReasons.push("High frustration score: " + frustrationScore);
  }

  // Condition 2: Low confidence
  if (confidenceScore < 0.6) {
    escalationReasons.push(
      "Low AI confidence: " + (confidenceScore * 100).toFixed(0) + "%"
    );
  }

  // Condition 3: Policy escalation conditions
  if (complaintType !== "unknown" && policies[complaintType]) {
    const policy = policies[complaintType];

    if (customer) {
      const sameTypeHistory = customer.history.filter(
        (h) => h.complaint_type === complaintType
      );

      const isRepeated = sameTypeHistory.length >= 2;
      const hasUnresolved = sameTypeHistory.some(
        (h) => h.status === "pending" || h.status === "escalated"
      );

      if (isRepeated && hasUnresolved) {
        const repeatCondition = policy.escalate_conditions.find((c) =>
          c.includes("repeated")
        );
        if (repeatCondition) {
          escalationReasons.push("Repeated unresolved issue: " + repeatCondition);
        }
      }
    }

    // Account type has security escalation conditions
    if (
      complaintType === "account" &&
      policy.escalate_conditions.includes("security_breach_suspected")
    ) {
      const lower = ""; // Already evaluated in classification
      if (sentiment === "negative" && frustrationScore > 60) {
        escalationReasons.push("Potential security concern with high frustration");
      }
    }
  }

  // Condition 4: 2+ unresolved tickets of same type
  if (customer) {
    const sameTypeUnresolved = customer.history.filter(
      (h) =>
        h.complaint_type === complaintType &&
        (h.status === "pending" || h.status === "escalated")
    );

    if (sameTypeUnresolved.length >= 2) {
      escalationReasons.push(
        "2+ unresolved tickets of same type (" + complaintType + ")"
      );
    }
  }

  const shouldEscalate = escalationReasons.length > 0;
  const assignedAgent = shouldEscalate
    ? AGENTS[Math.floor(Math.random() * AGENTS.length)]
    : null;

  return { shouldEscalate, escalationReasons, assignedAgent };
}

/**
 * Generates an escalation summary (simulating the BART summarizer).
 */
export function generateEscalationSummary(
  customer: Customer | null,
  complaint: string,
  complaintType: ComplaintType,
  escalationReasons: string[]
): string {
  if (!customer) {
    return `Customer complaint regarding ${complaintType}. Escalation triggered: ${escalationReasons.join("; ")}. Requires immediate agent attention.`;
  }

  const recentHistory = customer.history.slice(-2);
  const historyContext =
    recentHistory.length > 0
      ? ` Previous issues include: ${recentHistory.map((h) => h.issue).join("; ")}.`
      : "";

  const summary =
    `${customer.tier} customer ${customer.name} (${customer.customer_id}) reported a ${complaintType} issue: "${complaint.slice(0, 100)}${complaint.length > 100 ? "..." : ""}".` +
    historyContext +
    ` Escalation triggered due to: ${escalationReasons.join("; ")}.`;

  return summary.slice(0, 300);
}

// ─── Resolution Generator ─────────────────────────────────────────────────────

/**
 * Generates resolution text from policy template and customer context.
 */
export function generateResolution(
  complaintType: ComplaintType,
  customer: Customer | null
): { resolution: string; policyReference: string; policyCode: string; slaHours: number } {
  if (complaintType === "unknown" || !policies[complaintType]) {
    return {
      resolution:
        "Thank you for reaching out. Our team has reviewed your concern and will contact you within 24 hours with a personalized resolution.",
      policyReference: "General Support Policy",
      policyCode: "POL-GEN-1.0",
      slaHours: 24,
    };
  }

  const policy = policies[complaintType];
  let resolution = policy.resolution_template;

  // Personalize for premium customers
  if (customer?.tier === "Premium") {
    resolution += " As a valued Premium member, you will receive priority handling.";
  }

  const typeCode = complaintType.toUpperCase().replace("_", "-");

  return {
    resolution,
    policyReference: `${complaintType.charAt(0).toUpperCase() + complaintType.slice(1)} Policy v2.1`,
    policyCode: `POL-${typeCode}-2.1`,
    slaHours: policy.sla_hours,
  };
}

// ─── Ticket ID Generator ──────────────────────────────────────────────────────

/**
 * Generates a unique ticket ID in the format TKT-{timestamp}-{random4digits}
 */
export function generateTicketId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `TKT-${timestamp}-${random}`;
}

// ─── Main Analysis Function ───────────────────────────────────────────────────

/**
 * Main entry point for complaint analysis.
 * Orchestrates all AI steps to produce a complete analysis result.
 */
export function analyzeComplaint(
  complaint: string,
  customerId: string
): AnalysisResult {
  try {
    // Find customer (or use generic template)
    const customer = customers.find((c) => c.customer_id === customerId) || null;
    const customerName = customer?.name || "Unknown Customer";

    // Step 1: Classify complaint
    const { complaintType, classificationScore } = classifyComplaint(complaint);

    // Step 2: Analyze sentiment
    const { sentiment, frustrationScore } = analyzeSentiment(complaint);

    // Step 3: Compute severity
    const severity = determineSeverity(complaint, complaintType, frustrationScore);

    // Step 4: Compute confidence score
    const { confidenceScore, confidencePercentage, confidenceLevel, breakdown } = computeConfidenceScore(
      classificationScore,
      complaintType,
      customer
    );

    // Step 5: Generate resolution
    const { resolution, policyReference, policyCode, slaHours } = generateResolution(
      complaintType,
      customer
    );

    // Step 6: Evaluate escalation
    const { shouldEscalate, escalationReasons, assignedAgent } =
      evaluateEscalation(
        complaintType,
        sentiment,
        frustrationScore,
        confidenceScore,
        customer
      );

    // Step 7: Generate escalation summary if needed
    const escalationSummary = shouldEscalate
      ? generateEscalationSummary(
          customer,
          complaint,
          complaintType,
          escalationReasons
        )
      : null;

    const escalation: EscalationDetail | null =
      shouldEscalate && assignedAgent
        ? {
            assignedAgent,
            reasons: escalationReasons,
            summary: escalationSummary!,
          }
        : null;

    const ticketId = generateTicketId();

    logger.info(
      {
        ticketId,
        customerId,
        complaintType,
        severity,
        confidenceScore,
        shouldEscalate,
      },
      "Complaint analyzed"
    );

    return {
      ticketId,
      customerId,
      customerName,
      customerTier: customer?.tier ?? "Basic",
      complaint,
      complaintType,
      severity,
      confidenceScore,
      confidencePercentage,
      confidenceLevel,
      confidenceBreakdown: breakdown,
      sentiment,
      frustrationScore,
      resolution,
      policyReference,
      policyCode,
      shouldEscalate,
      escalation,
      escalationSummary,
      assignedAgent,
      slaHours,
      createdAt: new Date().toISOString(),
    };
  } catch (err) {
    logger.error({ err }, "Error analyzing complaint, returning mock response");

    return {
      ticketId: generateTicketId(),
      customerId,
      customerName: "Unknown Customer",
      customerTier: "Basic",
      complaint,
      complaintType: "unknown",
      severity: "MEDIUM",
      confidenceScore: 0.5,
      confidencePercentage: 50,
      confidenceLevel: "MEDIUM",
      confidenceBreakdown: {
        classificationScore: 0.5,
        policyMatchScore: 0.5,
        historyFactor: 1.0,
        classificationWeight: 0.5,
        policyMatchWeight: 0.3,
        historyWeight: 0.2,
      },
      sentiment: "neutral",
      frustrationScore: 50,
      resolution:
        "Thank you for contacting us. Our team is reviewing your case and will respond within 24 hours.",
      policyReference: "General Support Policy",
      policyCode: "POL-GEN-1.0",
      shouldEscalate: false,
      escalation: null,
      escalationSummary: null,
      assignedAgent: null,
      slaHours: 24,
      createdAt: new Date().toISOString(),
    };
  }
}

// ─── Companies / Agents ──────────────────────────────────────────────────────

export interface Agent {
  id: string;
  name: string;
  specialty: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  logo: string;
  color: string;
  slaHours: number;
  policies: string[];
  agents: Agent[];
}

const companiesPath = path.join(__dirname, "../data/companies.json");
const companiesData: { companies: Company[] } = JSON.parse(
  readFileSync(companiesPath, "utf-8")
);

export function listCompanies(): Company[] {
  return companiesData.companies;
}

export function findCompany(id: string): Company | undefined {
  return companiesData.companies.find((c) => c.id === id);
}

export function listAgents(companyId?: string): Agent[] {
  if (!companyId) {
    return companiesData.companies.flatMap((c) => c.agents);
  }
  const company = findCompany(companyId);
  return company?.agents ?? [];
}

// ─── In-memory complaint store ────────────────────────────────────────────────

/**
 * Extended complaint record stored in memory. Adds runtime-mutable fields
 * for company multi-tenancy, status tracking, and agent assignment.
 */
export interface StoredComplaint extends AnalysisResult {
  companyId: string;
  companyName: string;
  status: TicketStatus;
  assignedAgentId: string | null;
  agentSpecialty: string | null;
  resolutionOverride: string | null;
  updatedAt: string;
  // Lightweight fake-complaint detection (admin-only signal)
  authenticity: Authenticity;
  authenticityReasons: string[];
  // Numeric priority rank derived from sentiment/severity, used for queue sorting
  priorityRank: number;
  // Multimodal additions (all optional / nullable for backward compatibility)
  imageUrl: string | null;
  platform: "amazon" | "flipkart" | "swiggy" | "other" | null;
  orderId: string | null;
  imageAnalysis: {
    damageDetected: boolean;
    damageType: "broken" | "scratched" | "wrong_item" | "stained" | "none";
    confidence: number;
    fraudRisk: "low" | "medium" | "high";
    notes: string;
  } | null;
  fraudRisk: "low" | "medium" | "high";
  decision: "auto_refund" | "auto_resolve" | "escalate" | "request_more_info";
  decisionExplanation: string;
}

// ─── Fake Complaint Detection (heuristic) ─────────────────────────────────────

const ABUSE_KEYWORDS = [
  "idiot",
  "stupid",
  "fuck",
  "shit",
  "damn",
  "hate you",
  "scam",
  "scammer",
  "trash company",
  "worst ever",
];

/**
 * Detect authenticity of a complaint based on existing store contents.
 * Returns a label + human-readable reasons. Never blocks submission —
 * signal is surfaced to admins only.
 */
export function detectAuthenticity(
  complaintText: string,
  customerId: string,
  existing: StoredComplaint[]
): { authenticity: Authenticity; reasons: string[] } {
  const reasons: string[] = [];
  const text = complaintText.toLowerCase().trim();

  const abuseHits = ABUSE_KEYWORDS.filter((k) => text.includes(k));
  if (abuseHits.length > 0) {
    reasons.push(`Abusive language detected (${abuseHits.slice(0, 2).join(", ")})`);
  }

  const fromSameCustomer = existing.filter((c) => c.customerId === customerId);

  // Repeat: identical or near-identical complaint within last 24h
  const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const repeats = fromSameCustomer.filter(
    (c) =>
      new Date(c.createdAt).getTime() > dayAgo &&
      c.complaint.toLowerCase().trim() === text
  );
  if (repeats.length >= 1) {
    reasons.push(`Duplicate of ${repeats.length} recent complaint(s)`);
  }

  // Frequency burst: 3+ submissions in last 5 minutes
  const fiveMinAgo = Date.now() - 5 * 60 * 1000;
  const burst = fromSameCustomer.filter(
    (c) => new Date(c.createdAt).getTime() > fiveMinAgo
  );
  if (burst.length >= 3) {
    reasons.push(`High submission frequency (${burst.length + 1} in 5 min)`);
  }

  // Very short complaint (< 8 chars) → suspicious
  if (text.length > 0 && text.length < 8) {
    reasons.push("Complaint text too short to be meaningful");
  }

  let authenticity: Authenticity = "genuine";
  if (reasons.length >= 2 || abuseHits.length >= 2 || burst.length >= 3) {
    authenticity = "likely_fake";
  } else if (reasons.length === 1) {
    authenticity = "suspicious";
  }

  return { authenticity, reasons };
}

// Priority ranking: lower number = higher priority (negative + HIGH first)
function computePriorityRank(
  sentiment: Sentiment,
  severity: Severity,
  customerTier: string
): number {
  const sentimentScore =
    sentiment === "negative" ? 0 : sentiment === "neutral" ? 100 : 200;
  const severityScore =
    severity === "HIGH" ? 0 : severity === "MEDIUM" ? 30 : 60;
  const tierScore = customerTier === "Premium" ? 0 : customerTier === "Standard" ? 5 : 10;
  return sentimentScore + severityScore + tierScore;
}

const complaintStore: StoredComplaint[] = [];

export function storeComplaint(
  result: AnalysisResult,
  companyId?: string
): StoredComplaint {
  const company = companyId ? findCompany(companyId) : undefined;
  const status: TicketStatus = result.shouldEscalate ? "escalated" : "resolved";

  // Run authenticity heuristic against existing complaints (admin-only signal).
  const { authenticity, reasons: authenticityReasons } = detectAuthenticity(
    result.complaint,
    result.customerId,
    complaintStore
  );

  const priorityRank = computePriorityRank(
    result.sentiment,
    result.severity,
    result.customerTier
  );

  const record: StoredComplaint = {
    ...result,
    companyId: company?.id ?? companyId ?? "amazon",
    companyName: company?.name ?? "Amazon",
    status,
    assignedAgentId: null,
    agentSpecialty: null,
    resolutionOverride: null,
    updatedAt: new Date().toISOString(),
    authenticity,
    authenticityReasons,
    priorityRank,
    imageUrl: null,
    platform: null,
    orderId: null,
    imageAnalysis: null,
    fraudRisk: "low",
    decision: result.shouldEscalate ? "escalate" : "auto_resolve",
    decisionExplanation: result.shouldEscalate
      ? result.escalationSummary ?? "Routed to human agent."
      : result.resolution,
  };

  // Auto-assign agent if escalated and company has agents
  if (status === "escalated" && company && company.agents.length > 0) {
    const agent = company.agents[Math.floor(Math.random() * company.agents.length)];
    record.assignedAgentId = agent.id;
    record.assignedAgent = agent.name;
    record.agentSpecialty = agent.specialty;
  }

  complaintStore.push(record);
  return record;
}

export function getAllComplaints(filter?: {
  companyId?: string;
  customerId?: string;
}): StoredComplaint[] {
  let list = [...complaintStore];
  if (filter?.companyId) list = list.filter((c) => c.companyId === filter.companyId);
  if (filter?.customerId) list = list.filter((c) => c.customerId === filter.customerId);
  return list.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function findComplaintByTicketId(
  ticketId: string
): StoredComplaint | undefined {
  return complaintStore.find((c) => c.ticketId === ticketId);
}

export function updateComplaint(
  ticketId: string,
  patch: {
    status?: TicketStatus;
    assignedAgentId?: string | null;
    resolutionOverride?: string | null;
  }
): StoredComplaint | undefined {
  const c = complaintStore.find((x) => x.ticketId === ticketId);
  if (!c) return undefined;

  if (patch.status) c.status = patch.status;

  if (patch.assignedAgentId !== undefined) {
    if (patch.assignedAgentId === null) {
      c.assignedAgentId = null;
      c.assignedAgent = null;
      c.agentSpecialty = null;
    } else {
      const agent = listAgents(c.companyId).find((a) => a.id === patch.assignedAgentId);
      if (agent) {
        c.assignedAgentId = agent.id;
        c.assignedAgent = agent.name;
        c.agentSpecialty = agent.specialty;
      }
    }
  }

  if (patch.resolutionOverride !== undefined) {
    c.resolutionOverride = patch.resolutionOverride;
    if (patch.resolutionOverride) {
      c.resolution = patch.resolutionOverride;
    }
  }

  c.updatedAt = new Date().toISOString();
  return c;
}

// ─── Dashboard Stats Generator ────────────────────────────────────────────────

/**
 * Computes aggregated stats for the dashboard.
 */
export function computeDashboardStats(companyId?: string) {
  const complaints = getAllComplaints({ companyId });
  const total = complaints.length;
  const escalated = complaints.filter((c) => c.shouldEscalate).length;
  const resolvedByAi = total - escalated;
  const avgConfidence =
    total > 0
      ? Math.round(
          (complaints.reduce((sum, c) => sum + c.confidenceScore, 0) / total) *
            100
        ) / 100
      : 0;

  const avgFrustrationScore =
    total > 0
      ? Math.round(
          complaints.reduce((sum, c) => sum + c.frustrationScore, 0) / total
        )
      : 0;

  const resolvedRate = total > 0 ? Math.round((resolvedByAi / total) * 100) / 100 : 0;

  // Complaints by type
  const complaintsByType: Record<string, number> = {};
  for (const c of complaints) {
    complaintsByType[c.complaintType] =
      (complaintsByType[c.complaintType] || 0) + 1;
  }

  // Sentiment trend (last 6 hours, grouped)
  const now = new Date();
  const sentimentTrend = [];

  for (let i = 5; i >= 0; i--) {
    const hourDate = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hourStr = hourDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const hourStart = hourDate.getTime();
    const hourEnd = hourStart + 60 * 60 * 1000;

    const inHour = complaints.filter((c) => {
      const t = new Date(c.createdAt).getTime();
      return t >= hourStart && t < hourEnd;
    });

    sentimentTrend.push({
      hour: hourStr,
      positive: inHour.filter((c) => c.sentiment === "positive").length,
      neutral: inHour.filter((c) => c.sentiment === "neutral").length,
      negative: inHour.filter((c) => c.sentiment === "negative").length,
    });
  }

  return {
    totalToday: total,
    resolvedByAi,
    escalated,
    avgConfidence,
    complaintsByType,
    sentimentTrend,
    resolvedRate,
    avgFrustrationScore,
  };
}
