import { useCurrentUser } from "@/hooks/useAuth";
import { useUserStats } from "@/hooks/useUserStats";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, LogOut } from "lucide-react";
import { AnimatedPage } from "@/components/AnimatedPage";

export function Profile() {
  const navigate = useNavigate();
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: stats } = useUserStats(user?.id);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/", { replace: true });
  };

  if (userLoading) {
    return (
      <AnimatedPage>
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="mt-4 h-32 w-full rounded-2xl" />
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <h1 className="text-2xl font-bold text-foreground">Profile</h1>

      <Card className="mt-6 rounded-2xl border-border">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-14 w-14 rounded-2xl">
            <AvatarImage src={user?.avatar_url ?? undefined} />
            <AvatarFallback className="rounded-2xl text-lg">
              {user?.display_name?.[0] ?? user?.email?.[0] ?? "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">
              {user?.display_name || "QuestHabit User"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats && (
            <div className="flex items-center gap-2 rounded-xl bg-muted/20 px-4 py-3">
              <Star className="h-5 w-5 text-primary" />
              <span className="font-semibold">Level {stats.level}</span>
              <span className="text-muted-foreground">· {stats.xp_total} XP</span>
            </div>
          )}
          <Button
            variant="outline"
            className="w-full rounded-xl"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}
