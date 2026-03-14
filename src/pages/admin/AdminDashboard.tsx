import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedPage } from "@/components/AnimatedPage";
import { Users, Activity, TrendingUp, Shield } from "lucide-react";

const KPIS = [
  { label: "Total users", value: "—", icon: Users },
  { label: "Active today", value: "—", icon: Activity },
  { label: "Completions (7d)", value: "—", icon: TrendingUp },
  { label: "Reports open", value: "0", icon: Shield },
];

export function AdminDashboard() {
  return (
    <AnimatedPage>
      <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Operational analytics and moderation.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="rounded-2xl border-border shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 rounded-2xl border-border shadow-card">
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No recent events. Connect analytics for live data.</p>
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}
