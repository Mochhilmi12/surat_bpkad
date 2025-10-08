import { NextResponse } from "next/server";
import { createSupabaseRoute } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const supabase = await createSupabaseRoute();

  const { event, session } = await request.json();

  if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
    await supabase.auth.setSession({
      access_token: session?.access_token ?? "",
      refresh_token: session?.refresh_token ?? "",
    });
  }

  if (event === "SIGNED_OUT") {
    await supabase.auth.signOut();
  }

  return NextResponse.json({ ok: true });
}
