export type HabitFrequency = "daily" | "weekly" | "custom";
export type HabitPrivacy = "private" | "friends" | "public";

export interface ScheduleJson {
  frequency: HabitFrequency;
  days_of_week?: number[];
  times?: string[];
  timezone?: string;
}

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  icon: string;
  schedule_json: ScheduleJson;
  xp_value: number;
  privacy_flag: HabitPrivacy;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateHabitInput {
  user_id: string;
  title: string;
  icon: string;
  schedule_json: ScheduleJson;
  xp_value?: number;
  privacy_flag?: HabitPrivacy;
}

export interface UpdateHabitInput {
  title?: string;
  icon?: string;
  schedule_json?: ScheduleJson;
  xp_value?: number;
  privacy_flag?: HabitPrivacy;
  archived?: boolean;
}
