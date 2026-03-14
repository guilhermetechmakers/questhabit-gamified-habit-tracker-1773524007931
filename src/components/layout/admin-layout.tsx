import { Outlet, Link, useLocation } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LayoutDashboard, Users, BarChart3, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

const adminNav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/moderation", label: "Moderation", icon: Flag },
];

export function AdminLayout() {
  const { data: user, isLoading } = useCurrentUser();
  const location = useLocation();

  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Button variant="ghost" size="sm" className="gap-1 rounded-xl" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back to app
            </Link>
          </Button>
          <span className="text-sm font-medium text-muted-foreground">Admin</span>
        </div>
      </header>
      <div className="mx-auto flex max-w-4xl gap-6 px-4 py-6">
        <nav className="flex w-40 shrink-0 flex-col gap-1">
          {adminNav.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to}>
              <Button
                variant={location.pathname === to ? "secondary" : "ghost"}
                size="sm"
                className={cn("w-full justify-start rounded-xl", location.pathname === to && "bg-primary/10")}
              >
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </Button>
            </Link>
          ))}
        </nav>
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
