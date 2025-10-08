export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-route";

// YYYY-MM-DD (lokal) – cocok untuk kolom DATE
const ymd = (d: Date) => d.toLocaleDateString("en-CA");

export async function GET() {
  try {
    const supabase = supabaseAdmin();

    // TOTAL
    {
      const { data, count, error } = await supabase
        .from("surat")
        .select("id", { count: "exact" }); // tanpa head:true
      if (error) throw error;
      var total = (count ?? data?.length ?? 0) as number;
    }

    // HARI INI
    const todayStr = ymd(new Date());
    {
      const { data, count, error } = await supabase
        .from("surat")
        .select("id", { count: "exact" })
        .eq("tanggal_dibuat", todayStr);
      if (error) throw error;
      var today = (count ?? data?.length ?? 0) as number;
    }

    // BULAN INI: [awal bulan, awal bulan berikutnya)
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    {
      const { data, count, error } = await supabase
        .from("surat")
        .select("id", { count: "exact" })
        .gte("tanggal_dibuat", ymd(start))
        .lt("tanggal_dibuat", ymd(next));
      if (error) throw error;
      var thisMonth = (count ?? data?.length ?? 0) as number;
    }

    // SURAT TERAKHIR (by created_at kalau ada; fallback tanggal_dibuat)
    const { data: lastRow, error: lastErr } = await supabase
      .from("surat")
      .select("no_surat, perihal, tanggal_dibuat, created_at")
      .order("created_at", { ascending: false })
      .order("tanggal_dibuat", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (lastErr) throw lastErr;

    return NextResponse.json({
      total,
      today,
      thisMonth,
      last: lastRow
        ? {
            no_surat: lastRow.no_surat,
            perihal: lastRow.perihal,
            tanggal_dibuat: lastRow.tanggal_dibuat,
          }
        : null,
    });
  } catch (err: any) {
    console.error("[/api/surat/stats] ", err);
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
