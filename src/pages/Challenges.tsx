import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedPage } from "@/components/AnimatedPage";
import { Trophy, Plus, Users } from "lucide-react";

export function Challenges() {
  return (
    <AnimatedPage>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Challenges</h1>
          <p className="text-sm text-muted-foreground">Time-limited challenges to boost your habits.</p>
        </div>
        <Button variant="gradient" size="sm" className="rounded-xl" asChild>
          <Link to="/challenges/create">
            <Plus className="mr-1 h-4 w-4" />
            Create
          </Link>
        </Button>
      </div>

      <Card className="rounded-2xl border-dashed border-border">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Trophy className="h-12 w-12 text-muted-foreground" />
          <p className="mt-2 font-medium text-foreground">No active challenges</p>
          <p className="text-center text-sm text-muted-foreground">
            Create a challenge and invite friends, or join a public challenge to compete.
          </p>
          <div className="mt-4 flex gap-2">
            <Button variant="gradient" className="rounded-xl" asChild>
              <Link to="/challenges/create">Create challenge</Link>
            </Button>
            <Button variant="outline" className="rounded-xl">
              <Users className="mr-1 h-4 w-4" />
              Discover
            </Button>
          </div>
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}
