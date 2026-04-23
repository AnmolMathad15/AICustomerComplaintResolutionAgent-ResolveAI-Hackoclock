import type { TranslationKey } from "./i18n";

type T = (key: TranslationKey) => string;

const TYPE_KEYS: Record<string, TranslationKey> = {
  billing: "types.billing",
  refund: "types.refund",
  technical: "types.technical",
  delivery: "types.delivery",
  account: "types.account",
  product_quality: "types.product_quality",
  other: "types.other",
};

const SEVERITY_KEYS: Record<string, TranslationKey> = {
  HIGH: "badges.high",
  MEDIUM: "badges.medium",
  LOW: "badges.low",
};

const SENTIMENT_KEYS: Record<string, TranslationKey> = {
  positive: "sentiment.positive",
  negative: "sentiment.negative",
  neutral: "sentiment.neutral",
};

export function localizeType(value: string, t: T): string {
  const key = TYPE_KEYS[value];
  if (key) return t(key);
  return value.replace(/_/g, " ");
}

export function localizeSeverity(value: string, t: T): string {
  const key = SEVERITY_KEYS[value];
  return key ? t(key) : value;
}

export function localizeSentiment(value: string, t: T): string {
  const key = SENTIMENT_KEYS[value];
  return key ? t(key) : value;
}
