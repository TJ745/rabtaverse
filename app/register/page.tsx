"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth-client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await signUp.email({ email, password, name });

      if (result.error) {
        setError(
          result.error.message ?? "Registration failed. Please try again.",
        );
      } else {
        router.push("/chat");
      }
    } catch (err) {
      setError(
        `Authentication error: ${err instanceof Error ? err.message : "Registration failed. Please try again."}`,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md border-gray-200 shadow-lg bg-linear-to-b from-black via-zinc-950 to-black">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-white">
            <Link href="/">
              <Button variant="link" className="mr-4 cursor-pointer text-white">
                <ArrowLeft />
              </Button>
            </Link>
            Sign Up
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Sign up for an account to get started.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister} className="space-y-4">
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2 text-white">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2 text-white">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2 text-white">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
            <p className="text-center text-sm text-zinc-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-white hover:underline"
              >
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
