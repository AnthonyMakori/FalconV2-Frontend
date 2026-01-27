"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

interface MoviePurchaseModalProps {
  movie: any
  isOpen: boolean
  onClose: () => void
}

export default function MoviePurchaseModal({ movie, isOpen, onClose }: MoviePurchaseModalProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [amount, setAmount] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Set purchase price dynamically from the movie object
  useEffect(() => {
    if (movie?.purchase_price) {
      setAmount(Number(movie.purchase_price))
    } else {
      setAmount(0)
    }
  }, [movie])

  const handlePurchase = async () => {
    setLoading(true)
    setError(null)

    if (!name || !phone) {
      setError("Name and phone number are required.")
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_URL}/stk/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          amount,
          movie_id: movie.id,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccess(true)
      } else {
        setError(data.message || "Payment initiation failed.")
      }
    } catch (err: any) {
      console.error("Purchase error:", err)
      setError("Payment initiation failed.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSuccess(false)
    setError(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase "{movie?.title}"</DialogTitle>
          <DialogDescription>
            Enter your details below to complete the purchase. Price: <strong>KES {amount}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && (
            <p className="text-green-500 text-sm">
              Payment request sent! Check your phone to complete the payment.
            </p>
          )}

          {!success && (
            <>
              <Input
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                placeholder="Phone Number (e.g., 2547XXXXXXXX)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Input
                placeholder="Email "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Button
                onClick={handlePurchase}
                disabled={loading || amount <= 0}
                className="w-full mt-2"
              >
                {loading ? "Processing..." : `Pay KES ${amount}`}
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
