export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-route";
import { suratUpdateSchema } from "@/schemas/surat.schema";

type RouteContext = { params: { id: string } };

// PATCH /api/surat/:id
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "ID surat tidak ditemukan" }, { status: 400 });
  }

  const body = await req.json();
  const parsed = suratUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin()
    .from("surat")
    .update(parsed.data)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE /api/surat/:id
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "ID surat tidak ditemukan" }, { status: 400 });
  }

  const { error } = await supabaseAdmin().from("surat").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
