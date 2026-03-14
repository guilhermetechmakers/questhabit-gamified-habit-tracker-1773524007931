import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AnimatedPage } from "@/components/AnimatedPage";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "At least 6 characters"),
  display_name: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function Signup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { display_name: data.display_name ?? undefined },
        },
      });
      if (error) throw error;
      toast.success("Account created! Check your email to verify.");
      navigate("/dashboard", { replace: true });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Sign up failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedPage className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>Create your account to start building habits.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="display_name">Name (optional)</Label>
              <Input
                id="display_name"
                placeholder="Your name"
                className="mt-1"
                {...register("display_name")}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="mt-1"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min 6 characters"
                className="mt-1"
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" variant="gradient" disabled={isLoading}>
              {isLoading ? "Creating account…" : "Sign up"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}
