"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

interface Movie {
  id: number
  title: string
  price: number
}

interface MoviePurchaseModalProps {
  movie: Movie | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function MoviePurchaseModal({
  movie,
  isOpen,
  onClose,
  onSuccess,
}: MoviePurchaseModalProps) {
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Reset fields when modal opens
  useEffect(() => {
    if (movie) {
      setPhone("")
      setEmail("")
      setName("")
      setError("")
    }
  }, [movie])

  if (!isOpen || !movie) return null

  const amount = Math.round(movie.price ?? 0)

  const handlePayment = async () => {
    const trimmedPhone = phone.trim()
    const trimmedEmail = email.trim()
    const trimmedName = name.trim()

    // Validation
    if (!trimmedPhone || !trimmedEmail) {
      setError("Please enter phone number and email.")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.")
      return
    }

    setError("")
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/stk/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movie_id: movie.id,
          phone: trimmedPhone,
          email: trimmedEmail,
          amount,
          name: trimmedName || trimmedEmail.split("@")[0],
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to initiate payment")
      }

      alert("Payment initiated successfully. Please complete the STK prompt on your phone.")

      // Reset
      setPhone("")
      setEmail("")
      setName("")
      onClose()
      onSuccess?.()
    } catch (err: any) {
      setError(err.message || "Failed to initiate payment")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-96 rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-2 text-xl font-bold text-primary">Purchase {movie.title}</h2>
        <p className="mb-4 text-muted-foreground">
          Price: <span className="font-medium">KES {amount.toLocaleString()}</span>
        </p>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="mt-6 flex gap-3">
          <Button className="w-full" onClick={handlePayment} disabled={loading}>
            {loading ? "Processing..." : "Proceed to Payment"}
          </Button>
          <Button variant="outline" className="w-full" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
        </div>

        <button
          onClick={onClose}
          disabled={loading}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
