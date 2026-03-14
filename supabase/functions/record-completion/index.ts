/**
 * QuestHabit record-completion Edge Function
 * Accepts completion events from the client, validates the user and habit,
 * inserts the completion, and atomically updates user_stats (XP, level, streaks).
 * Never expose API keys; uses Supabase client with request Authorization.
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const XP_PER_LEVEL_BASE = 100;
const LEVEL_MULTIPLIER = 1.5;

function xpForLevel(level: number): number {
  return Math.floor(XP_PER_LEVEL_BASE * Math.pow(LEVEL_MULTIPLIER, level - 1));
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization") ?? "" },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const body = await req.json();
    const habitId = body?.habit_id;
    const source = body?.source ?? "app";
    if (!habitId) {
      return new Response(
        JSON.stringify({ error: "habit_id required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: habit, error: habitError } = await supabase
      .from("habits")
      .select("id, user_id, xp_value")
      .eq("id", habitId)
      .single();
    if (habitError || !habit) {
      return new Response(
        JSON.stringify({ error: "Habit not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    if (habit.user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: "Forbidden" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const xpAwarded = habit.xp_value ?? 10;
    const now = new Date().toISOString();
    const today = now.slice(0, 10);

    const { error: insertError } = await supabase.from("completions").insert({
      habit_id: habitId,
      user_id: user.id,
      timestamp: now,
      source,
      xp_awarded: xpAwarded,
    });
    if (insertError) {
      return new Response(
        JSON.stringify({ error: insertError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: stats } = await supabase
      .from("user_stats")
      .select("xp_total, level, current_streak, longest_streak, last_completion_date")
      .eq("user_id", user.id)
      .single();

    const lastDate = stats?.last_completion_date;
    const prevTotal = stats?.xp_total ?? 0;
    const prevLevel = stats?.level ?? 1;
    const prevStreak = stats?.current_streak ?? 0;
    const prevLongest = stats?.longest_streak ?? 0;

    let newStreak = prevStreak;
    if (!lastDate) {
      newStreak = 1;
    } else {
      const last = new Date(lastDate);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (last.toISOString().slice(0, 10) === yesterday.toISOString().slice(0, 10)) {
        newStreak = prevStreak + 1;
      } else if (last.toISOString().slice(0, 10) !== today) {
        newStreak = 1;
      }
    }
    const newLongest = Math.max(prevLongest, newStreak);
    const newTotal = prevTotal + xpAwarded;
    let newLevel = prevLevel;
    while (newTotal >= xpForLevel(newLevel + 1)) {
      newLevel++;
    }

    const { error: updateError } = await supabase
      .from("user_stats")
      .update({
        xp_total: newTotal,
        level: newLevel,
        current_streak: newStreak,
        longest_streak: newLongest,
        last_completion_date: today,
        updated_at: now,
      })
      .eq("user_id", user.id);
    if (updateError) {
      return new Response(
        JSON.stringify({ error: updateError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        xp_awarded: xpAwarded,
        xp_total: newTotal,
        level: newLevel,
        current_streak: newStreak,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
