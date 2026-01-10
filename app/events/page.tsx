import { CalendarDays, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">🎬 Events</h1>
        <p className="text-muted-foreground mb-10">
          Discover movie premieres, exclusive screenings, and Falcon Eye Philmz events near you.
        </p>

        <div className="grid gap-6">
          {/* Placeholder Event Card */}
          <div className="rounded-2xl border p-6 text-left hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">
              Falcon Eye Movie Premiere Night
            </h3>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" /> Coming Soon
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> Nairobi, Kenya
              </span>
            </div>

            <p className="mb-4">
              Join us for an exclusive red carpet premiere featuring cast interviews and behind-the-scenes stories.
            </p>

            <Button disabled>
              Tickets Not Available Yet
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
