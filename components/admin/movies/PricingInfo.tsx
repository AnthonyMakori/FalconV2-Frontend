'use client'
import { Input } from "@/components/ui/input"

export default function PricingInfo({ rentalPrice,setRentalPrice, purchasePrice,setPurchasePrice, rentalPeriod,setRentalPeriod, freePreview,setFreePreview, previewDuration,setPreviewDuration }: any){
  return (
    <div className="space-y-4">
      <Input placeholder="Rental price" value={rentalPrice} onChange={e=>setRentalPrice(e.target.value)} />
      <Input placeholder="Purchase price" value={purchasePrice} onChange={e=>setPurchasePrice(e.target.value)} />
      <Input placeholder="Rental period (hours)" value={rentalPeriod} onChange={e=>setRentalPeriod(e.target.value)} />
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={freePreview} onChange={e=>setFreePreview(e.target.checked)} />
        Allow free preview
      </label>
      <Input placeholder="Preview duration" value={previewDuration} onChange={e=>setPreviewDuration(e.target.value)} />
    </div>
  )
}
