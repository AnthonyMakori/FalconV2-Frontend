import { useState } from "react"
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

const API_URL = process.env.NEXT_PUBLIC_API_URL!


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

  const handleVerify = async () => {
    if (!accessCode) {
      setError("Access code is required")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch(`${API_URL}/verify-access-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_code: accessCode,
          movie_id: movieId,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.message || "Invalid access code")
        setLoading(false)
        return
      }

      onSuccess()
      onClose()
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Access Code</DialogTitle>
          <DialogDescription>
            Please enter the access code you received after purchasing this
            movie.
          </DialogDescription>
        </DialogHeader>

        <Input
          placeholder="Enter access code"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
        />

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
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
