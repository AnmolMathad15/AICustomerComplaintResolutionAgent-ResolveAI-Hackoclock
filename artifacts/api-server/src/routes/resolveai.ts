/**
 * ResolveAI Routes
 *
 * Implements all complaint resolution API endpoints.
 */

import { Router, type IRouter } from "express";
import {
  analyzeComplaint,
  storeComplaint,
  getAllComplaints,
  findComplaintByTicketId,
  updateComplaint,
  computeDashboardStats,
  customers,
  generateEscalationSummary,
  classifyComplaint,
  listCompanies,
  listAgents,
  findCompany,
  type TicketStatus,
} from "../lib/resolveai-engine.js";
import {
  AnalyzeComplaintBody,
  EscalateComplaintBody,
  GetCustomerParams,
} from "@workspace/api-zod";
import { localizeResolution } from "../lib/localize-resolution.js";
import {
  nativeResolutionTemplate,
  nativeEscalationMessage,
} from "../lib/resolution-templates-i18n.js";
import { imageAnalysisService } from "../lib/image-analysis.js";
import { enhancedDecisionEngine } from "../lib/decision-engine.js";

const router: IRouter = Router();

/**
 * POST /analyze
 * Analyzes a customer complaint using AI models.
 */
router.post("/analyze", async (req, res): Promise<void> => {
  const parsed = AnalyzeComplaintBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { complaint, customerId } = parsed.data;
  const companyId =
    typeof req.body?.companyId === "string" ? req.body.companyId : undefined;
  const language =
    typeof req.body?.language === "string" ? req.body.language : undefined;
  const imageBase64 =
    typeof req.body?.imageBase64 === "string" ? req.body.imageBase64 : undefined;
  const platform =
    typeof req.body?.platform === "string" ? req.body.platform : undefined;
  const orderId =
    typeof req.body?.orderId === "string" ? req.body.orderId : undefined;

  const result = analyzeComplaint(complaint, customerId);

  // Multimodal: run image analysis (if image provided) and enhanced decision engine.
  const imageAnalysis = imageAnalysisService(imageBase64, complaint);
  const decision = enhancedDecisionEngine(result, imageAnalysis);

  // If decision engine wants to escalate (e.g. fraud), force shouldEscalate so
  // downstream storage assigns an agent.
  if (decision.decision === "escalate") {
    result.shouldEscalate = true;
    if (!result.escalationSummary) {
      result.escalationSummary = decision.explanation;
    }
  }
  // If decision engine auto-refunds, surface that in the resolution text.
  if (decision.decision === "auto_refund") {
    result.resolution = decision.explanation;
    result.shouldEscalate = false;
  }

  // Localize the generated resolution server-side at write time so the stored
  // text is already in the customer's UI language. Two layers:
  //   1. Prefer hand-written native templates per (complaintType, language)
  //      — fully fluent, not stitched word-swaps.
  //   2. Fall back to phrase-substitution for anything not covered.
  if (language && language !== "en") {
    const customer = customers.find((c) => c.customerId === parsed.data.customerId);
    const isPremium = customer?.tier === "Premium";
    const native = nativeResolutionTemplate(
      result.complaintType,
      language,
      isPremium
    );
    result.resolution = native ?? localizeResolution(result.resolution, language);

    const highFrustration =
      typeof result.frustrationScore === "number" && result.frustrationScore >= 70;
    const nativeEsc = nativeEscalationMessage(language, highFrustration);
    if (result.escalationSummary) {
      result.escalationSummary =
        nativeEsc ?? localizeResolution(result.escalationSummary, language);
    }
    if (result.escalation) {
      result.escalation = {
        ...result.escalation,
        summary:
          nativeEsc ?? localizeResolution(result.escalation.summary, language),
      };
    }
  }

  const stored = storeComplaint(result, companyId);

  // Persist multimodal fields on the stored record.
  stored.imageUrl = imageBase64
    ? imageBase64.startsWith("data:")
      ? imageBase64
      : `data:image/jpeg;base64,${imageBase64}`
    : null;
  stored.platform = (platform as typeof stored.platform) ?? null;
  stored.orderId = orderId ?? null;
  stored.imageAnalysis = imageAnalysis;
  stored.fraudRisk = decision.fraudRisk;
  stored.decision = decision.decision;
  stored.decisionExplanation =
    language && language !== "en"
      ? localizeResolution(decision.explanation, language)
      : decision.explanation;

  req.log.info(
    {
      ticketId: stored.ticketId,
      complaintType: stored.complaintType,
      companyId: stored.companyId,
      language: language ?? "en",
    },
    "Complaint analyzed and stored"
  );

  res.json(stored);
});

/**
 * GET /complaints?companyId=&customerId=
 * Returns complaints, optionally filtered by company / customer.
 */
router.get("/complaints", async (req, res): Promise<void> => {
  const companyId =
    typeof req.query.companyId === "string" ? req.query.companyId : undefined;
  const customerId =
    typeof req.query.customerId === "string" ? req.query.customerId : undefined;

  const complaints = getAllComplaints({ companyId, customerId });
  res.json(complaints);
});

