// src/lib/supabase-server.ts
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Untuk Server Components (RSC) / loader di app dir.
 * HANYA read cookies → set/remove NO-OP agar tidak error.
 */
export async function createSupabaseRSC() {
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      // ⬇️ no-ops (wajib di RSC)
      set(_name: string, _value: string, _options: CookieOptions) {},
      remove(_name: string, _options: CookieOptions) {},
    },
  });
}

/**
 * Untuk Route Handlers (/app/api/*) & Server Actions & /auth/callback.
 * BOLEH ubah cookies.
 */
export async function createSupabaseRoute() {
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, _options: CookieOptions) {
        // gunakan delete saat ingin menghapus cookie di Next 15
        cookieStore.delete(name);
      },
    },
  });
}
