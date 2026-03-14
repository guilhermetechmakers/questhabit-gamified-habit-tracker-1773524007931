import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AnimatedPage } from "@/components/AnimatedPage";

export function Privacy() {
  return (
    <AnimatedPage className="mx-auto max-w-2xl px-4 py-8">
      <Button variant="ghost" size="sm" className="mb-6 rounded-xl" asChild>
        <Link to="/">← Back</Link>
      </Button>
      <h1 className="text-2xl font-bold text-foreground">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: March 2025</p>
      <div className="prose prose-slate mt-6 max-w-none text-foreground">
        <p>
          QuestHabit (&quot;we&quot;) is committed to protecting your privacy. We collect only what’s needed to run the service:
          account info (email, display name), habit and completion data, and usage data for product improvement.
        </p>
        <p>
          We do not sell your data. We use it to provide the app, sync across devices, compute XP and streaks,
          and send you reminders if you opt in. We use industry-standard security and store data in secure infrastructure.
        </p>
        <p>
          You can export or delete your data at any time from Profile. For questions, contact us via the About & Help page.
        </p>
      </div>
      <div className="mt-8 flex gap-4 text-sm">
        <Link to="/terms" className="text-primary underline hover:no-underline">Terms of service</Link>
        <Link to="/cookies" className="text-primary underline hover:no-underline">Cookie policy</Link>
      </div>
    </AnimatedPage>
  );
}
