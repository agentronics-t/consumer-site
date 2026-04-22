/**
 * MVP in-memory store. Swap for Postgres (Supabase/Neon) before going live.
 */

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

type Store = {
  users: Map<string, UserRow>;
  devices: Map<string, DeviceRow>;
  pairingCodes: Map<string, PairingCodeRow>;
  usage: UsageEventRow[];
  topUps: TopUpRow[];
  usageSeq: number;
  topUpSeq: number;
  processedSessions: Set<string>;
};

declare global {
  // eslint-disable-next-line no-var
  var __agentronicsStore: Store | undefined;
}

const store: Store =
  globalThis.__agentronicsStore ??
  (globalThis.__agentronicsStore = {
    users: new Map(),
    devices: new Map(),
    pairingCodes: new Map(),
    usage: [],
    topUps: [],
    usageSeq: 1,
    topUpSeq: 1,
    processedSessions: new Set(),
  });

export const db = {
  users: {
    get: (id: string) => store.users.get(id) ?? null,
    upsert: (row: UserRow) => {
      store.users.set(row.id, row);
      return row;
    },
    update: (id: string, patch: Partial<UserRow>) => {
      const cur = store.users.get(id);
      if (!cur) return null;
      const next = { ...cur, ...patch };
      store.users.set(id, next);
      return next;
    },
    addCredits: (id: string, cents: number) => {
      const cur = store.users.get(id);
      if (!cur) return null;
      const next = { ...cur, creditsCents: cur.creditsCents + cents };
      store.users.set(id, next);
      return next;
    },
    byStripeCustomer: (customerId: string) => {
      for (const u of store.users.values()) {
        if (u.stripeCustomerId === customerId) return u;
      }
      return null;
    },
  },
  devices: {
    list: (userId: string) =>
      [...store.devices.values()].filter((d) => d.userId === userId),
    insert: (row: DeviceRow) => {
      store.devices.set(row.id, row);
      return row;
    },
    delete: (id: string) => store.devices.delete(id),
  },
  pairingCodes: {
    get: (code: string) => store.pairingCodes.get(code) ?? null,
    insert: (row: PairingCodeRow) => {
      store.pairingCodes.set(row.code, row);
      return row;
    },
    consume: (code: string) => {
      const row = store.pairingCodes.get(code);
      if (!row) return null;
      const next = { ...row, consumedAt: new Date().toISOString() };
      store.pairingCodes.set(code, next);
      return next;
    },
    deleteForUser: (userId: string) => {
      for (const [code, row] of store.pairingCodes.entries()) {
        if (row.userId === userId) store.pairingCodes.delete(code);
      }
    },
  },
  usage: {
    count: (userId: string, sinceISO: string) =>
      store.usage.filter((e) => e.userId === userId && e.createdAt >= sinceISO).length,
    recentSpendCents: (userId: string, sinceISO: string) =>
      store.usage
        .filter((e) => e.userId === userId && e.createdAt >= sinceISO)
        .reduce((sum, e) => sum + e.costCents, 0),
    insert: (userId: string, costCents: number, metadata: Record<string, unknown> = {}) => {
      const row: UsageEventRow = {
        id: store.usageSeq++,
        userId,
        eventType: "task_run",
        costCents,
        createdAt: new Date().toISOString(),
        metadata,
      };
      store.usage.push(row);
      return row;
    },
  },
  topUps: {
    list: (userId: string) =>
      store.topUps.filter((t) => t.userId === userId).sort((a, b) => b.id - a.id),
    insert: (userId: string, amountCents: number, stripeSessionId: string) => {
      const row: TopUpRow = {
        id: store.topUpSeq++,
        userId,
        amountCents,
        stripeSessionId,
        createdAt: new Date().toISOString(),
      };
      store.topUps.push(row);
      return row;
    },
    hasProcessed: (sessionId: string) => store.processedSessions.has(sessionId),
    markProcessed: (sessionId: string) => store.processedSessions.add(sessionId),
  },
};
