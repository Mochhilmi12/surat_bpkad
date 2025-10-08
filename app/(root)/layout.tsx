// src/app/(protected)/layout.tsx
import Topnav from "@/components/shared/TopNav";
import { requireUser } from "@/lib/auth";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireUser(); // guard sekali di sini (bukan di RootLayout)
  return (
    <>
      <Topnav />
      <main className="w-full ">{children}</main>
    </>
  );
}
