import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedPage } from "@/components/AnimatedPage";
import { Flag } from "lucide-react";

export function AdminModeration() {
  return (
    <AnimatedPage>
      <h1 className="text-2xl font-bold text-foreground">Content Moderation</h1>
      <p className="mt-1 text-sm text-muted-foreground">Reports queue, moderation actions, audit log.</p>

      <Card className="mt-6 rounded-2xl border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Flag className="h-5 w-5" />
            Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No reports. When users report content, it will appear here for review.</p>
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}
