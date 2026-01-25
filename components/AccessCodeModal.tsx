"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// const API_URL = process.env.NEXT_PUBLIC_API_URL!

interface AccessCodeModalProps {
  open: boolean
  onClose: () => void
  movieId: number
  onSuccess: () => void
}

export function AccessCodeModal({
  open,
  onClose,
  movieId,
  onSuccess,
}: AccessCodeModalProps) {
  const [accessCode, setAccessCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!open) {
      setAccessCode("")
      setError("")
      setLoading(false)
    }
  }, [open])

  const handleVerify = async () => {
    if (!accessCode.trim()) {
      setError("Access code is required")
      return
    }

    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")

      if (!token) {
        setError("You must be logged in to watch this movie.")
        return
      }

      const res = await fetch(`https://api.falconeyephilmz.com/api/verify-access-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`,
        },
        body: JSON.stringify({
          access_code: accessCode.trim(),
          movie_id: movieId,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.message || "Invalid access code")
        return
      }

      onSuccess()
      onClose()
    } catch (err) {
      console.error("VERIFY ACCESS ERROR:", err)
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Enter Access Code</DialogTitle>

        <DialogHeader>
          <DialogDescription>
            Enter the access code you received after purchasing this movie.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2">
          <Input
            placeholder="Enter access code"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            disabled={loading}
          />
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleVerify} disabled={loading}>
            {loading ? "Verifying..." : "Verify & Watch"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
