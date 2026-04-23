/**
 * enhancedDecisionEngine
 *
 * Combines text-side AnalysisResult with optional image analysis to produce
 * a final action label + plain-language explanation.
 */

import type { AnalysisResult } from "./resolveai-engine.js";
import type { ImageAnalysisResult, FraudRisk } from "./image-analysis.js";

export type Decision = "auto_refund" | "auto_resolve" | "escalate" | "request_more_info";

export interface EnhancedDecision {
  decision: Decision;
  fraudRisk: FraudRisk;
  explanation: string;
}

export function enhancedDecisionEngine(
  text: AnalysisResult,
  image: ImageAnalysisResult | null
): EnhancedDecision {
  // Image-based fraud always wins
  if (image && image.fraudRisk === "high") {
    return {
      decision: "escalate",
      fraudRisk: "high",
      explanation:
        "High fraud risk detected from image + text combination — routed to a human agent for verification.",
    };
  }

  // Strong damage signal → auto refund
  if (image && image.damageDetected && image.confidence > 80) {
    return {
      decision: "auto_refund",
      fraudRisk: image.fraudRisk,
      explanation: `Refund auto-approved: ${image.damageType.replace("_", " ")} verified visually (${image.confidence}% confidence).`,
    };
  }

  // Image analysis present but low confidence → ask for more info
  if (image && image.damageDetected && image.confidence <= 60) {
    return {
      decision: "request_more_info",
      fraudRisk: image.fraudRisk,
      explanation: `Possible ${image.damageType.replace("_", " ")} detected but confidence is low (${image.confidence}%). A clearer photo will speed up resolution.`,
    };
  }

  // Text engine already escalated → keep escalation
  if (text.shouldEscalate) {
    return {
      decision: "escalate",
      fraudRisk: image?.fraudRisk ?? "low",
      explanation:
        text.escalationSummary ??
        "Routed to a human agent based on complaint severity, customer tier, or sentiment.",
    };
  }

  // Default: auto-resolve via text path
  return {
    decision: "auto_resolve",
    fraudRisk: image?.fraudRisk ?? "low",
    explanation: image
      ? `Image inspected; no critical damage found. ${text.resolution}`
      : text.resolution,
  };
}
