// src/app/(protected)/layout.tsx
import Topnav from "@/components/shared/TopNav";
import { requireUser } from "@/lib/auth";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireUser(); 
  return (
    <>
      <Topnav />
      <div className="w-full ">{children}</div>
    </>
  );
}
