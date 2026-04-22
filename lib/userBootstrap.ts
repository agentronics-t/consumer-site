import { db } from "@/lib/db";
import { generateApiKey } from "@/lib/crypto";

export function bootstrapUser(params: {
  id: string;
  email: string;
}): { user: NonNullable<ReturnType<typeof db.users.get>>; apiKeyPlaintext: string | null } {
  const existing = db.users.get(params.id);
  if (existing) {
    return { user: existing, apiKeyPlaintext: null };
  }
  const { plaintext, hash } = generateApiKey();
  const user = db.users.upsert({
    id: params.id,
    email: params.email,
    stripeCustomerId: null,
    apiKeyHash: hash,
    creditsCents: 0,
    preferredModel: "claude",
    createdAt: new Date().toISOString(),
  });
  return { user, apiKeyPlaintext: plaintext };
}
