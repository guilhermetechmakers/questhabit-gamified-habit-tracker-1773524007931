import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimatedPage } from "@/components/AnimatedPage";
import { toast } from "sonner";
import { HelpCircle, Mail, BookOpen } from "lucide-react";

const FAQ = [
  {
    q: "How do I create a habit?",
    a: "Tap the + button in the bottom nav or go to Habits → Create. Name your habit, pick an icon, set frequency and XP, then save. You can mark it complete from the dashboard or habit list.",
  },
  {
    q: "What are XP and levels?",
    a: "Completing habits earns XP. As your total XP grows, you level up. Levels and streaks are shown on your dashboard and help you stay motivated.",
  },
  {
    q: "Can I use QuestHabit offline?",
    a: "Yes. We cache your habits and completions locally. When you’re back online, we sync automatically. Marking a habit complete offline will sync once connected.",
  },
  {
    q: "How do I change or delete a habit?",
    a: "Open the habit from the list or dashboard, then use Edit or Delete in the detail view.",
  },
  {
    q: "Where is my data stored?",
    a: "Your data is stored securely. We keep minimal data and you can export or delete it from Profile → data tools.",
  },
];

export function AboutHelp() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) {
      toast.error("Please fill in email and message.");
      return;
    }
    toast.success("Thanks! We’ll get back to you soon.");
    setEmail("");
    setMessage("");
  };

  return (
    <AnimatedPage className="mx-auto max-w-lg px-4 py-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <HelpCircle className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">About & Help</h1>
          <p className="text-sm text-muted-foreground">QuestHabit – turn habits into quests.</p>
        </div>
      </div>

      <Card className="mb-8 rounded-2xl border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            About
          </CardTitle>
          <CardDescription>
            QuestHabit is a lightweight, gamified habit tracker. Create habits in seconds,
            earn XP and streaks, and stay consistent with minimal friction and optional social features.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="mb-8 rounded-2xl border-border shadow-card">
        <CardHeader>
          <CardTitle>FAQ</CardTitle>
          <CardDescription>Common questions and answers.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {FAQ.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card className="mb-8 rounded-2xl border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact
          </CardTitle>
          <CardDescription>Send us a message and we’ll respond as soon as we can.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleContact} className="space-y-4">
            <div>
              <Label htmlFor="help-email">Email</Label>
              <Input
                id="help-email"
                type="email"
                placeholder="you@example.com"
                className="mt-1 rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="help-message">Message</Label>
              <textarea
                id="help-message"
                rows={4}
                placeholder="How can we help?"
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <Button type="submit" variant="gradient" className="w-full rounded-xl">
              Send message
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <Link to="/privacy" className="underline hover:text-foreground">Privacy policy</Link>
        <Link to="/terms" className="underline hover:text-foreground">Terms of service</Link>
        <Link to="/cookies" className="underline hover:text-foreground">Cookie policy</Link>
      </div>
    </AnimatedPage>
  );
}
