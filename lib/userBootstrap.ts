import { db, type UserRow } from "@/lib/db";
import { generateApiKey } from "@/lib/crypto";

export async function bootstrapUser(params: {
  id: string;
  email: string;
}): Promise<{ user: UserRow; apiKeyPlaintext: string | null }> {
  const existing = await db.users.get(params.id);
  if (existing) {
    // Keep email fresh if Clerk has one and we never stored it.
    if (params.email && !existing.email) {
      const updated = await db.users.update(params.id, { email: params.email });
      return { user: updated ?? existing, apiKeyPlaintext: null };
    }
    return { user: existing, apiKeyPlaintext: null };
  }
  const { plaintext, hash } = generateApiKey();
  const user = await db.users.upsert({
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
