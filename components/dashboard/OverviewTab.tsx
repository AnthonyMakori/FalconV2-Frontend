"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Heart, ShoppingCart } from "lucide-react"
import { ContinueWatching } from "./ContinueWatching"
import { UpcomingEvents } from "./UpcomingEvents"
import { VideoPlayerModal } from "@/components/VideoPlayerModal"
import { resolveMovieImage } from "@/lib/image"
import { getMovieDetails } from "@/lib/tmdb"

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

  // Store full movie details for continueWatching items
  const [continueWatchingDetails, setContinueWatchingDetails] = useState<any[]>([])

  useEffect(() => {
    const fetchMovies = async () => {
      const results: any[] = []

      await Promise.all(
        continueWatching.map(async (item) => {
          try {
            const data = await getMovieDetails(item.movie_id.toString())
            if (data) results.push({ ...item, poster_path: data.poster_path })
            else results.push(item) // fallback to original item if fetch fails
          } catch (err) {
            console.error(`Failed to fetch movie ${item.movie_id}:`, err)
            results.push(item)
          }
        })
      )

      setContinueWatchingDetails(results)
    }

    if (continueWatching.length > 0) fetchMovies()
  }, [continueWatching])

  const getVideoUrl = (movieId: number) =>
    `${process.env.NEXT_PUBLIC_API_URL}/movies/${movieId}/stream`

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
            <p className="text-xs text-muted-foreground">Movies watched this month</p>
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
            <p className="text-xs text-muted-foreground">Items in your watchlist</p>
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
            <p className="text-xs text-muted-foreground">Total spent this month</p>
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
            data={continueWatchingDetails ?? []}
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
