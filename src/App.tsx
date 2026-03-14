import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useCurrentUser } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Landing } from "@/pages/Landing";
import { Login } from "@/pages/Login";
import { Signup } from "@/pages/Signup";
import { ForgotPassword } from "@/pages/ForgotPassword";
import { EmailVerification } from "@/pages/EmailVerification";
import { AboutHelp } from "@/pages/AboutHelp";
import { Dashboard } from "@/pages/Dashboard";
import { HabitList } from "@/pages/HabitList";
import { HabitDetail } from "@/pages/HabitDetail";
import { CreateHabit } from "@/pages/CreateHabit";
import { Profile } from "@/pages/Profile";
import { Leaderboard } from "@/pages/Leaderboard";
import { Settings } from "@/pages/Settings";
import { Notifications } from "@/pages/Notifications";
import { Challenges } from "@/pages/Challenges";
import { CreateChallenge } from "@/pages/CreateChallenge";
import { Store } from "@/pages/Store";
import { Subscription } from "@/pages/Subscription";
import { Privacy } from "@/pages/Privacy";
import { Terms } from "@/pages/Terms";
import { CookiePolicy } from "@/pages/CookiePolicy";
import { NotFound } from "@/pages/NotFound";
import { ServerError } from "@/pages/ServerError";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminUsers } from "@/pages/admin/AdminUsers";
import { AdminAnalytics } from "@/pages/admin/AdminAnalytics";
import { AdminModeration } from "@/pages/admin/AdminModeration";

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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify" element={<EmailVerification />} />
          <Route path="/about" element={<AboutHelp />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/500" element={<ServerError />} />
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
            <Route path="/settings" element={<Settings />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/challenges/create" element={<CreateChallenge />} />
            <Route path="/store" element={<Store />} />
            <Route path="/subscription" element={<Subscription />} />
          </Route>
          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/moderation" element={<AdminModeration />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors closeButton />
    </QueryClientProvider>
  );
}
