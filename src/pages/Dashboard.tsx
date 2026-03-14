import { Link } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useAuth";
import { useHabits } from "@/hooks/useHabits";
import { useUserStats } from "@/hooks/useUserStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Flame, Star, Plus, Target } from "lucide-react";
import { AnimatedPage } from "@/components/AnimatedPage";
import { HabitCard } from "@/components/habits/HabitCard";

function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function Dashboard() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const userId = user?.id;
  const { data: habits, isLoading: habitsLoading } = useHabits(userId);
  const { data: stats } = useUserStats(userId);

  if (userLoading || !userId) {
    return (
      <AnimatedPage>
        <Skeleton className="mb-6 h-24 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </AnimatedPage>
    );
  }

  const currentLevel = stats?.level ?? 1;
  const xpTotal = stats?.xp_total ?? 0;
  const xpCurrentLevel = xpForLevel(currentLevel);
  const xpNextLevel = xpForLevel(currentLevel + 1);
  const progress = ((xpTotal - xpCurrentLevel) / (xpNextLevel - xpCurrentLevel)) * 100;

  return (
    <AnimatedPage>
      <h1 className="text-2xl font-bold text-foreground">
        Hey{user?.display_name ? `, ${user.display_name}` : ""}
      </h1>
      <p className="mt-1 text-muted-foreground">Here’s today’s quests.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card className="overflow-hidden rounded-2xl border-border bg-gradient-to-br from-primary/10 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="h-5 w-5 text-primary" />
              Level {currentLevel}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={Math.min(progress, 100)} className="h-2" />
            <p className="mt-2 text-sm text-muted-foreground">
              {xpTotal} XP · {xpNextLevel - xpTotal} to next level
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Flame className="h-5 w-5 text-primary" />
              Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {stats?.current_streak ?? 0} days
            </p>
            <p className="text-sm text-muted-foreground">
              Longest: {stats?.longest_streak ?? 0} days
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Today’s habits</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/habits/create">
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Link>
          </Button>
        </div>
        {habitsLoading ? (
          <div className="mt-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        ) : habits && habits.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {habits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} showComplete />
            ))}
          </ul>
        ) : (
          <Card className="mt-4 rounded-2xl border-dashed border-border">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-muted-foreground" />
              <p className="mt-2 font-medium text-foreground">No habits yet</p>
              <p className="text-sm text-muted-foreground">
                Create your first habit in under 30 seconds.
              </p>
              <Button variant="gradient" className="mt-4" asChild>
                <Link to="/habits/create">Create habit</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AnimatedPage>
  );
}
