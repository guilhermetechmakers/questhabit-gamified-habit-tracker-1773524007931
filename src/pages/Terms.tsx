import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AnimatedPage } from "@/components/AnimatedPage";

export function Terms() {
  return (
    <AnimatedPage className="mx-auto max-w-2xl px-4 py-8">
      <Button variant="ghost" size="sm" className="mb-6 rounded-xl" asChild>
        <Link to="/">← Back</Link>
      </Button>
      <h1 className="text-2xl font-bold text-foreground">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: March 2025</p>
      <div className="prose prose-slate mt-6 max-w-none text-foreground">
        <p>
          By using QuestHabit you agree to these terms. You must provide accurate account information and use the service lawfully.
          You are responsible for keeping your credentials secure.
        </p>
        <p>
          We provide the service &quot;as is&quot; and are not liable for indirect damages. We may update the product and these terms;
          continued use after changes means you accept them. We may suspend or terminate accounts for abuse or violation of these terms.
        </p>
      </div>
      <div className="mt-8 flex gap-4 text-sm">
        <Link to="/privacy" className="text-primary underline hover:no-underline">Privacy policy</Link>
        <Link to="/cookies" className="text-primary underline hover:no-underline">Cookie policy</Link>
      </div>
    </AnimatedPage>
  );
}
