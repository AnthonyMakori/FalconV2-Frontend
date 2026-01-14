"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Eye, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import BuyModal from "@/components/BuyModal"

const API_URL = process.env.NEXT_PUBLIC_API_URL!


type Merchandise = {
  id: number
  name: string
  description: string
  price?: number
  image: string
  image_url: string
}

export default function MerchandisePage() {
  const [merchandise, setMerchandise] = useState<Merchandise[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMerch, setSelectedMerch] = useState<Merchandise | null>(null)

  useEffect(() => {
    const fetchMerchandise = async () => {
      try {
        const res = await fetch(`${API_URL}/merchandise`)
        if (!res.ok) throw new Error("Failed to fetch merchandise")
        const data = await res.json()
        setMerchandise(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMerchandise()
  }, [])

  const openBuyModal = (item: Merchandise) => {
    setSelectedMerch(item)
    setIsModalOpen(true)
  }

  const closeBuyModal = () => {
    setIsModalOpen(false)
    setSelectedMerch(null)
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-start mb-14">
        <h1 className="text-4xl font-bold mb-4">Merchandise</h1>
        <p className="text-muted-foreground max-w-xl mx-start">
          Explore official Falcon Eye Philmz merchandise crafted for true fans.
        </p>
      </div>

      {loading && (
        <p className="text-center text-muted-foreground">
          Loading merchandise…
        </p>
      )}

      {error && (
        <p className="text-center text-red-500">{error}</p>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {merchandise.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl border bg-background overflow-hidden hover:shadow-xl transition flex flex-col"
            >
              {/* Image */}
              <div className="relative h-80 w-full">
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {item.price && (
                  <Badge className="absolute top-4 right-4 text-sm">
                    KES {item.price.toLocaleString()}
                  </Badge>
                )}
              </div>

              {/* Content */}
              <div className="p-6 text-center space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button asChild className="w-full">
                    <Link href={`/merchandise/${item.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => openBuyModal(item)}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Buy
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Buy Modal */}
      <BuyModal
        item={selectedMerch}
        isOpen={isModalOpen}
        onClose={closeBuyModal}
      />
    </div>
  )
}
