import type { ModelId } from "@/lib/db";

export const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

// Slugs taken from openrouter.ai/models. Bump these when you want a different model.
export const MODEL_MAP: Record<ModelId, string> = {
  claude: "anthropic/claude-sonnet-4.5",
  gpt: "openai/gpt-4o",
  gemini: "google/gemini-pro-1.5",
};

// 1.5× markup on OpenRouter's reported cost, rounded up to whole cents.
// Fallback when cost is missing: flat 2¢ so we never give tokens away.
export const PRICING = {
  markupMultiplier: 1.5,
  fallbackCents: 2,
  minCents: 1,
};

export function costToDebitCents(reportedUsdCost: number | null | undefined): number {
  if (!reportedUsdCost || reportedUsdCost <= 0) return PRICING.fallbackCents;
  const markedUp = reportedUsdCost * PRICING.markupMultiplier;
  return Math.max(PRICING.minCents, Math.ceil(markedUp * 100));
}

export function assertOpenRouterKey(): string {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY is not set");
  return key;
}
