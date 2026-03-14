import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { habitsApi } from "@/api/habits";
import { toast } from "sonner";
import type { CreateHabitInput, UpdateHabitInput } from "@/types/habit";

export const habitKeys = {
  all: ["habits"] as const,
  list: (userId: string) => [...habitKeys.all, "list", userId] as const,
  detail: (id: string) => [...habitKeys.all, "detail", id] as const,
};

export function useHabits(userId: string | undefined) {
  return useQuery({
    queryKey: habitKeys.list(userId ?? ""),
    queryFn: () => habitsApi.getAll(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  });
}

export function useHabit(id: string | undefined) {
  return useQuery({
    queryKey: habitKeys.detail(id ?? ""),
    queryFn: () => habitsApi.getById(id!),
    enabled: !!id,
  });
}

export function useCreateHabit(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<CreateHabitInput, "user_id">) =>
      habitsApi.create({ ...input, user_id: userId! }),
    onSuccess: () => {
      if (userId) queryClient.invalidateQueries({ queryKey: habitKeys.list(userId) });
      toast.success("Habit created!");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateHabitInput }) =>
      habitsApi.update(id, updates),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: habitKeys.detail(updated.id) });
      queryClient.invalidateQueries({ queryKey: habitKeys.all });
      toast.success("Habit updated!");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: habitsApi.delete,
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: habitKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: habitKeys.all });
      toast.success("Habit deleted.");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
