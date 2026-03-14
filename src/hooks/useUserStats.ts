import { useQuery } from "@tanstack/react-query";
import { userStatsApi } from "@/api/user-stats";

export const userStatsKeys = {
  one: (userId: string) => ["userStats", userId] as const,
};

export function useUserStats(userId: string | undefined) {
  return useQuery({
    queryKey: userStatsKeys.one(userId ?? ""),
    queryFn: () => userStatsApi.get(userId!),
    enabled: !!userId,
  });
}
