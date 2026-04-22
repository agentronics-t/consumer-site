import type { ModelId } from "@/lib/db";

export const MIN_TOPUP_CENTS = 1000; // $10
export const MAX_TOPUP_CENTS = 50_000; // $500

export const TOPUP_PRESETS_CENTS = [1000, 2500, 5000, 10_000] as const;

export function dollars(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export const MODELS: Array<{ id: ModelId; name: string; vendor: string; blurb: string }> = [
  { id: "claude", name: "Claude Sonnet", vendor: "Anthropic", blurb: "Careful, best for multi-step tasks." },
  { id: "gpt", name: "GPT-4", vendor: "OpenAI", blurb: "Fast and familiar, great on forms." },
  { id: "gemini", name: "Gemini", vendor: "Google", blurb: "Strong at search and comparison." },
];

export function rollingWindowStart(days = 30) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString();
}
