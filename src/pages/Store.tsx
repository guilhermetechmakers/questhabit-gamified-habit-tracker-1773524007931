import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedPage } from "@/components/AnimatedPage";
import { Gift, Sparkles } from "lucide-react";

const MOCK_ITEMS = [
  { id: "1", name: "Golden badge", cost: 500, icon: "🏆" },
  { id: "2", name: "Streak freeze", cost: 200, icon: "❄️" },
  { id: "3", name: "Double XP (1 day)", cost: 300, icon: "⚡" },
];

export function Store() {
  return (
    <AnimatedPage>
      <h1 className="text-2xl font-bold text-foreground">Rewards & Store</h1>
      <p className="mt-1 text-sm text-muted-foreground">Spend points on cosmetics and boosts.</p>

      <Card className="mt-6 rounded-2xl border-border bg-card-dark shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-card-foreground">
            <Sparkles className="h-5 w-5 text-primary" />
            Your points
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Earn XP by completing habits, then spend it here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-primary">0 XP</p>
          <p className="text-xs text-muted-foreground">Complete habits to earn more.</p>
        </CardContent>
      </Card>

      <h2 className="mt-8 text-lg font-semibold text-foreground">Catalog</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {MOCK_ITEMS.map((item) => (
          <Card key={item.id} className="rounded-2xl border-border shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                {item.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.cost} XP</p>
              </div>
              <Button variant="secondary" size="sm" className="rounded-xl" disabled>
                Get
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 rounded-2xl border-border">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Gift className="h-10 w-10 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">More items coming soon.</p>
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}
