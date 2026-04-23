/**
 * imageAnalysisService
 *
 * Multimodal vision stub. In production this would call OpenAI Vision (or a
 * similar model) on the supplied image. For the demo we return a deterministic
 * structured result derived from the complaint text + image hash so the same
 * image+text yields the same answer every time.
 */

export type DamageType = "broken" | "scratched" | "wrong_item" | "stained" | "none";
export type FraudRisk = "low" | "medium" | "high";

export interface ImageAnalysisResult {
  damageDetected: boolean;
  damageType: DamageType;
  confidence: number;
  fraudRisk: FraudRisk;
  notes: string;
}

const DAMAGE_KEYWORDS: Array<{ kw: RegExp; type: DamageType; conf: number }> = [
  { kw: /\b(broke[n]?|crack|shatter|smash)/i, type: "broken", conf: 88 },
  { kw: /\b(scratch|scuff|dent)/i, type: "scratched", conf: 82 },
  { kw: /\b(wrong\s+item|different|not\s+what|incorrect\s+product)/i, type: "wrong_item", conf: 90 },
  { kw: /\b(stain|spill|leak|wet|dirty)/i, type: "stained", conf: 78 },
  { kw: /\b(damaged|defect|spoil|expired)/i, type: "broken", conf: 80 },
];

const FRAUD_KEYWORDS = /\b(refund|chargeback|free|gift|compensat|replace)/i;

function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function imageAnalysisService(
  imageBase64: string | undefined,
  complaintText: string
): ImageAnalysisResult | null {
  if (!imageBase64 || imageBase64.length < 32) return null;

  const text = complaintText ?? "";
  let detected: { type: DamageType; conf: number } = { type: "none", conf: 0 };

  for (const k of DAMAGE_KEYWORDS) {
    if (k.kw.test(text)) {
      detected = { type: k.type, conf: k.conf };
      break;
    }
  }

  // If text gave no damage signal, infer from image hash so we still produce a
  // realistic-looking visual analysis (demo only).
  if (detected.type === "none") {
    const h = hashString(imageBase64.slice(0, 256));
    const types: DamageType[] = ["broken", "scratched", "stained", "wrong_item", "none"];
    detected = {
      type: types[h % types.length],
      conf: 60 + (h % 30), // 60-89
    };
  }

  const damageDetected = detected.type !== "none";
  const confidence = damageDetected ? detected.conf : 100 - detected.conf;

  // Fraud heuristic: short text + high refund language + low confidence damage = suspicious
  let fraudRisk: FraudRisk = "low";
  const textLen = text.trim().length;
  const refundPush = FRAUD_KEYWORDS.test(text);
  if (textLen < 20 && refundPush) fraudRisk = "high";
  else if (refundPush && confidence < 70) fraudRisk = "medium";
  else if (!damageDetected && refundPush) fraudRisk = "medium";

  const notes = damageDetected
    ? `Visual inspection indicates ${detected.type.replace("_", " ")} (${confidence}% confidence).`
    : `No clear damage detected in image (${confidence}% confidence in undamaged state).`;

  return { damageDetected, damageType: detected.type, confidence, fraudRisk, notes };
}
