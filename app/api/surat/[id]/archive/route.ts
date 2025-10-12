import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-route";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { error } = await supabaseAdmin()
    .from("surat")
    .update({ is_archived: true })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}