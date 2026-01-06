"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/components/auth/sign-out-button"
import {
  BarChart3,
  Film,
  Users,
  Settings,
  ShieldCheck,
  UserCog,
  FileText,
  Package,
  CalendarDays,
  CreditCard,
  Menu,
  X,
  Home,
} from "lucide-react"

/* ------------------------------ Sidebar Nav ------------------------------ */

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon: React.ReactNode
  }[]
  collapsed: boolean
}

function SidebarNav({ className, items, collapsed, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex flex-col gap-1", className)} {...props}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          title={collapsed ? item.title : undefined}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname === item.href
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted",
            collapsed && "justify-center px-2",
          )}
        >
          {item.icon}
          {!collapsed && <span>{item.title}</span>}
        </Link>
      ))}
    </nav>
  )
}

/* ------------------------------ Admin Sidebar ------------------------------ */

interface AdminSidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
}

export function AdminSidebar({ collapsed, onToggleCollapse }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const dashboardItems = [
    { title: "Dashboard", href: "/admin", icon: <BarChart3 className="h-4 w-4" /> },
    { title: "Movies", href: "/admin/movies", icon: <Film className="h-4 w-4" /> },
    { title: "Users", href: "/admin/users", icon: <Users className="h-4 w-4" /> },
    { title: "Staff", href: "/admin/staff", icon: <UserCog className="h-4 w-4" /> },
    { title: "Roles", href: "/admin/roles", icon: <ShieldCheck className="h-4 w-4" /> },
    { title: "Permissions", href: "/admin/permissions", icon: <ShieldCheck className="h-4 w-4" /> },
    { title: "Blog", href: "/admin/blog", icon: <FileText className="h-4 w-4" /> },
    { title: "Payment Plans", href: "/admin/payment-plans", icon: <CreditCard className="h-4 w-4" /> },
    { title: "Merchandise", href: "/admin/merchandise", icon: <Package className="h-4 w-4" /> },
    { title: "Events", href: "/admin/events", icon: <CalendarDays className="h-4 w-4" /> },
    { title: "Settings", href: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
  ]

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-background border-r transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-64",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            {!collapsed && (
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                <span className="font-bold text-xl">Admin Portal</span>
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="hidden md:flex"
            >
              {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-auto p-4">
            {!collapsed && (
              <h2 className="mb-2 text-lg font-semibold tracking-tight">
                Management
              </h2>
            )}
            <SidebarNav items={dashboardItems} collapsed={collapsed} />
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <SignOutButton
              variant="outline"
              className={cn("w-full", collapsed && "px-0")}
            />
          </div>
        </div>
      </aside>
    </>
  )
}
