import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatedPage } from "@/components/AnimatedPage";
import { Trophy } from "lucide-react";

export function CreateChallenge() {
  return (
    <AnimatedPage>
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/challenges" aria-label="Back">←</Link>
        </Button>
        <h1 className="text-xl font-bold">New challenge</h1>
      </div>
      <Card className="rounded-2xl border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Create challenge
          </CardTitle>
          <CardDescription>
            Set a goal and invite others. Coming soon: full challenge creation flow.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Challenge name</Label>
            <Input id="name" placeholder="e.g. 7-day streak" className="mt-1 rounded-xl" disabled />
          </div>
          <Button variant="gradient" className="w-full rounded-xl" disabled>
            Create (coming soon)
          </Button>
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}
