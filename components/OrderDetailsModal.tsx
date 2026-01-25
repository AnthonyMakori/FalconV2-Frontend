"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

type OrderDetailsModalProps = {
  paymentId: number
  itemName: string
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function OrderDetailsModal({ paymentId, itemName, isOpen, onClose, onSuccess }: OrderDetailsModalProps) {
  const [color, setColor] = useState("")
  const [size, setSize] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!color || !size || !phone || !location) {
      alert("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/merchandise-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_id: paymentId,
          color,
          size,
          preferred_phone: phone,
          location,
          additional_info: additionalInfo,
        }),
      })

      if (!res.ok) throw new Error("Failed to save order details")

      alert("Order details submitted successfully")
      onClose()
      if (onSuccess) onSuccess()
    } catch (error: any) {
      alert("Error: " + (error.message || "Unknown error"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-96 rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-primary">Order Details for {itemName}</h2>

        <div className="space-y-3">
          <input type="text" placeholder="Color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"/>
          <input type="text" placeholder="Size" value={size} onChange={(e) => setSize(e.target.value)} className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"/>
          <input type="text" placeholder="Preferred Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"/>
          <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"/>
          <textarea placeholder="Additional Info" value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"/>
        </div>

        <div className="mt-6 flex gap-3">
          <Button className="w-full" onClick={handleSubmit} disabled={loading}>{loading ? "Saving..." : "Submit Order"}</Button>
          <Button variant="outline" className="w-full" onClick={onClose} disabled={loading}>Cancel</Button>
        </div>
      </div>
    </div>
  )
}
