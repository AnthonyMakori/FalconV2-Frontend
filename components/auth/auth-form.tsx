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
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      /* ---------------- SIGN UP ---------------- */
      if (type === "signup") {
        const formData = new FormData()
        formData.append("name", name)
        formData.append("email", email)
        formData.append("password", password)

        if (profileImage) {
          formData.append("profile_image", profileImage)
        }

        const response = await fetch(`${API_URL}/register`, {
          method: "POST",
          body: formData, // FormData handles headers automatically
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Something went wrong during registration")
        }

        toast({
          title: "Account created successfully",
          description: "Welcome to Falcon-Eye Stream!",
        })

        router.push("/auth/signin")
      }

      /* ---------------- SIGN IN ---------------- */
      if (type === "signin") {
        const response = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Invalid login credentials")
        }

        toast({
          title: "Welcome back!",
          description: "You have successfully signed in",
        })

        router.push("/dashboard")
      }

      /* ---------------- RESET ---------------- */
      if (type === "reset") {
        const response = await fetch(`${API_URL}/forgot-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Unable to send reset link")
        }

        toast({
          title: "Reset link sent",
          description: "Check your email for password reset instructions",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      {/* HEADER */}
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
          {type === "signin" && "Enter your email and password to sign in"}
          {type === "signup" && "Enter your details to create an account"}
          {type === "reset" && "Enter your email to receive a reset link"}
        </p>
      </div>

      {/* FORM */}
      <div className="grid gap-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            {/* NAME */}
            {type === "signup" && (
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            {/* PROFILE IMAGE */}
            {type === "signup" && (
              <div className="grid gap-2">
                <Label htmlFor="profile_image">Profile Picture</Label>
                <Input
                  id="profile_image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setProfileImage(e.target.files[0])
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  JPG, PNG or WEBP (max 2MB)
                </p>
              </div>
            )}

            {/* EMAIL */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* PASSWORD */}
            {type !== "reset" && (
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {type === "signin" && (
                    <Link
                      href="/auth/reset-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            )}

            {/* REMEMBER ME */}
            {type === "signin" && (
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="text-sm">
                  Remember me
                </label>
              </div>
            )}

            {/* SUBMIT */}
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? type === "signin"
                  ? "Signing in..."
                  : type === "signup"
                  ? "Creating account..."
                  : "Sending reset link..."
                : type === "signin"
                ? "Sign In"
                : type === "signup"
                ? "Create Account"
                : "Send Reset Link"}
            </Button>
          </div>
        </form>

        {/* SOCIAL LOGIN */}
        {type !== "reset" && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline">Google</Button>
              <Button variant="outline">Apple</Button>
            </div>
          </>
        )}
      </div>

      {/* FOOTER LINKS */}
      <p className="px-8 text-center text-sm text-muted-foreground">
        {type === "signin" && (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="underline hover:text-primary">
              Sign up
            </Link>
          </>
        )}
        {type === "signup" && (
          <>
            Already have an account?{" "}
            <Link href="/auth/signin" className="underline hover:text-primary">
              Sign in
            </Link>
          </>
        )}
        {type === "reset" && (
          <>
            Remember your password?{" "}
            <Link href="/auth/signin" className="underline hover:text-primary">
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  )
}
