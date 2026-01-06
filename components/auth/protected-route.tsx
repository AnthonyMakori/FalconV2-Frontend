"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "admin" | "user" | undefined // undefined means any authenticated user
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Check authentication status
    const isAuthenticated = document.cookie.includes("auth-token")
    const userRole = document.cookie.includes("user-role=admin") ? "admin" : "user"

    if (!isAuthenticated) {
      router.push("/auth/signin")
      return
    }

    // Check role if required
    if (requiredRole && userRole !== requiredRole) {
      // Redirect to appropriate dashboard
      router.push(userRole === "admin" ? "/admin" : "/dashboard")
      return
    }

    setIsAuthorized(true)
    setIsLoading(false)
  }, [router, requiredRole])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return isAuthorized ? <>{children}</> : null
}
