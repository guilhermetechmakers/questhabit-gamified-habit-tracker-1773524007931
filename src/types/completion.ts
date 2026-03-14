export type CompletionSource = "app" | "reminder" | "offline" | "api";

export interface Completion {
  id: string;
  habit_id: string;
  user_id: string;
  timestamp: string;
  source: CompletionSource;
  xp_awarded: number;
  created_at: string;
}

export interface CompletionEventInput {
  habit_id: string;
  user_id: string;
  timestamp?: string;
  source?: CompletionSource;
}
