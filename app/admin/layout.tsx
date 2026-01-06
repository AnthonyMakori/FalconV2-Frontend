"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { cn } from "@/lib/utils"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  // Auth & role check
  useEffect(() => {
    const isAuthenticated = document.cookie.includes("auth-token")
    const isAdmin = document.cookie.includes("user-role=admin")

    if (!isAuthenticated) {
      router.push("/auth/signin")
    } else if (!isAdmin) {
      router.push("/dashboard")
    }
  }, [router])

  return (
    <div className="flex min-h-screen">
      <AdminSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      <main
        className={cn(
          "flex-1 p-6 overflow-auto transition-all duration-300",
          collapsed ? "ml-16" : "ml-64",
        )}
      >
        {children}
      </main>
    </div>
  )
}
