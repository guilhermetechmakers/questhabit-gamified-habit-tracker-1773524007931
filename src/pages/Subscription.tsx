import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedPage } from "@/components/AnimatedPage";
import { Check, Zap, Crown } from "lucide-react";

const FEATURES = [
  "Unlimited habits",
  "Cloud backup & sync",
  "Advanced analytics",
  "Unlimited reminders",
  "Priority support",
];

export function Subscription() {
  return (
    <AnimatedPage>
      <h1 className="text-2xl font-bold text-foreground">Subscription</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your plan and billing.</p>

      <Card className="mt-6 rounded-2xl border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="h-5 w-5 text-primary" />
            Current plan
          </CardTitle>
          <CardDescription>You’re on the free plan.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-semibold text-foreground">Free</p>
          <p className="text-sm text-muted-foreground">Core habits and XP. Upgrade for more.</p>
        </CardContent>
      </Card>

      <Card className="mt-6 rounded-2xl border-2 border-primary/30 bg-primary/5 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Crown className="h-5 w-5 text-primary" />
            Premium
          </CardTitle>
          <CardDescription>Unlock everything.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">$4.99</span>
            <span className="text-sm text-muted-foreground">/ month</span>
          </div>
          <ul className="space-y-2">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 shrink-0 text-success" />
                {f}
              </li>
            ))}
          </ul>
          <Button variant="gradient" className="w-full rounded-xl">
            Upgrade to Premium
          </Button>
        </CardContent>
      </Card>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Billing is handled securely via Stripe. Cancel anytime.
      </div>
    </AnimatedPage>
  );
}
