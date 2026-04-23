/**
 * ResolveAI Routes
 *
 * Implements all complaint resolution API endpoints:
 * - POST /analyze
 * - GET  /complaints
 * - GET  /customer/:customerId
 * - GET  /customers
 * - POST /escalate
 * - GET  /dashboard/stats
 */

import { Router, type IRouter } from "express";
import {
  analyzeComplaint,
  storeComplaint,
  getAllComplaints,
  findComplaintByTicketId,
  computeDashboardStats,
  customers,
  generateTicketId,
  generateEscalationSummary,
  evaluateEscalation,
  classifyComplaint,
  analyzeSentiment,
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
 * Returns classification, sentiment, resolution, and escalation data.
 */
router.post("/analyze", async (req, res): Promise<void> => {
  const parsed = AnalyzeComplaintBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { complaint, customerId } = parsed.data;

  const result = analyzeComplaint(complaint, customerId);
  storeComplaint(result);

  req.log.info(
    { ticketId: result.ticketId, complaintType: result.complaintType },
    "Complaint analyzed and stored"
  );

  res.json(result);
});

/**
 * GET /complaints
 * Returns all complaints processed in the current session.
 */
router.get("/complaints", async (_req, res): Promise<void> => {
  const complaints = getAllComplaints();
  res.json(complaints);
});

/**
 * GET /customers
 * Returns a summary list of all customers.
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
 * Returns full customer profile with interaction history.
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
    // Return generic template for unknown customers
    req.log.warn({ customerId: params.data.customerId }, "Customer not found, returning generic template");
    res.json({
      customerId: params.data.customerId,
      name: "Unknown Customer",
      email: "unknown@example.com",
      phone: "N/A",
      tier: "Basic",
      joinDate: new Date().toISOString().split("T")[0],
      history: [],
    });
    return;
  }

  // Map to API response shape
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
 * Manually escalates a complaint to a human agent.
 */
router.post("/escalate", async (req, res): Promise<void> => {
  const parsed = EscalateComplaintBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { ticketId, customerId, reason } = parsed.data;

  // Find existing complaint or create escalation context
  const existingComplaint = findComplaintByTicketId(ticketId);
  const customer = customers.find((c) => c.customer_id === customerId) || null;

  // Determine assigned agent
  const agents = [
    "Sarah Thompson",
    "Michael Rodriguez",
    "Emily Chang",
    "David Martinez",
    "Rachel Kim",
    "James Wilson",
  ];
  const assignedAgent = agents[Math.floor(Math.random() * agents.length)];

  // Generate summary
  let summary: string;
  if (existingComplaint) {
    const { complaintType } = existingComplaint;
    summary = generateEscalationSummary(
      customer,
      existingComplaint.complaint,
      complaintType,
      [reason]
    );
  } else {
    const { complaintType } = classifyComplaint(reason);
    summary = generateEscalationSummary(customer, reason, complaintType, [reason]);
  }

  // ETA based on complaint type SLA
  const slaHours = existingComplaint?.slaHours || 24;
  const etaDate = new Date(Date.now() + slaHours * 60 * 60 * 1000);
  const eta = etaDate.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  req.log.info(
    { ticketId, customerId, assignedAgent },
    "Complaint escalated manually"
  );

  res.json({
    escalated: true,
    assignedAgent,
    summary,
    eta,
    ticketId,
  });
});

/**
 * GET /dashboard/stats
 * Returns aggregated statistics for the dashboard.
 */
router.get("/dashboard/stats", async (_req, res): Promise<void> => {
  const stats = computeDashboardStats();
  res.json(stats);
});

export default router;
