import { useQuery } from "@tanstack/react-query";
import { completionsApi } from "@/api/completions";

export const completionKeys = {
  byHabit: (habitId: string) => ["completions", "habit", habitId] as const,
  byUser: (userId: string, from?: string, to?: string) =>
    ["completions", "user", userId, from, to] as const,
};

export function useCompletionsByHabit(habitId: string | undefined) {
  return useQuery({
    queryKey: completionKeys.byHabit(habitId ?? ""),
    queryFn: () => completionsApi.getByHabit(habitId!),
    enabled: !!habitId,
  });
}

export function useCompletionsByUser(
  userId: string | undefined,
  from?: string,
  to?: string
) {
  return useQuery({
    queryKey: completionKeys.byUser(userId ?? "", from, to),
    queryFn: () => completionsApi.getByUser(userId!, from, to),
    enabled: !!userId,
  });
}
