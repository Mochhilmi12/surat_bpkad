import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL");
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
}

const url: string = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRole: string = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export function supabaseAdmin() {
  return createClient(url, serviceRole, { auth: { persistSession: false } });
}
