import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Habit } from "@/types/habit";
import { useRecordCompletion } from "@/hooks/useRecordCompletion";

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

interface HabitCardProps {
  habit: Habit;
  showComplete?: boolean;
}

export function HabitCard({ habit, showComplete }: HabitCardProps) {
  const recordCompletion = useRecordCompletion();
  const icon = iconMap[habit.icon] ?? iconMap.default;

  return (
    <Card
      className={cn(
        "group rounded-2xl border-border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
      )}
    >
      <Link to={`/habits/${habit.id}`} className="block">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl">
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground truncate">{habit.title}</h3>
            <p className="text-sm text-muted-foreground">
              +{habit.xp_value} XP
            </p>
          </div>
          {showComplete && (
            <Button
              size="icon"
              variant="secondary"
              className="shrink-0 rounded-xl"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                recordCompletion.mutate(habit.id);
              }}
              disabled={recordCompletion.isPending}
              aria-label={`Mark ${habit.title} complete`}
            >
              <Check className="h-5 w-5" />
            </Button>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
