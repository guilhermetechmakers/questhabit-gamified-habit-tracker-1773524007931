import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedPage } from "@/components/AnimatedPage";

export function Leaderboard() {
  return (
    <AnimatedPage>
      <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
      <p className="mt-1 text-muted-foreground">Friendly competition coming soon.</p>
      <Card className="mt-6 rounded-2xl border-border">
        <CardHeader>
          <CardTitle className="text-base">Top adventurers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Opt in to the leaderboard from Settings to see rankings and compete with friends.
          </p>
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}
