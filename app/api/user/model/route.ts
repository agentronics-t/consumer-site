import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db, type ModelId } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID: ModelId[] = ["claude", "gpt", "gemini"];

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const model = body.model as ModelId | undefined;
  if (!model || !VALID.includes(model)) {
    return NextResponse.json({ error: "invalid_model" }, { status: 400 });
  }

  const user = await db.users.update(userId, { preferredModel: model });
  if (!user) return NextResponse.json({ error: "no_user" }, { status: 404 });

  return NextResponse.json({ preferredModel: user.preferredModel });
}
