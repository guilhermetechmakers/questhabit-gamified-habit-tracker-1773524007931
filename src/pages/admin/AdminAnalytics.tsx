import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedPage } from "@/components/AnimatedPage";
import { BarChart3 } from "lucide-react";

export function AdminAnalytics() {
  return (
    <AnimatedPage>
      <h1 className="text-2xl font-bold text-foreground">Analytics & Reports</h1>
      <p className="mt-1 text-sm text-muted-foreground">Cohorts, funnels, report builder.</p>

      <Card className="mt-6 rounded-2xl border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-5 w-5" />
            Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Connect Amplitude, GA4, or Mixpanel for product analytics. Use this page for custom reports and scheduled exports.
          </p>
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}
