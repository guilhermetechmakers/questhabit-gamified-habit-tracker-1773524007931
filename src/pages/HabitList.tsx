import { useState } from "react";
import { Link } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useAuth";
import { useHabits } from "@/hooks/useHabits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { HabitCard } from "@/components/habits/HabitCard";
import { Search, Plus } from "lucide-react";
import { AnimatedPage } from "@/components/AnimatedPage";

export function HabitList() {
  const { data: user } = useCurrentUser();
  const { data: habits, isLoading } = useHabits(user?.id);
  const [search, setSearch] = useState("");

  const filtered =
    habits?.filter((h) =>
      h.title.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

  return (
    <AnimatedPage>
      <h1 className="text-2xl font-bold text-foreground">Habits</h1>
      <p className="mt-1 text-muted-foreground">Manage and complete your habits.</p>

      <div className="mt-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search habits"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl"
          />
        </div>
        <Button variant="gradient" size="icon" className="rounded-xl" asChild>
          <Link to="/habits/create" aria-label="Create habit">
            <Plus className="h-5 w-5" />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="mt-6 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <ul className="mt-6 space-y-3">
          {filtered.map((habit) => (
            <HabitCard key={habit.id} habit={habit} showComplete />
          ))}
        </ul>
      ) : (
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            {search ? "No habits match your search." : "No habits yet."}
          </p>
          {!search && (
            <Button variant="gradient" className="mt-4" asChild>
              <Link to="/habits/create">Create your first habit</Link>
            </Button>
          )}
        </div>
      )}
    </AnimatedPage>
  );
}
