import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-route";

export async function GET(req: NextRequest) {
  const year = Number(req.nextUrl.searchParams.get("year")) || new Date().getFullYear();

  const startStr = new Date(year, 0, 1).toISOString().slice(0, 10);
  const endStr   = new Date(year + 1, 0, 1).toISOString().slice(0, 10);

  const { data, error } = await supabaseAdmin()
    .from("surat")
    .select("id,tanggal_dibuat")
    .gte("tanggal_dibuat", startStr)
    .lt("tanggal_dibuat", endStr);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const months = Array.from({ length: 12 }, (_, i) => ({ m: i + 1, count: 0 }));
  for (const row of data ?? []) {
    const m = new Date(row.tanggal_dibuat).getMonth(); // 0..11
    months[m].count++;
  }

  const rows = months.map(({ m, count }) => ({
    key: m,
    label: new Date(2000, m - 1, 1).toLocaleString("id-ID", { month: "short" }),
    count,
  }));

  return NextResponse.json({ year, rows });
}
