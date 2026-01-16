import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

export function UpcomingEvents({
  events = [],
  loading = false,
}: {
  events?: any[]
  loading?: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>Events you might be interested in</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming events</p>
          ) : (
            events.map((event) => (
              <div
                key={`event-${event.id}`}
                className="border-b pb-3 last:border-0 last:pb-0"
              >
                <h4 className="font-medium">{event.title}</h4>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>
                    {event.date
                      ? new Date(event.date).toLocaleDateString()
                      : "TBA"}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {event.location}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="outline" className="w-full">
          View All Events
        </Button>
      </CardFooter>
    </Card>
  )
}
