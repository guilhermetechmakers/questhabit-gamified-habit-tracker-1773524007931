import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { habitKeys } from "./useHabits";
import { completionKeys } from "./useCompletions";

async function recordCompletion(habitId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await supabase.functions.invoke("record-completion", {
    body: { habit_id: habitId, user_id: user.id, source: "app" },
  });
  if (error) throw new Error(error.message ?? "Failed to record completion");
}

export function useRecordCompletion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recordCompletion,
    onSuccess: (_, habitId) => {
      queryClient.invalidateQueries({ queryKey: completionKeys.byHabit(habitId) });
      queryClient.invalidateQueries({ queryKey: habitKeys.all });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
      toast.success("Habit completed! +XP");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
