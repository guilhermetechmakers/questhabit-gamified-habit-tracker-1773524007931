import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCurrentUser } from "@/hooks/useAuth";
import { useCreateHabit } from "@/hooks/useHabits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatedPage } from "@/components/AnimatedPage";
import { cn } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(1, "Name your habit"),
  icon: z.string().default("target"),
  frequency: z.enum(["daily", "weekly"]),
  xp_value: z.number().min(1).max(100).default(10),
});

type FormData = z.infer<typeof schema>;

const ICONS = [
  { id: "target", label: "Target" },
  { id: "book", label: "Book" },
  { id: "run", label: "Run" },
  { id: "heart", label: "Heart" },
  { id: "sun", label: "Sun" },
  { id: "moon", label: "Moon" },
  { id: "coffee", label: "Coffee" },
];

export function CreateHabit() {
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();
  const createHabit = useCreateHabit(user?.id);
  const [step, setStep] = useState(1);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", icon: "target", frequency: "daily", xp_value: 10 },
  });

  const onSubmit = (data: FormData) => {
    createHabit.mutate(
      {
        title: data.title,
        icon: data.icon,
        schedule_json: { frequency: data.frequency },
        xp_value: data.xp_value,
      },
      {
        onSuccess: (habit) => {
          navigate(`/habits/${habit.id}`, { replace: true });
        },
      }
    );
  };

  return (
    <AnimatedPage>
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/habits" aria-label="Back">
            ←
          </Link>
        </Button>
        <h1 className="text-xl font-bold">New habit</h1>
      </div>

      <div className="mb-6 flex gap-2">
        {[1, 2].map((s) => (
          <div
            key={s}
            className={cn(
              "h-1 flex-1 rounded-full",
              step >= s ? "bg-primary" : "bg-muted/30"
            )}
          />
        ))}
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        {step === 1 && (
          <Card className="rounded-2xl border-border">
            <CardHeader>
              <CardTitle>Name & icon</CardTitle>
              <CardDescription>Choose a name and icon for your habit.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Habit name</Label>
                <Input
                  id="title"
                  placeholder="e.g. Morning run"
                  className="mt-1 rounded-xl"
                  {...form.register("title")}
                />
                {form.formState.errors.title && (
                  <p className="mt-1 text-sm text-destructive">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Icon</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ICONS.map(({ id }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => form.setValue("icon", id)}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl border text-lg transition-colors",
                        form.watch("icon") === id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:bg-muted/30"
                      )}
                    >
                      {id === "target" && "🎯"}
                      {id === "book" && "📖"}
                      {id === "run" && "🏃"}
                      {id === "heart" && "❤️"}
                      {id === "sun" && "☀️"}
                      {id === "moon" && "🌙"}
                      {id === "coffee" && "☕"}
                    </button>
                  ))}
                </div>
              </div>
              <Button
                type="button"
                className="w-full rounded-xl"
                variant="gradient"
                onClick={() => setStep(2)}
                disabled={!form.watch("title")?.trim()}
              >
                Next
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="rounded-2xl border-border">
            <CardHeader>
              <CardTitle>Schedule & XP</CardTitle>
              <CardDescription>How often and how much XP per completion.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Frequency</Label>
                <Select
                  value={form.watch("frequency")}
                  onValueChange={(v) => form.setValue("frequency", v as "daily" | "weekly")}
                >
                  <SelectTrigger className="mt-1 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="xp_value">XP per completion</Label>
                <Input
                  id="xp_value"
                  type="number"
                  min={1}
                  max={100}
                  className="mt-1 rounded-xl"
                  {...form.register("xp_value", { valueAsNumber: true })}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-xl"
                  variant="gradient"
                  disabled={createHabit.isPending}
                >
                  {createHabit.isPending ? "Creating…" : "Create habit"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </AnimatedPage>
  );
}
