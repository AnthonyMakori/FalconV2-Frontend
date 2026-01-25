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
}

export default function BuyModal({ item, isOpen, onClose }: BuyModalProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  // Step 2: Order details
  const [color, setColor] = useState("")
  const [size, setSize] = useState("")
  const [preferredPhone, setPreferredPhone] = useState("")
  const [location, setLocation] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")

  const [paymentId, setPaymentId] = useState<number | null>(null)
  const amount = Math.round(item?.price ?? 0)

  if (!isOpen || !item) return null

  // ---------------- Step 1 ----------------
  const handlePayment = async () => {
    if (!phone || !email) {
      alert("Please enter both phone number and email")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/initiate/merchandise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchandise_id: item.id,
          phone,
          email,
          amount,
        }),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message || "Failed to initiate payment")
      }

      const data = await res.json()

      // Save payment id for step 2
      setPaymentId(data.payment_id || null)

      alert("Payment initiated successfully. Please complete the payment on your phone.")

      // Move to step 2 to enter order details
      setStep(2)
    } catch (error: any) {
      alert("Failed to initiate payment: " + (error.message || "Unknown error"))
    } finally {
      setLoading(false)
    }
  }

  // ---------------- Step 2 ----------------
  const handleSubmitOrderDetails = async () => {
    if (!paymentId) {
      alert("Payment ID not found")
      return
    }

    if (!color || !size || !preferredPhone || !location) {
      alert("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/merchandise-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_id: paymentId,
          color,
          size,
          preferred_phone: preferredPhone,
          location,
          additional_info: additionalInfo,
        }),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message || "Failed to save order details")
      }

      alert("Order details submitted successfully!")

      // Reset modal
      setStep(1)
      setPhone("")
      setEmail("")
      setColor("")
      setSize("")
      setPreferredPhone("")
      setLocation("")
      setAdditionalInfo("")
      setPaymentId(null)
      onClose()
    } catch (error: any) {
      alert("Error: " + (error.message || "Unknown error"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-96 rounded-xl bg-white p-6 shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="mb-4 text-xl font-bold text-primary">
          {step === 1 ? `Purchase ${item.name}` : `Order Details for ${item.name}`}
        </h2>

        {step === 1 ? (
          <>
            {/* Step 1: Payment */}
            <p className="mb-4 text-muted-foreground">
              Price: <span className="font-medium">KES {amount.toLocaleString()}</span>
            </p>

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

            <div className="mt-6 flex gap-3">
              <Button className="w-full" onClick={handlePayment} disabled={loading}>
                {loading ? "Processing..." : "Proceed to Payment"}
              </Button>
              <Button variant="outline" className="w-full" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Step 2: Order Details */}
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Preferred Phone"
                value={preferredPhone}
                onChange={(e) => setPreferredPhone(e.target.value)}
                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <textarea
                placeholder="Additional Info"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <Button className="w-full" onClick={handleSubmitOrderDetails} disabled={loading}>
                {loading ? "Saving..." : "Submit Order"}
              </Button>
              <Button variant="outline" className="w-full" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
