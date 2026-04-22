import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const sql = neon(process.env.DATABASE_URL);

export type ModelId = "claude" | "gpt" | "gemini";

export type UserRow = {
  id: string;
  email: string;
  stripeCustomerId: string | null;
  apiKeyHash: string;
  creditsCents: number;
  preferredModel: ModelId;
  createdAt: string;
};

export type DeviceRow = {
  id: string;
  userId: string;
  deviceTokenHash: string;
  label: string;
  lastSeenAt: string;
  createdAt: string;
};

export type PairingCodeRow = {
  code: string;
  userId: string;
  expiresAt: string;
  consumedAt: string | null;
};

export type UsageEventRow = {
  id: number;
  userId: string;
  eventType: "tool_call" | "task_run";
  costCents: number;
  createdAt: string;
  metadata: Record<string, unknown>;
};

export type TopUpRow = {
  id: number;
  userId: string;
  amountCents: number;
  stripeSessionId: string;
  createdAt: string;
};

const USER_SELECT = `
  id,
  email,
  stripe_customer_id AS "stripeCustomerId",
  api_key_hash AS "apiKeyHash",
  credits_cents AS "creditsCents",
  preferred_model AS "preferredModel",
  created_at AS "createdAt"
`;

const DEVICE_SELECT = `
  id,
  user_id AS "userId",
  device_token_hash AS "deviceTokenHash",
  label,
  last_seen_at AS "lastSeenAt",
  created_at AS "createdAt"
`;

const PAIRING_SELECT = `
  code,
  user_id AS "userId",
  expires_at AS "expiresAt",
  consumed_at AS "consumedAt"
`;

const USAGE_SELECT = `
  id,
  user_id AS "userId",
  event_type AS "eventType",
  cost_cents AS "costCents",
  created_at AS "createdAt",
  metadata
`;

const TOPUP_SELECT = `
  id,
  user_id AS "userId",
  amount_cents AS "amountCents",
  stripe_session_id AS "stripeSessionId",
  created_at AS "createdAt"
`;

