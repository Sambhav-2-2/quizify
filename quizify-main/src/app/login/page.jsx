"use client";
import { useState } from "react";
import Link from "next/link";
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
import { Separator } from "@/components/ui/separator";
import { Github } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    accountType: "student",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [error, setError] = useState("");

  // Show success message if user just registered
  const registered = searchParams.get("registered");

  // Redirect authenticated users to the dashboard
  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.accountType === "student") {
        router.push("/dashboard");
      } else {
        router.push("/admin");
      }
    }
  }, [status, router]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleRadioChange = (value) => {
    setFormData({
      ...formData,
      accountType: value,
    });
  };

  const handleCredentialLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
        accountType: formData.accountType,
      });

      if (result?.error) {
        setError(
          result.error === "CredentialsSignin"
            ? "Invalid email or password"
            : result.error
        );
        return;
      }

      // Successful login - redirection is handled by useEffect
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      setIsGithubLoading(true);
      await signIn("github", { callbackUrl: "/dashboard" });
    } catch (err) {
      // Errors are handled by NextAuth
      console.error("GitHub login error:", err);
    } finally {
      setIsGithubLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <form onSubmit={handleCredentialLogin}>
          <CardHeader className="space-y-1">
            <div className="flex justify-center">
              <div className="flex items-center gap-2 font-bold text-3xl">
                Quizify
              </div>
            </div>
            <CardTitle className="text-2xl text-center">
              Login to your account
            </CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 mt-2">
            {registered && (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">
                  Registration successful! Please login with your credentials.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert className="bg-destructive/15 border-destructive/50">
                <AlertDescription className="text-destructive">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Account Type</Label>
              <RadioGroup
                defaultValue="student"
                value={formData.accountType}
                onValueChange={handleRadioChange}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="login-student" />
                  <Label htmlFor="login-student">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="admin" id="login-admin" />
                  <Label htmlFor="login-admin">Administrator</Label>
                </div>
              </RadioGroup>
            </div>

            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Login"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGithubLogin}
              disabled={isLoading || isGithubLoading}
            >
              {isGithubLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                  Signing in with GitHub...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Github className="h-4 w-4 mr-2" />
                  Sign In with GitHub
                </span>
              )}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 mt-2">
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Register
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
