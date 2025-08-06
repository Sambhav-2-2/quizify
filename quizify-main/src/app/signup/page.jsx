"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import axios from "axios";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Github } from "lucide-react";
import { CldUploadWidget } from 'next-cloudinary';

export default function Signup() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    accountType: "student",
    avatarUrl: "", // Store Cloudinary URL here
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
    // Clear error when field is edited
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: "",
      });
    }
  };

  const handleRadioChange = (value) => {
    setFormData({
      ...formData,
      accountType: value,
    });
  };

  // Handle successful Cloudinary upload
  const handleImageUploadSuccess = (result) => {
    setFormData({
      ...formData,
      avatarUrl: result.info.secure_url,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "First name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGithubSignIn = async () => {
    try {
      setIsGithubLoading(true);
      await signIn("github", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("GitHub sign in failed:", error);
      setErrors({
        form: "GitHub sign in failed. Please try again.",
      });
    } finally {
      setIsGithubLoading(false);
    }
  };

// ...existing code...

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  setIsLoading(true);

  try {
    // Create FormData object
    const formDataToSend = new FormData();
    
    // Add all fields to FormData
    formDataToSend.append("username", formData.username);
    formDataToSend.append("name", formData.fullName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("accountType", formData.accountType);
    
    // If we have a Cloudinary URL, send it as avatarUrl
    if (formData.avatarUrl) {
      formDataToSend.append("avatarUrl", formData.avatarUrl);
    }

    // Make API call with form data and proper config
    const response = await axios.post("/api/auth/register", formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    // On successful registration, redirect to login page
    router.push("/login?registered=true");
  } catch (error) {
    console.error("Registration failed:", error);
    setErrors({
      form:
        error.response?.data?.message ||
        "Registration failed. Please try again.",
    });
  } finally {
    setIsLoading(false);
  }
};

// ...existing code...

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <CardHeader className="space-y-1">
            <div className="flex justify-center">
              <div className="flex items-center gap-2 font-bold text-4xl">
                Quizify
              </div>
            </div>
            <CardTitle className="text-2xl text-center">
              Create an account
            </CardTitle>
            <CardDescription className="text-center mb-2">
              Enter your information to create an account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* GitHub OAuth Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGithubSignIn}
              disabled={isGithubLoading || isLoading}
            >
              {isGithubLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                  Signing in with GitHub...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Github className="h-4 w-4" />
                  Sign up with GitHub
                </span>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {errors.form && (
              <div className="rounded-md bg-destructive/15 p-3">
                <p className="text-sm font-medium text-destructive">
                  {errors.form}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Fullname</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName}</p>
              )}
            </div>
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
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Account Type</Label>
              <RadioGroup
                defaultValue="student"
                value={formData.accountType}
                onValueChange={handleRadioChange}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="admin" id="admin" />
                  <Label htmlFor="admin">Administrator</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 mt-3">
            <Button
              className="w-full"
              type="submit"
              disabled={isLoading || isGithubLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}