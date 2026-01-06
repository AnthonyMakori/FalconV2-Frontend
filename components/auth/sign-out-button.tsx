"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

interface SignOutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function SignOutButton({ variant = "ghost", size = "default" }: SignOutButtonProps) {
  const router = useRouter()

  const handleSignOut = () => {
    // Clear auth cookies
    document.cookie = "auth-token=; path=/; max-age=0"
    document.cookie = "user-role=; path=/; max-age=0"

    // Redirect to home page
    router.push("/")
    router.refresh()
  }

  return (
    <Button variant={variant} size={size} onClick={handleSignOut}>
      <LogOut className="mr-2 h-4 w-4" />
      Sign out
    </Button>
  )
}
