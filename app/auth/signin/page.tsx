"use client"
import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

const API_URL = process.env.NEXT_PUBLIC_API_URL!


export default function SignIn() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSocialSignIn = (provider: string) => {
    setIsLoading(true)
    setError("")
    try {
      if (typeof window !== "undefined") {
        // Redirect to the backend provider auth endpoint
        window.location.href = `${API_URL}/auth/${provider}`
      } else {
        router.push(`/auth/${provider}`)
      }
    } catch (err: any) {
      setError(err?.message || "Social sign-in failed")
      setIsLoading(false)
    }
  }

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  setIsLoading(true)
  setError("")

  const formData = new FormData(e.currentTarget)
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Login failed")
    }

    const token = data.token
    const role = data.user?.role

    if (!token || !role) {
      throw new Error("Invalid response from server")
    }

    document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`
    document.cookie = `user-role=${role}; path=/; max-age=${60 * 60 * 24 * 7}`

    if (typeof window !== "undefined") {
      localStorage.setItem("token", token)
      localStorage.setItem("user-role", role)
    }

    console.log("User role:", role)
    console.log("Token stored in localStorage:", token)

    // Redirect based on role
    role === "admin" ? router.push("/admin") : router.push("/dashboard")
  } catch (err: any) {
    setError(err.message || "Invalid email or password")
  } finally {
    setIsLoading(false)
  }
}

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/auth/reset-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            <div className="mt-4">
              <div className="flex items-center justify-center text-sm text-muted-foreground">or continue with</div>
              <div className="mt-3 grid grid-cols-1 gap-2">
                <Button type="button" variant="outline" className="w-full" onClick={() => handleSocialSignIn("google")}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 48 48" width="18" height="18"><path fill="#EA4335" d="M24 9.5c3.9 0 6.6 1.7 8.1 3.1l6-5.9C35.4 3.9 30.2 2 24 2 14 2 5.7 7.9 2 16.1l7.8 6.1C11.6 15.3 17.3 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-2.8-.4-4H24v7.6h12.6c-.5 3-2.5 6.1-6 8l7.9 6.1C44.2 38.3 46.5 31.9 46.5 24.5z"></path><path fill="#FBBC05" d="M9.8 29.6A14.4 14.4 0 0 1 8 24c0-1.6.3-3.1.8-4.6L2.9 13.3C1 16.6 0 20.2 0 24c0 3.8 1 7.4 2.9 10.7l6.9-5.1z"></path><path fill="#34A853" d="M24 46c6.2 0 11.4-2.1 15.2-5.7l-7.9-6.1c-2.2 1.5-5 2.4-7.3 2.4-6.7 0-12.4-5.8-13.3-13.3L2 34.6C5.7 42.1 14 46 24 46z"></path></svg>
                  Continue with Google
                </Button>
                <Button type="button" variant="outline" className="w-full" onClick={() => handleSocialSignIn("github")}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.2.8-.5v-2c-3.3.7-4-1.6-4-1.6-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1 1.6.8 1.6.8.9 1.4 2.4 1 3 .8.1-.6.4-1 .7-1.2-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C18 4 19 4.3 19 4.3c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.3.7.8.7 1.6v2.4c0 .3.2.6.8.5A12 12 0 0 0 12 .5z"/></svg>
                  Continue with GitHub
                </Button>
                <Button type="button" variant="outline" className="w-full" onClick={() => handleSocialSignIn("other")}>
                  Continue with other providers
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
