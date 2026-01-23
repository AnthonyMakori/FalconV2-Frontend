"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Info,
  ShoppingCart,
} from "lucide-react"
import BuyModal from "@/components/EventBuyModal"

const API_URL = process.env.NEXT_PUBLIC_API_URL!
const IMAGE_BASE_URL = "https://api.falconeyephilmz.com"

type EventType = {
  id: number
  name: string
  description: string
  date: string
  location: string
  poster?: string
  status?: string
  price?: string
}

export default function EventDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const [event, setEvent] = useState<EventType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [params.id])

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API_URL}/events/${params.id}`)
        if (!res.ok) throw new Error("Event not found")

        const data = await res.json()

        const normalizedEvent: EventType = {
          ...data,
          poster: data.poster
            ? data.poster.startsWith("http")
              ? data.poster
              : `${IMAGE_BASE_URL}/${data.poster}`
            : undefined,
        }

        setEvent(normalizedEvent)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [params.id])

  if (loading) return <EventSkeleton />
  if (error || !event) return notFound()

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      {event.poster && (
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <Image
            src={event.poster}
            alt={event.name}
            fill
            className="object-cover"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div>
              <Badge className="mb-3">
                {event.status || "Upcoming Event"}
              </Badge>

              <h1 className="text-3xl md:text-5xl font-bold mb-2">
                {event.name}
              </h1>

              {event.price && (
                <p className="text-xl md:text-2xl font-semibold">
                  KES {parseFloat(event.price).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-10">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Poster */}
          {event.poster && (
            <div className="lg:col-span-1">
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={event.poster}
                  alt={event.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-3">
                Event Overview
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {event.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-muted-foreground">
              <span className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                {new Date(event.date).toLocaleDateString()}
              </span>

              <span className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {event.location}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              {event.price ? (
                <Button
                  size="lg"
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Buy Ticket
                </Button>
              ) : (
                <Button size="lg" disabled>
                  Tickets Not Available
                </Button>
              )}

              <Button
                size="lg"
                variant="outline"
                className="flex items-center gap-2"
              >
                <Info className="h-5 w-5" />
                More Details
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Buy Modal */}
      <BuyModal
        item={
          event.price
            ? {
                id: event.id,
                name: event.name,
                price: parseFloat(event.price),
              }
            : null
        }
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

function EventSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-[50vh] md:h-[60vh] bg-muted animate-pulse" />
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
