import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AnimatedPage } from "@/components/AnimatedPage";

export function NotFound() {
  return (
    <AnimatedPage className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
      <p className="mt-2 text-lg text-foreground">Page not found</p>
      <p className="mt-1 text-sm text-muted-foreground">
        The page you’re looking for doesn’t exist.
      </p>
      <Button variant="gradient" className="mt-8 rounded-xl" asChild>
        <Link to="/">Go home</Link>
      </Button>
    </AnimatedPage>
  );
}
