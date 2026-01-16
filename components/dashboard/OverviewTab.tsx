import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Heart, ShoppingCart } from "lucide-react"
import { ContinueWatching } from "./ContinueWatching"
import { UpcomingEvents } from "./UpcomingEvents"

export function OverviewTab({
  totalSpent = 0,
  continueWatching = [],
  events = [],
  eventsLoading = false,
}: {
  totalSpent?: number
  continueWatching?: any[]
  events?: any[]
  eventsLoading?: boolean
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Watch History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Movies watched this month
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full">
              <Clock className="h-4 w-4 mr-2" />
              View History
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Watchlist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Items in your watchlist
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full">
              <Heart className="h-4 w-4 mr-2" />
              View Watchlist
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              KES {(totalSpent ?? 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total spent this month
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full">
              <ShoppingCart className="h-4 w-4 mr-2" />
              View Purchases
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <ContinueWatching data={continueWatching ?? []} />
        </div>
        <UpcomingEvents events={events ?? []} loading={eventsLoading} />
      </div>
    </div>
  )
}
