import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Target, Zap, Trophy, Shield } from "lucide-react";
import { AnimatedPage } from "@/components/AnimatedPage";

export function Landing() {
  return (
    <AnimatedPage className="min-h-screen bg-gradient-to-b from-[rgb(var(--card))] to-background">
      <header className="flex items-center justify-between px-4 py-6">
        <span className="text-xl font-bold text-foreground">QuestHabit</span>
        <div className="flex gap-2">
          <Button variant="ghost" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button variant="gradient" asChild>
            <Link to="/signup">Sign up</Link>
          </Button>
        </div>
      </header>

      <section className="px-4 py-12 text-center md:py-20">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
          Turn habits into quests.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Quick setup, instant rewards. Build routines that stick with XP, streaks, and badges.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button size="lg" variant="gradient" className="rounded-2xl" asChild>
            <Link to="/signup">Get started free</Link>
          </Button>
          <Button size="lg" variant="outline" className="rounded-2xl" asChild>
            <Link to="/login">I have an account</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-6 px-4 py-12 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {[
          { icon: Zap, title: "30-second setup", desc: "Create a habit in seconds, not minutes." },
          { icon: Target, title: "Single-tap complete", desc: "Mark done with one tap, get instant XP." },
          { icon: Trophy, title: "Streaks & badges", desc: "Stay motivated with levels and achievements." },
          { icon: Shield, title: "Privacy first", desc: "Your data stays yours. Opt-in social only." },
        ].map(({ icon: Icon, title, desc }, i) => (
          <div
            key={title}
            className="animate-fade-in-up rounded-2xl border border-border bg-card p-6 shadow-card"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="mb-3 inline-flex rounded-xl bg-primary/10 p-3">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </section>

      <footer className="mt-16 border-t border-border px-4 py-8 text-center text-sm text-muted-foreground">
        <Link to="/about" className="underline hover:text-foreground">About & Help</Link>
        {" · "}
        <Link to="/privacy" className="underline hover:text-foreground">Privacy</Link>
        {" · "}
        <Link to="/terms" className="underline hover:text-foreground">Terms</Link>
        {" · "}
        <Link to="/cookies" className="underline hover:text-foreground">Cookies</Link>
      </footer>
    </AnimatedPage>
  );
}
