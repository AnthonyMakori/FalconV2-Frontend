"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

type Merchandise = {
  id: number
  name: string
  price?: number
}

type BuyModalProps = {
  item: Merchandise | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function BuyModal({
  item,
  isOpen,
  onClose,
  onSuccess,
}: BuyModalProps) {
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [attendeeName, setAttendeeName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Reset fields when modal opens
  useEffect(() => {
    if (item) {
      setPhone("")
      setEmail("")
      setAttendeeName("")
      setError("")
    }
  }, [item])

  if (!isOpen || !item) return null

  const amount = Math.round(item.price ?? 0)

  const handleProceed = async () => {
    const trimmedPhone = phone.trim()
    const trimmedEmail = email.trim()
    const trimmedName = attendeeName.trim()

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
      const res = await fetch(`${API_URL}/events/stk/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: item.id,
          phone: trimmedPhone,
          email: trimmedEmail,
          amount,
          attendee_name: trimmedName || trimmedEmail.split("@")[0],
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to initiate payment")
      }

      alert(
        `Payment initiated successfully!\n\nCheck your phone to complete the M-Pesa payment.`
      )

      setPhone("")
      setEmail("")
      setAttendeeName("")
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
        {/* Title */}
        <h2 className="mb-2 text-xl font-bold text-primary">
          Purchase {item.name}
        </h2>

        {/* Price */}
        <p className="mb-4 text-muted-foreground">
          Price:{" "}
          <span className="font-medium">
            KES {amount.toLocaleString()}
          </span>
        </p>

        {/* Inputs */}
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Attendee Name (optional)"
            value={attendeeName}
            onChange={(e) => setAttendeeName(e.target.value)}
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

          {/* Inline Error */}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Button
            className="w-full"
            onClick={handleProceed}
            disabled={loading}
          >
            {loading ? "Processing..." : "Proceed to Payment"}
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>

        {/* Close */}
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
