import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@/types/user";

async function getCurrentUser(): Promise<User | null> {
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return null;
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();
  return data as User | null;
}

export const authKeys = {
  user: ["auth", "user"] as const,
};

export function useCurrentUser() {
  const query = useQuery({
    queryKey: authKeys.user,
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      query.refetch();
    });
    return () => subscription.unsubscribe();
  }, [query]);

  return query;
}
