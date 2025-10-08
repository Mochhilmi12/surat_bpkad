import { createSupabaseRSC } from "./supabase-server";
import type { Surat, SuratListItem } from "@/types";
import type { SuratCreateInput, SuratUpdateInput } from "@/schemas/surat.schema";

export async function listSurat(q?: string) {
  const supabase = await createSupabaseRSC(); // ⬅️ WAJIB await
  let query = supabase
    .from("surat")
    .select("id,no_urutan,no_surat,perihal,tujuan,tanggal_dibuat,file_url")
    .order("no_urutan", { ascending: true });

  if (q && q.trim()) {
    query = query.or(`no_surat.ilike.%${q}%,perihal.ilike.%${q}%,tujuan.ilike.%${q}%`);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as SuratListItem[];
}

export async function createSurat(input: SuratCreateInput, userId: string) {
  const supabase = await createSupabaseRSC(); // ⬅️ WAJIB await

  // pastikan fungsi next_no_urutan sudah dibuat di DB (lihat SQL di pesan sebelumnya)
  const { data: nextNo, error: rpcErr } = await supabase.rpc("next_no_urutan");
  if (rpcErr) throw rpcErr;

  const payload = { ...input, no_urutan: Number(nextNo), created_by: userId };
  const { data, error } = await supabase.from("surat").insert(payload).select("*").single();
  if (error) throw error;
  return data as Surat;
}

export async function updateSurat(id: string, patch: SuratUpdateInput) {
  const supabase = await createSupabaseRSC(); // ⬅️ WAJIB await
  const { data, error } = await supabase.from("surat").update(patch).eq("id", id).select("*").single();
  if (error) throw error;
  return data as Surat;
}

export async function deleteSurat(id: string) {
  const supabase = await createSupabaseRSC(); // ⬅️ WAJIB await
  const { error } = await supabase.from("surat").delete().eq("id", id);
  if (error) throw error;
}