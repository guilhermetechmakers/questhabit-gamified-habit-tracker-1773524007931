import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { AnimatedPage } from "@/components/AnimatedPage";
import { Bell, Moon, Wifi, Shield, ChevronRight } from "lucide-react";

export function Settings() {
  return (
    <AnimatedPage>
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>
      <p className="mt-1 text-muted-foreground">Notifications, theme, sync, and privacy.</p>

      <Card className="mt-6 rounded-2xl border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Reminders and activity updates.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="reminders" className="text-sm font-medium">Habit reminders</Label>
            <Switch id="reminders" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="streak" className="text-sm font-medium">Streak & badge alerts</Label>
            <Switch id="streak" defaultChecked />
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-between rounded-xl" asChild>
            <Link to="/notifications">
              Notification center
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-4 rounded-2xl border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Moon className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>Theme and display.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="dark" className="text-sm font-medium">Dark mode</Label>
            <Switch id="dark" />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4 rounded-2xl border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Wifi className="h-5 w-5" />
            Sync & data
          </CardTitle>
          <CardDescription>Offline sync and data controls.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Data syncs automatically when online. Export or delete your data from Profile.</p>
          <Button variant="outline" size="sm" className="rounded-xl" asChild>
            <Link to="/profile">Profile & data</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-4 rounded-2xl border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-5 w-5" />
            Privacy
          </CardTitle>
          <CardDescription>Control what others can see.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="ghost" size="sm" className="w-full justify-between rounded-xl" asChild>
            <Link to="/privacy">Privacy policy</Link>
          </Button>
          <Separator />
          <Button variant="ghost" size="sm" className="w-full justify-between rounded-xl" asChild>
            <Link to="/terms">Terms of service</Link>
          </Button>
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}
