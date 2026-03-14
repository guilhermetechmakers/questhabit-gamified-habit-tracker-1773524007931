import { Link } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useAuth";
import { useNotifications, useMarkAllNotificationsRead } from "@/hooks/useNotifications";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedPage } from "@/components/AnimatedPage";
import { Bell, CheckCheck, Settings } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

function notificationTitle(type: string, payload: Record<string, unknown>): string {
  switch (type) {
    case "reminder":
      return (payload.habit_title as string) ?? "Habit reminder";
    case "streak":
      return `Streak: ${payload.days ?? 0} days!`;
    case "badge":
      return `Badge: ${payload.name ?? "Achievement"}`;
    default:
      return type.replace(/_/g, " ");
  }
}

export function Notifications() {
  const { data: user } = useCurrentUser();
  const userId = user?.id;
  const { data: notifications, isLoading } = useNotifications(userId);
  const markAllRead = useMarkAllNotificationsRead(userId);

  return (
    <AnimatedPage>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground">Reminders and updates.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl"
            onClick={() => markAllRead.mutate()}
            disabled={!notifications?.length || notifications.every((n) => n.read)}
          >
            <CheckCheck className="mr-1 h-4 w-4" />
            Mark all read
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl" asChild>
            <Link to="/settings" aria-label="Settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : notifications && notifications.length > 0 ? (
        <ul className="space-y-2">
          {notifications.map((n) => (
            <Card
              key={n.id}
              className={cn(
                "rounded-2xl border-border shadow-card transition-colors",
                !n.read && "bg-primary/5"
              )}
            >
              <CardContent className="flex items-start gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">
                    {notificationTitle(n.type, n.payload_json ?? {})}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </ul>
      ) : (
        <Card className="rounded-2xl border-dashed border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground" />
            <p className="mt-2 font-medium text-foreground">No notifications yet</p>
            <p className="text-sm text-muted-foreground">
              Reminders and streak alerts will show up here.
            </p>
            <Button variant="outline" className="mt-4 rounded-xl" asChild>
              <Link to="/settings">Notification settings</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </AnimatedPage>
  );
}