/**
 * PATCH /complaints/:ticketId
 * Update status, assigned agent, or override resolution.
 */
router.patch("/complaints/:ticketId", async (req, res): Promise<void> => {
  const ticketId = String(req.params.ticketId);
  const { status, assignedAgentId, resolutionOverride } = req.body ?? {};

  const validStatuses: TicketStatus[] = [
    "resolved",
    "pending",
    "escalated",
    "in_progress",
  ];
  if (status !== undefined && !validStatuses.includes(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }

  const updated = updateComplaint(ticketId, {
    status,
    assignedAgentId,
    resolutionOverride,
  });

  if (!updated) {
    res.status(404).json({ error: "Complaint not found" });
    return;
  }

  req.log.info({ ticketId, status, assignedAgentId }, "Complaint updated");
  res.json(updated);
});

/**
 * GET /companies
 */
router.get("/companies", async (_req, res): Promise<void> => {
  res.json(listCompanies());
});

/**
 * GET /companies/:companyId
 */
router.get("/companies/:companyId", async (req, res): Promise<void> => {
  const company = findCompany(String(req.params.companyId));
  if (!company) {
    res.status(404).json({ error: "Company not found" });
    return;
  }
  res.json(company);
});

/**
 * GET /companies/:companyId/agents
 */
router.get("/companies/:companyId/agents", async (req, res): Promise<void> => {
  const agents = listAgents(String(req.params.companyId));
  res.json(agents);
});

/**
 * GET /customers
 */
router.get("/customers", async (_req, res): Promise<void> => {
  const summaries = customers.map((c) => {
    const openTickets = c.history.filter(
      (h) => h.status === "pending" || h.status === "escalated"
    ).length;

    return {
      customerId: c.customer_id,
      name: c.name,
      email: c.email,
      tier: c.tier,
      joinDate: c.join_date,
      totalTickets: c.history.length,
      openTickets,
    };
  });

  res.json(summaries);
});

/**
 * GET /customer/:customerId
 */
router.get("/customer/:customerId", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.customerId)
    ? req.params.customerId[0]
    : req.params.customerId;

  const params = GetCustomerParams.safeParse({ customerId: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const customer = customers.find((c) => c.customer_id === params.data.customerId);

  if (!customer) {
    req.log.warn(
      { customerId: params.data.customerId },
      "Customer not found, returning generic template"
    );
    res.json({
      customerId: params.data.customerId,
      name: "Guest Customer",
      email: "guest@example.com",
      phone: "N/A",
      tier: "Basic",
      joinDate: new Date().toISOString().split("T")[0],
      history: [],
    });
    return;
  }

  const response = {
    customerId: customer.customer_id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    tier: customer.tier,
    joinDate: customer.join_date,
    history: customer.history.map((h) => ({
      ticketId: h.ticket_id,
      channel: h.channel as "chat" | "email" | "phone",
      date: h.date,
      issue: h.issue,
      complaintType: h.complaint_type,
      status: h.status as "resolved" | "pending" | "escalated",
      resolution: h.resolution,
      agentName: h.agent_name,
    })),
  };

  res.json(response);
});

/**
 * POST /escalate
 */
router.post("/escalate", async (req, res): Promise<void> => {
  const parsed = EscalateComplaintBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { ticketId, customerId, reason } = parsed.data;

  const existingComplaint = findComplaintByTicketId(ticketId);
  const customer = customers.find((c) => c.customer_id === customerId) || null;
  const company = existingComplaint
    ? findCompany(existingComplaint.companyId)
    : undefined;

  // Pick agent from this company if available
  const agentPool =
    company && company.agents.length > 0
      ? company.agents
      : [
          { id: "g1", name: "Sarah Thompson", specialty: "General" },
          { id: "g2", name: "Michael Rodriguez", specialty: "General" },
          { id: "g3", name: "Emily Chang", specialty: "General" },
        ];
  const agent = agentPool[Math.floor(Math.random() * agentPool.length)];

  let summary: string;
  if (existingComplaint) {
    summary = generateEscalationSummary(
      customer,
      existingComplaint.complaint,
      existingComplaint.complaintType,
      [reason]
    );
    updateComplaint(ticketId, {
      status: "escalated",
      assignedAgentId: agent.id,
    });
  } else {
    const { complaintType } = classifyComplaint(reason);
    summary = generateEscalationSummary(customer, reason, complaintType, [reason]);
  }

  const slaHours = existingComplaint?.slaHours ?? company?.slaHours ?? 24;
  const etaDate = new Date(Date.now() + slaHours * 60 * 60 * 1000);
  const eta = etaDate.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  req.log.info(
    { ticketId, customerId, assignedAgent: agent.name },
    "Complaint escalated manually"
  );

  res.json({
    escalated: true,
    assignedAgent: agent.name,
    summary,
    eta,
    ticketId,
  });
});

/**
 * GET /dashboard/stats?companyId=
 */
router.get("/dashboard/stats", async (req, res): Promise<void> => {
  const companyId =
    typeof req.query.companyId === "string" ? req.query.companyId : undefined;
  const stats = computeDashboardStats(companyId);
  res.json(stats);
});

export default router;
