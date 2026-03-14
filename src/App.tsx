import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useCurrentUser } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Landing } from "@/pages/Landing";
import { Login } from "@/pages/Login";
import { Signup } from "@/pages/Signup";
import { Dashboard } from "@/pages/Dashboard";
import { HabitList } from "@/pages/HabitList";
import { HabitDetail } from "@/pages/HabitDetail";
import { CreateHabit } from "@/pages/CreateHabit";
import { Profile } from "@/pages/Profile";
import { Leaderboard } from "@/pages/Leaderboard";
import { NotFound } from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useCurrentUser();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/habits" element={<HabitList />} />
            <Route path="/habits/create" element={<CreateHabit />} />
            <Route path="/habits/:id" element={<HabitDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Route>
          <Route path="/privacy" element={<div className="p-6">Privacy policy placeholder.</div>} />
          <Route path="/terms" element={<div className="p-6">Terms placeholder.</div>} />
          <Route path="/forgot-password" element={<div className="p-6">Forgot password placeholder.</div>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors closeButton />
    </QueryClientProvider>
  );
}
