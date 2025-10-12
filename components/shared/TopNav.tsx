import { createSupabaseRSC } from "@/lib/supabase-server";
import SignOutButton from "./SignOutButton";
import Image from "next/image";

export default async function Topnav() {
  const supabase = await createSupabaseRSC();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="wrapper flex  gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/logo-bpkad.png"
            alt="logo bpkad"
            width={100}
            height={100}
            className="h-12 w-auto sm:h-14"
            priority
          />
        </div>
        <div className="flex w-full flex-wrap items-center gap-3 text-xs text-muted-foreground sm:w-auto sm:justify-end sm:text-sm">
          <span className="truncate max-w-full sm:max-w-xs">{user?.email}</span>
          <div className="flex-shrink-0">
            <SignOutButton />
          </div>
        </div>
      </div>
    </header>
  );
}
