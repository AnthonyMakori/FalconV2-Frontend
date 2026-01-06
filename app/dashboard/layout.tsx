"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SignOutButton } from "@/components/auth/sign-out-button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  // Check authentication on component mount
  useEffect(() => {
    const isAuthenticated = document.cookie.includes("auth-token")
    if (!isAuthenticated) {
      router.push("/auth/signin")
    }
  }, [router])

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <SignOutButton />
      </div>
      {children}
    </div>
  )
}
