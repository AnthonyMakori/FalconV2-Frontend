"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, CalendarDays, MapPin, Info } from "lucide-react"

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

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<EventType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [params.id])

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/events/${params.id}`)
        if (!res.ok) throw new Error("Event not found")
        const data = await res.json()
        setEvent(data)
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
    <div className="min-h-screen">
      {/* Hero */}
      {event.poster && (
        <div className="relative h-[45vh] overflow-hidden">
          <Image
            src={event.poster}
            alt={event.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />

          {/* Overlay: Badge + Title + Price */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="container mx-auto max-w-3xl">
              <Badge className="mb-3">{event.status || "Upcoming Event"}</Badge>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">{event.name}</h1>
              {event.price && (
                <p className="text-xl font-semibold">
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
          {/* Image */}
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
              <h2 className="text-2xl font-bold mb-3">Event Overview</h2>
              <p className="text-muted-foreground leading-relaxed">{event.description}</p>
            </div>

            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" /> {new Date(event.date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {event.location}
              </span>
            </div>

            <div className="flex gap-4">
              <Button size="lg" disabled>
                Tickets Not Available
              </Button>
              <Button size="lg" variant="outline">
                <Info className="mr-2 h-5 w-5" />
                More Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EventSkeleton() {
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
