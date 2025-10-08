import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { listSurat, createSurat } from "@/lib/db-queries";
import { suratCreateSchema } from "@/schemas/surat.schema";

export async function GET(req: Request) {
  await requireUser();
  const q = new URL(req.url).searchParams.get("q") ?? undefined;
  const rows = await listSurat(q ?? undefined);
  return NextResponse.json({ rows });
}

export async function POST(req: Request) {
  const { user } = await requireUser();
  const body = await req.json();
  const parsed = suratCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const created = await createSurat(parsed.data, user.id);
  return NextResponse.json(created, { status: 201 });
}
