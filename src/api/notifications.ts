import { supabase } from "@/lib/supabase";
import type { Notification } from "@/types/notification";

export const notificationsApi = {
  list: async (userId: string): Promise<Notification[]> => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return (data ?? []) as Notification[];
  },

  markRead: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id);
    if (error) throw new Error(error.message);
  },

  markAllRead: async (userId: string): Promise<void> => {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
  },
};