export const db = {
  users: {
    async get(id: string): Promise<UserRow | null> {
      const rows = (await sql`SELECT ${sql.unsafe(USER_SELECT)} FROM users WHERE id = ${id}`) as UserRow[];
      return rows[0] ?? null;
    },
    async upsert(row: UserRow): Promise<UserRow> {
      await sql`
        INSERT INTO users (id, email, stripe_customer_id, api_key_hash, credits_cents, preferred_model, created_at)
        VALUES (${row.id}, ${row.email}, ${row.stripeCustomerId}, ${row.apiKeyHash}, ${row.creditsCents}, ${row.preferredModel}, ${row.createdAt})
        ON CONFLICT (id) DO UPDATE SET
          email = COALESCE(NULLIF(EXCLUDED.email, ''), users.email),
          stripe_customer_id = COALESCE(EXCLUDED.stripe_customer_id, users.stripe_customer_id)
      `;
      const u = await db.users.get(row.id);
      if (!u) throw new Error("upsert failed");
      return u;
    },
    async update(id: string, patch: Partial<UserRow>): Promise<UserRow | null> {
      // Apply allowed columns individually — Neon http driver doesn't do
      // dynamic multi-column updates ergonomically, and the patch surface is small.
      if (patch.email !== undefined) {
        await sql`UPDATE users SET email = ${patch.email} WHERE id = ${id}`;
      }
      if (patch.stripeCustomerId !== undefined) {
        await sql`UPDATE users SET stripe_customer_id = ${patch.stripeCustomerId} WHERE id = ${id}`;
      }
      if (patch.apiKeyHash !== undefined) {
        await sql`UPDATE users SET api_key_hash = ${patch.apiKeyHash} WHERE id = ${id}`;
      }
      if (patch.creditsCents !== undefined) {
        await sql`UPDATE users SET credits_cents = ${patch.creditsCents} WHERE id = ${id}`;
      }
      if (patch.preferredModel !== undefined) {
        await sql`UPDATE users SET preferred_model = ${patch.preferredModel} WHERE id = ${id}`;
      }
      return db.users.get(id);
    },
    async addCredits(id: string, cents: number): Promise<UserRow | null> {
      const rows = (await sql`
        UPDATE users SET credits_cents = credits_cents + ${cents}
        WHERE id = ${id}
        RETURNING ${sql.unsafe(USER_SELECT)}
      `) as UserRow[];
      return rows[0] ?? null;
    },
    async byStripeCustomer(customerId: string): Promise<UserRow | null> {
      const rows = (await sql`
        SELECT ${sql.unsafe(USER_SELECT)} FROM users WHERE stripe_customer_id = ${customerId} LIMIT 1
      `) as UserRow[];
      return rows[0] ?? null;
    },
  },
  devices: {
    async list(userId: string): Promise<DeviceRow[]> {
      return (await sql`
        SELECT ${sql.unsafe(DEVICE_SELECT)} FROM devices WHERE user_id = ${userId} ORDER BY created_at DESC
      `) as DeviceRow[];
    },
    async insert(row: DeviceRow): Promise<DeviceRow> {
      await sql`
        INSERT INTO devices (id, user_id, device_token_hash, label, last_seen_at, created_at)
        VALUES (${row.id}, ${row.userId}, ${row.deviceTokenHash}, ${row.label}, ${row.lastSeenAt}, ${row.createdAt})
      `;
      return row;
    },
    async delete(id: string): Promise<boolean> {
      const rows = (await sql`DELETE FROM devices WHERE id = ${id} RETURNING id`) as Array<{ id: string }>;
      return rows.length > 0;
    },
  },
  pairingCodes: {
    async get(code: string): Promise<PairingCodeRow | null> {
      const rows = (await sql`
        SELECT ${sql.unsafe(PAIRING_SELECT)} FROM pairing_codes WHERE code = ${code}
      `) as PairingCodeRow[];
      return rows[0] ?? null;
    },
    async insert(row: PairingCodeRow): Promise<PairingCodeRow> {
      await sql`
        INSERT INTO pairing_codes (code, user_id, expires_at, consumed_at)
        VALUES (${row.code}, ${row.userId}, ${row.expiresAt}, ${row.consumedAt})
      `;
      return row;
    },
    async consume(code: string): Promise<PairingCodeRow | null> {
      const rows = (await sql`
        UPDATE pairing_codes SET consumed_at = now()
        WHERE code = ${code}
        RETURNING ${sql.unsafe(PAIRING_SELECT)}
      `) as PairingCodeRow[];
      return rows[0] ?? null;
    },
    async deleteForUser(userId: string): Promise<void> {
      await sql`DELETE FROM pairing_codes WHERE user_id = ${userId}`;
    },
  },
  usage: {
    async count(userId: string, sinceISO: string): Promise<number> {
      const rows = (await sql`
        SELECT COUNT(*)::int AS n FROM usage_events
        WHERE user_id = ${userId} AND created_at >= ${sinceISO}
      `) as Array<{ n: number }>;
      return rows[0]?.n ?? 0;
    },
    async recentSpendCents(userId: string, sinceISO: string): Promise<number> {
      const rows = (await sql`
        SELECT COALESCE(SUM(cost_cents), 0)::int AS total FROM usage_events
        WHERE user_id = ${userId} AND created_at >= ${sinceISO}
      `) as Array<{ total: number }>;
      return rows[0]?.total ?? 0;
    },
    async insert(
      userId: string,
      costCents: number,
      metadata: Record<string, unknown> = {},
    ): Promise<UsageEventRow> {
      const rows = (await sql`
        INSERT INTO usage_events (user_id, event_type, cost_cents, metadata)
        VALUES (${userId}, 'task_run', ${costCents}, ${JSON.stringify(metadata)}::jsonb)
        RETURNING ${sql.unsafe(USAGE_SELECT)}
      `) as UsageEventRow[];
      return rows[0]!;
    },
  },
  topUps: {
    async list(userId: string): Promise<TopUpRow[]> {
      return (await sql`
        SELECT ${sql.unsafe(TOPUP_SELECT)} FROM top_ups WHERE user_id = ${userId} ORDER BY id DESC
      `) as TopUpRow[];
    },
    async insert(userId: string, amountCents: number, stripeSessionId: string): Promise<TopUpRow | null> {
      const rows = (await sql`
        INSERT INTO top_ups (user_id, amount_cents, stripe_session_id)
        VALUES (${userId}, ${amountCents}, ${stripeSessionId})
        ON CONFLICT (stripe_session_id) DO NOTHING
        RETURNING ${sql.unsafe(TOPUP_SELECT)}
      `) as TopUpRow[];
      return rows[0] ?? null;
    },
    async hasProcessed(sessionId: string): Promise<boolean> {
      const rows = (await sql`
        SELECT 1 AS ok FROM processed_stripe_sessions WHERE session_id = ${sessionId} LIMIT 1
      `) as Array<{ ok: number }>;
      return rows.length > 0;
    },
    async markProcessed(sessionId: string): Promise<void> {
      await sql`
        INSERT INTO processed_stripe_sessions (session_id)
        VALUES (${sessionId})
        ON CONFLICT (session_id) DO NOTHING
      `;
    },
  },
};
