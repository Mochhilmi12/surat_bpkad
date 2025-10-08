import { redirect } from "next/navigation";
import { createSupabaseRSC } from "./supabase-server";

const ADMIN_EMAIL = "admin@bpkad.go.id";

export async function requireUser() {
  const supabase = await createSupabaseRSC();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) redirect("/sign-in");
  return { user, supabase }
}