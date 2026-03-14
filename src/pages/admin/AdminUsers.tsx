import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatedPage } from "@/components/AnimatedPage";
import { Search, Users } from "lucide-react";

export function AdminUsers() {
  return (
    <AnimatedPage>
      <h1 className="text-2xl font-bold text-foreground">User Management</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage users, suspend, export.</p>

      <div className="mt-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search users…" className="rounded-xl pl-9" />
        </div>
        <Button variant="outline" className="rounded-xl">Export</Button>
      </div>

      <Card className="mt-6 rounded-2xl border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-5 w-5" />
            Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">User table will load here. Connect to your users table and add actions (suspend, view).</p>
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}
