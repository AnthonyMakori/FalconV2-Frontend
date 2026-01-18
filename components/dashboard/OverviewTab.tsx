import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Heart, ShoppingCart } from "lucide-react"
import { ContinueWatching } from "./ContinueWatching"
import { UpcomingEvents } from "./UpcomingEvents"
import { VideoPlayerModal } from "@/components/VideoPlayerModal"

export function OverviewTab({
  totalSpent = 0,
  continueWatching = [],
  events = [],
  eventsLoading = false,
  watchHistoryCount = 0,
  watchlistCount = 0,
}: {
  totalSpent?: number
  continueWatching?: any[]
  events?: any[]
  eventsLoading?: boolean
  watchHistoryCount?: number
  watchlistCount?: number
}) {
  const [playerOpen, setPlayerOpen] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  // TEMP FUNCTION: resolve video URL (replace with secure token endpoint)
  const getVideoUrl = (movieId: number) =>
    `${process.env.NEXT_PUBLIC_API_URL}/movies/${movieId}/stream`

  // Called when user taps Play on ContinueWatching
  const handleResume = (movieId: number) => {
    const url = getVideoUrl(movieId)
    setVideoUrl(url)
    setPlayerOpen(true)
  }

  return (
    <div className="space-y-4">
      {/* ===== Top Stats Cards ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Watch History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{watchHistoryCount}</div>
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
            <div className="text-2xl font-bold">{watchlistCount}</div>
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

      {/* ===== Continue Watching & Events ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <ContinueWatching
            data={continueWatching ?? []}
            onPlay={(movieId: number) => handleResume(movieId)}
          />
        </div>
        <UpcomingEvents events={events ?? []} loading={eventsLoading} />
      </div>

      {/* ===== VIDEO PLAYER MODAL ===== */}
      {videoUrl && (
        <VideoPlayerModal
          open={playerOpen}
          videoUrl={videoUrl}
          onClose={() => {
            setPlayerOpen(false)
            setVideoUrl(null)
          }}
        />
      )}
    </div>
  )
}
