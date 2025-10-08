"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Sinkronkan sesi client -> server cookies (logic asli dipertahankan)
  useEffect(() => {
    const { data: sub } = supabaseBrowser.auth.onAuthStateChange(async (event, session) => {
      if (event === "INITIAL_SESSION") return;
      if (event === "SIGNED_OUT" || event === "SIGNED_IN") {
        await fetch("/auth/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event, session: event === "SIGNED_OUT" ? null : session }),
        });
        if (event === "SIGNED_IN") {
          router.replace("/");
        }
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setIsSubmitting(true);
    const { error } = await supabaseBrowser.auth.signInWithPassword({ email, password });
    if (error) setErr(error.message);
    setIsSubmitting(false);
    // redirect tetap ditangani di onAuthStateChange
  }

  return (
    <div className="min-h-dvh grid place-items-center bg-gradient-to-b from-background to-muted/40 p-6">
      <Card className="w-full max-w-sm shadow-lg border-border/60">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl tracking-tight">Masuk Admin</CardTitle>
          <p className="text-sm text-muted-foreground">
            Gunakan email & password yang sudah terdaftar.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="pl-9"
                />
                <Mail className="absolute left-3 top-2.5  -translate-y-1/2 size-4 text-muted-foreground" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="pl-9 pr-10"
                />
                <Lock className="absolute left-3 top-2.5 -translate-y-1/2 size-4 text-muted-foreground" />
                <button
                  type="button"
                  aria-label={showPwd ? "Sembunyikan password" : "Tampilkan password"}
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-2 top-1.5 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted"
                >
                  {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Error text (jika ada) */}
            {err && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {err}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !email || !password}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Masuk"
              )}
            </Button>

            {/* Hint kecil */}
            <p className="text-xs text-muted-foreground text-center">
              Lupa password? Reset dari dashboard Supabase Auth.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
