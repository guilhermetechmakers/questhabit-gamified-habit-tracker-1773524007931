import { Link, useLocation } from "react-router-dom";
import { Home, ListTodo, Trophy, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/dashboard", label: "Today", icon: Home },
  { to: "/habits", label: "Habits", icon: ListTodo },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center gap-1 border-t border-border bg-card/95 px-2 py-2 backdrop-blur supports-[backdrop-filter]:bg-card/80 md:rounded-t-2xl md:mx-4 md:max-w-lg md:left-1/2 md:-translate-x-1/2">
      <div className="flex w-full max-w-md items-center justify-around">
        {navItems.slice(0, 2).map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl px-4 py-2 text-xs font-medium transition-colors",
              location.pathname === to
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-6 w-6" />
            <span>{label}</span>
          </Link>
        ))}

        <Link to="/habits/create" className="-mt-6 flex flex-shrink-0">
          <Button
            size="icon-lg"
            variant="gradient"
            className="h-14 w-14 rounded-2xl shadow-card-hover"
            aria-label="Create habit"
          >
            <Plus className="h-7 w-7" />
          </Button>
        </Link>

        {navItems.slice(2).map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl px-4 py-2 text-xs font-medium transition-colors",
              location.pathname === to
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-6 w-6" />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
