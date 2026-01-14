"use client"

import { useState } from "react"
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
  const [loading, setLoading] = useState(false)

  if (!isOpen || !item) return null

  // ✅ amount is now available everywhere
  const amount = Math.round(item.price ?? 0)

  const handleProceed = async () => {
    if (!phone || !email) {
      alert("Please enter both phone number and email")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/initiate/merchandise`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          merchandise_id: item.id,
          phone,
          email,
          amount, // ✅ whole number
        }),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message || "Failed to initiate payment")
      }

      const data = await res.json()

      alert(
        `Payment initiated successfully!\nTransaction ID: ${
          data.transaction_id || "N/A"
        }`
      )

      setPhone("")
      setEmail("")
      onClose()
      if (onSuccess) onSuccess()
    } catch (error: any) {
      alert(
        "Failed to initiate payment: " +
          (error.message || "Unknown error")
      )
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
        <div className="space-y-4">
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
