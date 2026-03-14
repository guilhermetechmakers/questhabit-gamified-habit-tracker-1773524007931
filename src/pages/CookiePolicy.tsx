import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AnimatedPage } from "@/components/AnimatedPage";

export function CookiePolicy() {
  return (
    <AnimatedPage className="mx-auto max-w-2xl px-4 py-8">
      <Button variant="ghost" size="sm" className="mb-6 rounded-xl" asChild>
        <Link to="/">← Back</Link>
      </Button>
      <h1 className="text-2xl font-bold text-foreground">Cookie Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: March 2025</p>
      <div className="prose prose-slate mt-6 max-w-none text-foreground">
        <p>
          QuestHabit may use cookies and similar technologies for authentication, session management, and preferences.
          We use only what’s necessary to run the service. You can control cookies via your browser settings.
        </p>
      </div>
      <div className="mt-8 flex gap-4 text-sm">
        <Link to="/privacy" className="text-primary underline hover:no-underline">Privacy policy</Link>
        <Link to="/terms" className="text-primary underline hover:no-underline">Terms of service</Link>
      </div>
    </AnimatedPage>
  );
}
