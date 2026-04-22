import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sha256 } from "@/lib/crypto";
import { siteConfig } from "@/lib/siteConfig";
import {
  MODEL_MAP,
  OPENROUTER_BASE_URL,
  assertOpenRouterKey,
  costToDebitCents,
} from "@/lib/openrouter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/chat
 * Headers: Authorization: Bearer <deviceToken>
 * Body: OpenAI-compatible chat payload. `model` field (if any) is ignored —
 *       we always substitute the user's preferredModel from the DB.
 *
 * Proxies to OpenRouter, debits credits based on reported usage.cost, and
 * returns the upstream JSON verbatim.
 */
export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization") ?? "";
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return NextResponse.json({ error: "missing_bearer_token" }, { status: 401 });
  }
  const deviceToken = match[1].trim();
  const tokenHash = sha256(deviceToken);

  const device = await db.devices.findByTokenHash(tokenHash);
  if (!device) {
    return NextResponse.json({ error: "invalid_device_token" }, { status: 401 });
  }

  const user = await db.users.get(device.userId);
  if (!user) {
    return NextResponse.json({ error: "user_missing" }, { status: 404 });
  }
  if (user.creditsCents <= 0) {
    return NextResponse.json(
      { error: "out_of_credits", creditsCents: user.creditsCents },
      { status: 402 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Streaming isn't supported in this prototype: we need the final usage block
  // to debit credits, and proxying SSE while tailing usage is a follow-up.
  if (body.stream) {
    return NextResponse.json({ error: "streaming_not_supported_yet" }, { status: 400 });
  }

  const openrouterModel = MODEL_MAP[user.preferredModel];
  if (!openrouterModel) {
    return NextResponse.json({ error: "no_model_mapping" }, { status: 500 });
  }

  let apiKey: string;
  try {
    apiKey = assertOpenRouterKey();
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }

  // Force our model selection + ask OpenRouter to return the cost figure.
  const upstreamBody = {
    ...body,
    model: openrouterModel,
    stream: false,
    usage: { include: true },
  };

  let upstream: Response;
  try {
    upstream = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
        "http-referer": siteConfig.siteUrl,
        "x-title": siteConfig.name,
      },
      body: JSON.stringify(upstreamBody),
    });
  } catch (e) {
    return NextResponse.json(
      { error: "upstream_unreachable", detail: (e as Error).message },
      { status: 502 },
    );
  }

  const text = await upstream.text();
  if (!upstream.ok) {
    return NextResponse.json(
      { error: "upstream_error", status: upstream.status, body: text },
      { status: 502 },
    );
  }

  let data: {
    usage?: { cost?: number; total_tokens?: number; prompt_tokens?: number; completion_tokens?: number };
    [k: string]: unknown;
  };
  try {
    data = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { error: "upstream_non_json", body: text },
      { status: 502 },
    );
  }

  const debitCents = costToDebitCents(data.usage?.cost);
  const [updatedUser] = await Promise.all([
    db.users.debitCredits(user.id, debitCents),
    db.devices.touch(device.id),
    db.usage.insert(user.id, debitCents, {
      model: user.preferredModel,
      openrouter_model: openrouterModel,
      tokens: data.usage?.total_tokens ?? null,
      prompt_tokens: data.usage?.prompt_tokens ?? null,
      completion_tokens: data.usage?.completion_tokens ?? null,
      reported_cost_usd: data.usage?.cost ?? null,
    }),
  ]);

  return NextResponse.json({
    ...data,
    agentronics: {
      modelId: user.preferredModel,
      openrouterModel,
      debitedCents: debitCents,
      creditsCents: updatedUser?.creditsCents ?? user.creditsCents - debitCents,
    },
  });
}
