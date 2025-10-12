import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-route";

export async function GET(req: NextRequest) {
  const year = Number(req.nextUrl.searchParams.get("year"));
  const month = Number(req.nextUrl.searchParams.get("month"));
  if (!year || !month || month < 1 || month > 12) {
    return NextResponse.json({ error: "Param year & month wajib (1-12)" }, { status: 400 });
  }

  const start = new Date(year, month - 1, 1);
  const next  = new Date(year, month, 1);
  const startStr = start.toISOString().slice(0, 10);
  const nextStr  = next.toISOString().slice(0, 10);

  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("surat")
    .select("id,no_urutan,no_surat,perihal,tujuan,tanggal_dibuat,file_url")
    .gte("tanggal_dibuat", startStr)
    .lt("tanggal_dibuat", nextStr)
    .order("tanggal_dibuat", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ year, month, count: data?.length ?? 0, rows: data ?? [] });
}
