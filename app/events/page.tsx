"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import BuyModal from "@/components/EventBuyModal"

const API_URL = process.env.NEXT_PUBLIC_API_URL!
const IMAGE_BASE_URL = "https://api.falconeyephilmz.com"

type Event = {
  id: number
  name: string
  date: string
  poster: string
  description: string
  location: string
  type: string
  status: string
  price?: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_URL}/events`)
        if (!res.ok) throw new Error("Failed to fetch events")

        const json = await res.json()

        if (json?.data && Array.isArray(json.data)) {
          const normalizedEvents = json.data.map((event: Event) => ({
            ...event,
            poster: event.poster.startsWith("http")
              ? event.poster
              : `${IMAGE_BASE_URL}/${event.poster}`,
          }))

          setEvents(normalizedEvents)
        } else {
          setEvents([])
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  return (
    <div className="px-4 py-16">
      {/* Header */}
      <div className="text-start mb-14">
        <h1 className="text-4xl font-bold mb-4">🎬 Events</h1>
        <p className="text-muted-foreground max-w-xl">
          Discover movie premieres, exclusive screenings, and Falcon Eye Philmz events near you.
        </p>
      </div>

      {loading && (
        <p className="text-center text-muted-foreground">
          Loading events…
        </p>
      )}

      {error && (
        <p className="text-center text-red-500">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 w-full">
          {events.map((event) => (
            <div
              key={event.id}
              className="group rounded-2xl border bg-background overflow-hidden hover:shadow-xl transition flex flex-col h-[480px]"
            >
              {/* Poster */}
              <div className="relative flex-1 overflow-hidden">
                <Image
                  src={event.poster}
                  alt={event.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Event Name Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm p-4">
                  <h3 className="text-white font-semibold text-lg text-center">
                    {event.name}
                  </h3>
                </div>

                {event.price && (
                  <Badge className="absolute top-4 right-4 text-sm">
                    KES {parseFloat(event.price).toLocaleString()}
                  </Badge>
                )}
              </div>

              {/* Buttons */}
              <div className="p-6 flex gap-3">
                <Button
                  className="w-full"
                  onClick={() => router.push(`/events/${event.id}`)}
                >
                  View
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedEvent(event)
                    setIsModalOpen(true)
                  }}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Buy Ticket
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Buy Modal */}
      <BuyModal
        item={
          selectedEvent
            ? {
                id: selectedEvent.id,
                name: selectedEvent.name,
                price: selectedEvent.price
                  ? parseFloat(selectedEvent.price)
                  : 0,
              }
            : null
        }
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setSelectedEvent(null)}
      />
    </div>
  )
}
