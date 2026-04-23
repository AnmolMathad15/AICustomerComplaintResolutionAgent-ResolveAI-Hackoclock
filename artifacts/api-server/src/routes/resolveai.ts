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

  const result = analyzeComplaint(complaint, customerId);
  const stored = storeComplaint(result, companyId);

  req.log.info(
    {
      ticketId: stored.ticketId,
      complaintType: stored.complaintType,
      companyId: stored.companyId,
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
