"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { supabaseBrowser } from "@/lib/supabase-client";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    // 1) sign out di client
    await supabaseBrowser.auth.signOut();

    // 2) sinkronkan cookie SSR via callback
    await fetch("/auth/callback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "SIGNED_OUT", session: null }),
    });

    // 3) kembali ke halaman login
    router.replace("/sign-in");
  };

  return (
    <Button variant="outline" onClick={handleSignOut}>
      Keluar
    </Button>
  );
}
