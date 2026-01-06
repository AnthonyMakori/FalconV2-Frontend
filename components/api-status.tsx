"use client"

import { useEffect, useState } from "react"
import { testApiConnection } from "@/lib/tmdb"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

export default function ApiStatus() {
  const [status, setStatus] = useState<"checking" | "connected" | "error">("checking")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await testApiConnection()
        setStatus(isConnected ? "connected" : "error")
        if (!isConnected) {
          setError("Failed to connect to TMDB API")
        }
      } catch (err) {
        setStatus("error")
        setError(err instanceof Error ? err.message : "Unknown error")
      }
    }

    checkConnection()
  }, [])

  if (status === "checking") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Checking API connection...
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive">
        <AlertCircle className="h-4 w-4" />
        API Error: {error}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-sm text-green-600">
      <CheckCircle className="h-4 w-4" />
      API Connected
    </div>
  )
}
