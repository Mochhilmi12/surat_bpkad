import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { updateSurat, deleteSurat } from "@/lib/db-queries";
import { suratUpdateSchema } from "@/schemas/surat.schema";

type Params = { params: { id: string } };

export async function PATCH(req: Request, { params }: Params) {
  await requireUser();
  const body = await req.json();
  const parsed = suratUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const updated = await updateSurat(params.id, parsed.data);
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Params) {
  await requireUser();
  await deleteSurat(params.id);
  return NextResponse.json({ success: true });
}
