"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

interface MoviePurchaseModalProps {
  movie: any
  isOpen: boolean
  onClose: () => void
}

export default function MoviePurchaseModal({
  movie,
  isOpen,
  onClose,
}: MoviePurchaseModalProps) {
  const router = useRouter()

  const [phone, setPhone] = useState("")
  const [amount, setAmount] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setAmount(Number(movie?.purchase_price || 0))
  }, [movie])

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null

  const handlePurchase = async () => {
    setLoading(true)
    setError(null)

    try {
      // 🚨 Must be logged in
      if (!token) {
        setError("You must be logged in to continue.")
        setLoading(false)
        return
      }

      // ✅ FREE MOVIE FLOW
      if (amount === 0) {
        const response = await fetch(
          `${API_URL}/stk/movies/unlock-free`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              movie_id: movie.id,
            }),
          }
        )

        const data = await response.json()

        if (!response.ok) {
          setError(data.message || "Failed to unlock movie.")
          return
        }

        setSuccess(true)

        // Auto redirect to watch page
        setTimeout(() => {
          router.push(`/watch/${movie.id}`)
        }, 1500)

        return
      }

      // ✅ PAID MOVIE FLOW
      if (!phone) {
        setError("Phone number is required.")
        setLoading(false)
        return
      }

      const response = await fetch(`${API_URL}/stk/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone,
          amount,
          movie_id: movie.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Payment initiation failed.")
        return
      }

      setSuccess(true)

    } catch (err: any) {
      console.error("Purchase error:", err)
      setError(err?.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSuccess(false)
    setError(null)
    setPhone("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {amount > 0
              ? `Purchase "${movie?.title}"`
              : `Watch "${movie?.title}"`}
          </DialogTitle>

          <DialogDescription>
            {amount > 0 ? (
              <>
                Complete payment to watch.
                <br />
                Price: <strong>KES {amount}</strong>
              </>
            ) : (
              <>This movie is <strong>FREE</strong>.</>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {success && (
            <p className="text-green-500 text-sm">
              {amount > 0
                ? "STK push sent. Complete payment on your phone."
                : "Movie unlocked! Redirecting..."}
            </p>
          )}

          {!success && (
            <>
              {amount > 0 && (
                <Input
                  placeholder="Phone Number (2547XXXXXXXX)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              )}

              <Button
                onClick={handlePurchase}
                disabled={loading}
                className="w-full mt-2"
              >
                {loading
                  ? "Processing..."
                  : amount > 0
                  ? `Pay KES ${amount}`
                  : "Watch Now"}
              </Button>
            </>
          )}

          <Button variant="outline" className="w-full" onClick={handleClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}