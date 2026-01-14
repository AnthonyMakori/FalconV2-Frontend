"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Film } from "lucide-react"


const API_URL = process.env.NEXT_PUBLIC_API_URL!
interface AuthFormProps {
  type: "signin" | "signup" | "reset"
}

export function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    if (type === "signup") {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong during registration");
      }

      toast({
        title: "Account created successfully",
        description: "Welcome to Falcon-Eye Stream!",
      });

      router.push("/auth/signin"); 
    } else if (type === "signin") {
      // You can add your signin logic here...
    } else if (type === "reset") {
      // You can add your reset logic here...
    }
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Film className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {type === "signin" && "Welcome back"}
          {type === "signup" && "Create an account"}
          {type === "reset" && "Reset your password"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {type === "signin" && "Enter your email and password to sign in to your account"}
          {type === "signup" && "Enter your information to create an account"}
          {type === "reset" && "Enter your email address and we'll send you a reset link"}
        </p>
      </div>
      <div className="grid gap-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            {type === "signup" && (
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  type="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {type !== "reset" && (
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {type === "signin" && (
                    <Link
                      href="/auth/reset-password"
                      className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  autoCapitalize="none"
                  autoComplete={type === "signin" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {type === "signup" && (
                  <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
                )}
              </div>
            )}
            {type === "signin" && (
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading && type === "signin" && "Signing in..."}
              {!isLoading && type === "signin" && "Sign In"}
              {isLoading && type === "signup" && "Creating account..."}
              {!isLoading && type === "signup" && "Create Account"}
              {isLoading && type === "reset" && "Sending reset link..."}
              {!isLoading && type === "reset" && "Send Reset Link"}
            </Button>
          </div>
        </form>
        {type !== "reset" && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" type="button">
                Google
              </Button>
              <Button variant="outline" type="button">
                Apple
              </Button>
            </div>
          </>
        )}
      </div>
      <p className="px-8 text-center text-sm text-muted-foreground">
        {type === "signin" && (
          <>
            Don't have an account?{" "}
            <Link href="/auth/signup" className="underline underline-offset-4 hover:text-primary">
              Sign up
            </Link>
          </>
        )}
        {type === "signup" && (
          <>
            Already have an account?{" "}
            <Link href="/auth/signin" className="underline underline-offset-4 hover:text-primary">
              Sign in
            </Link>
          </>
        )}
        {type === "reset" && (
          <>
            Remember your password?{" "}
            <Link href="/auth/signin" className="underline underline-offset-4 hover:text-primary">
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  )
}
