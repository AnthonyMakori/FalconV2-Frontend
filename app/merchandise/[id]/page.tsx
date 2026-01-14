"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingBag, ArrowLeft, Info } from "lucide-react"
import BuyModal from "@/components/BuyModal"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

type Merchandise = {
  id: number
  name: string
  description: string
  price?: number
  image: string
}

export default function MerchandiseDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const [item, setItem] = useState<Merchandise | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Buy modal state
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [params.id])

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(
          `${API_URL}/merchandise/${params.id}`
        )
        if (!res.ok) throw new Error("Merchandise not found")
        const data = await res.json()
        setItem(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [params.id])

  if (loading) return <MerchandiseSkeleton />
  if (error || !item) return notFound()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[45vh] overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-start">
            <Badge className="mb-3">Official Merchandise</Badge>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              {item.name}
            </h1>

            {item.price && (
              <p className="text-xl font-semibold">
                KES {item.price.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-10">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/merchandise">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Merchandise
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Image */}
          <div className="lg:col-span-1">
            <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-3">
                Product Overview
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="flex gap-4">
              <Button size="lg" onClick={() => setIsModalOpen(true)}>
                <ShoppingBag className="mr-2 h-5 w-5" />
                Buy Now
              </Button>

              <Button size="lg" variant="outline">
                <Info className="mr-2 h-5 w-5" />
                More Details
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Buy Modal */}
      <BuyModal
        item={item}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

function MerchandiseSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="h-[45vh] bg-muted animate-pulse" />
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Skeleton className="aspect-square rounded-xl" />
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-12 w-48" />
        </div>
      </div>
    </div>
  )
}
