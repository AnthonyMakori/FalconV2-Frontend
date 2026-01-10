import Image from "next/image"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MerchandisePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">🛍 Merchandise</h1>
        <p className="text-muted-foreground">
          Official Falcon Eye Philmz merchandise — coming soon.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Product Placeholder */}
        <div className="rounded-2xl border p-6 text-center hover:shadow-lg transition">
          <div className="relative h-48 mb-4">
            <Image
              src="/images/merch-placeholder.png"
              alt="Merchandise"
              fill
              className="object-contain"
            />
          </div>

          <h3 className="font-semibold mb-2">
            Falcon Eye Branded Hoodie
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Premium quality hoodie with Falcon Eye Philmz branding.
          </p>

          <Button disabled className="w-full">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Coming Soon
          </Button>
        </div>
      </div>
    </div>
  )
}
