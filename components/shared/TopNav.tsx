import { createSupabaseRSC } from "@/lib/supabase-server";
import SignOutButton from "./SignOutButton";
import Image from "next/image";

export default async function Topnav() {
  const supabase = await createSupabaseRSC();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="wrapper rounded-full   flex items-center justify-between ">
        <div className="font-semibold tracking-tight">
          <Image 
          src="/logo-bpkad.png"
          alt="logo bpkad"
          width={100}
          height={100}
          />
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {user?.email}
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}