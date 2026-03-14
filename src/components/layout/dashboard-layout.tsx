import { Outlet } from "react-router-dom";
import { BottomNav } from "./bottom-nav";

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <main className="mx-auto max-w-lg px-4 py-6">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
