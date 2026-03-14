import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedPage } from "@/components/AnimatedPage";
import { toast } from "sonner";
import { Mail, Loader2, CheckCircle } from "lucide-react";

const RESEND_COOLDOWN_SEC = 60;

export function EmailVerification() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"idle" | "checking" | "verified" | "expired">("idle");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const tokenHash = searchParams.get("token_hash");
    const type = searchParams.get("type");
    if (tokenHash && (type === "recovery" || type === "magiclink" || type === "signup")) {
      setStatus("checking");
      supabase.auth
        .verifyOtp({ token_hash: tokenHash, type: type as "recovery" | "magiclink" | "signup" })
        .then(({ error }) => {
          if (error) {
            setStatus("expired");
            toast.error(error.message);
          } else setStatus("verified");
        })
        .catch(() => setStatus("expired"));
      return;
    }
    setStatus("idle");
  }, [searchParams]);

  const handleResend = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      toast.error("No email found.");
      return;
    }
    const { error } = await supabase.auth.resend({ type: "signup", email: user.email });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Verification email sent.");
    setCooldown(RESEND_COOLDOWN_SEC);
  };

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  return (
    <AnimatedPage className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-8">
      <Card className="rounded-2xl border-border shadow-card">
        <CardHeader>
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            {status === "checking" ? (
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            ) : (
              <Mail className="h-6 w-6 text-primary" />
            )}
          </div>
          <CardTitle className="text-xl">
            {status === "checking" && "Verifying…"}
            {status === "verified" && "Email verified"}
            {status === "expired" && "Link expired"}
            {status === "idle" && "Verify your email"}
          </CardTitle>
          <CardDescription>
            {status === "verified" && "You can now use your account. Continue to the app."}
            {status === "expired" && "The verification link has expired. Request a new one below."}
            {status === "idle" && "We sent a verification link to your email. Click it to continue."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {status === "verified" && (
            <div className="flex items-center gap-2 rounded-xl bg-success/10 p-3 text-success">
              <CheckCircle className="h-5 w-5 shrink-0" />
              <span className="text-sm font-medium">All set!</span>
            </div>
          )}
          {(status === "idle" || status === "expired") && (
            <Button
              variant="gradient"
              className="w-full rounded-xl"
              onClick={handleResend}
              disabled={cooldown > 0}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend verification email"}
            </Button>
          )}
          {status === "verified" && (
            <Button variant="gradient" className="w-full rounded-xl" asChild>
              <Link to="/dashboard">Continue to dashboard</Link>
            </Button>
          )}
          <Button variant="ghost" className="w-full rounded-xl" asChild>
            <Link to="/login">Back to login</Link>
          </Button>
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}
