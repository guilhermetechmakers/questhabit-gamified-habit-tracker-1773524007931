import { useParams, Link, useNavigate } from "react-router-dom";
import { useHabit } from "@/hooks/useHabits";
import { useCompletionsByHabit } from "@/hooks/useCompletions";
import { useDeleteHabit } from "@/hooks/useHabits";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { AnimatedPage } from "@/components/AnimatedPage";
import { useRecordCompletion } from "@/hooks/useRecordCompletion";
import { format, parseISO } from "date-fns";

const iconMap: Record<string, string> = {
  target: "🎯",
  book: "📖",
  run: "🏃",
  heart: "❤️",
  sun: "☀️",
  moon: "🌙",
  coffee: "☕",
  default: "✅",
};

export function HabitDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: habit, isLoading } = useHabit(id);
  const { data: completions } = useCompletionsByHabit(id);
  const deleteHabit = useDeleteHabit();
  const recordCompletion = useRecordCompletion();

  if (isLoading || !id) {
    return (
      <AnimatedPage>
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="mt-4 h-48 w-full rounded-2xl" />
      </AnimatedPage>
    );
  }

  if (!habit) {
    return (
      <AnimatedPage>
        <p className="text-muted-foreground">Habit not found.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link to="/habits">Back to habits</Link>
        </Button>
      </AnimatedPage>
    );
  }

  const icon = iconMap[habit.icon] ?? iconMap.default;

  const handleDelete = () => {
    if (window.confirm("Delete this habit? Completions will remain.")) {
      deleteHabit.mutate(habit.id, {
        onSuccess: () => navigate("/habits"),
      });
    }
  };

  return (
    <AnimatedPage>
      <div className="mb-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/habits" aria-label="Back">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/habits/${habit.id}/edit`} aria-label="Edit">
              <Pencil className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={deleteHabit.isPending}
            aria-label="Delete"
          >
            <Trash2 className="h-5 w-5 text-destructive" />
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl border-border">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
            {icon}
          </div>
          <div>
            <CardTitle className="text-xl">{habit.title}</CardTitle>
            <p className="text-sm text-muted-foreground">+{habit.xp_value} XP per completion</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full rounded-xl"
            variant="gradient"
            onClick={() => recordCompletion.mutate(habit.id)}
            disabled={recordCompletion.isPending}
          >
            {recordCompletion.isPending ? "Recording…" : "Mark complete"}
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-6 rounded-2xl border-border">
        <CardHeader>
          <CardTitle className="text-base">Recent completions</CardTitle>
        </CardHeader>
        <CardContent>
          {completions && completions.length > 0 ? (
            <ul className="space-y-2">
              {completions.slice(0, 10).map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between rounded-lg bg-muted/20 px-3 py-2 text-sm"
                >
                  <span>{format(parseISO(c.timestamp), "MMM d, h:mm a")}</span>
                  <span className="text-primary">+{c.xp_awarded} XP</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No completions yet. Mark one above!</p>
          )}
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}
