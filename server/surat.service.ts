'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Surat, UUID } from '@/types';
import type { SuratInput } from '@/lib/validations';

function serverSupabase() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: async (n) => (await cookieStore).get(n)?.value } }
  );
}

export async function listSurat(params: { page?: number; limit?: number; q?: string }) {
  const supabase = serverSupabase();
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from('surat').select('*', { count: 'exact' }).order('tanggal_dibuat', { ascending: false }).range(from, to);

  if (params.q && params.q.trim()) {
    // simple ILIKE across some columns
    const q = `%${params.q}%`;
    query = query.or(`no_surat.ilike.${q},perihal.ilike.${q},tujuan.ilike.${q}`);
  }

  const { data, error, count } = await query as unknown as { data: Surat[]; error: any; count: number | null };
  if (error) throw error;

  return { data, count: count ?? 0, page, limit };
}

export async function getSurat(id: number) {
  const supabase = serverSupabase();
  const { data, error } = await supabase.from('surat').select('*').eq('id', id).single<Surat>();
  if (error) throw error;
  return data;
}

export async function createSurat(input: SuratInput, userId: UUID) {
  const supabase = serverSupabase();
  const payload = { ...input, created_by: userId };
  const { data, error } = await supabase.from('surat').insert(payload).select('*').single<Surat>();
  if (error) throw error;
  return data;
}

export async function updateSurat(id: number, input: Partial<SuratInput>) {
  const supabase = serverSupabase();
  const { data, error } = await supabase.from('surat').update({ ...input, updated_at: new Date().toISOString() }).eq('id', id).select('*').single<Surat>();
  if (error) throw error;
  return data;
}

export async function deleteSurat(id: number) {
  const supabase = serverSupabase();
  const { error } = await supabase.from('surat').delete().eq('id', id);
  if (error) throw error;
  return { success: true };
}
