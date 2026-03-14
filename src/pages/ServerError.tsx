import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedPage } from "@/components/AnimatedPage";
import { AlertTriangle } from "lucide-react";

export function ServerError() {
  return (
    <AnimatedPage className="flex min-h-screen flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md rounded-2xl border-border shadow-card">
        <CardContent className="flex flex-col items-center py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
          <p className="mt-2 text-muted-foreground">
            We hit an error. Please try again or go back home.
          </p>
          <div className="mt-6 flex gap-3">
            <Button variant="gradient" className="rounded-xl" asChild>
              <Link to="/">Go home</Link>
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}
