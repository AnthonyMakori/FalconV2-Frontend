"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Star } from "lucide-react"
import { resolveMovieImage } from "@/lib/image"
import { getMovieDetails } from "@/lib/tmdb"

// Helper to format time in h/m
const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return h ? `${h}h ${m}m` : `${m}m`
}

// Types
interface HistoryItem {
  id: number
  title: string
  type: string
  thumbnail?: string
  progress: number
  lastWatched: string
  duration: number
  watchedSeconds: number
  year?: number
  genres?: string[]
  rating?: number
}

interface MovieWithRating {
  id: number
  title: string
  release_date?: string
  poster_path?: string
  vote_average?: number
}

export function HistoryTab({ history }: { history: HistoryItem[] }) {
  const [historyState, setHistoryState] = useState(history)
  const [moviesData, setMoviesData] = useState<Record<number, MovieWithRating | null>>({})

  // Fetch movie details for all history items
  useEffect(() => {
    const fetchMovies = async () => {
      const data: Record<number, MovieWithRating | null> = {}
      for (const item of historyState) {
        try {
          const movie = await getMovieDetails(item.id.toString())
          data[item.id] = movie || null
        } catch (err) {
          console.error(`Failed to fetch movie ${item.title}:`, err)
          data[item.id] = null
        }
      }
      setMoviesData(data)
    }

    if (historyState.length > 0) fetchMovies()
  }, [historyState])

  const handleRemove = (id: number) => {
    setHistoryState((prev) => prev.filter((item) => item.id !== id))
  }

  const handleContinueWatching = (item: HistoryItem) => {
    alert(`Continue watching: ${item.title} from ${formatTime(item.watchedSeconds)}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Watch History</CardTitle>
        <CardDescription>Movies and series you’ve watched</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {historyState.length === 0 ? (
            <p className="text-sm text-muted-foreground">No watch history yet.</p>
          ) : (
            historyState.map((item) => {
              const movie = moviesData[item.id]
              const poster = movie?.poster_path || item.thumbnail

              return (
                <div
                  key={item.id}
                  className="flex gap-4 border-b pb-4 last:border-0 last:pb-0"
                >
                  {/* Thumbnail */}
                  <div className="relative w-[120px] h-[68px] rounded-md overflow-hidden">
                    {poster ? (
                      <Image
                        src={resolveMovieImage(poster)!}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">No poster</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-white"
                        onClick={() => alert(`Play movie: ${item.title}`)}
                      >
                        <Play className="h-8 w-8" />
                      </Button>
                    </div>

                    {/* Progress bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-1">
                    <h4 className="font-medium leading-tight">
                      {item.title}{" "}
                      {movie?.release_date && (
                        <span className="text-sm text-muted-foreground">
                          ({new Date(movie.release_date).getFullYear()})
                        </span>
                      )}
                    </h4>

                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{item.type}</Badge>
                      {item.genres?.slice(0, 2).map((g) => (
                        <span key={g}>{g}</span>
                      ))}
                      {movie?.vote_average != null && (
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-400" />
                          {movie.vote_average.toFixed(1)}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Watched {item.lastWatched} • {formatTime(item.watchedSeconds)} /{" "}
                      {formatTime(item.duration)}
                    </div>

                    {item.progress < 100 && (
                      <Button
                        variant="link"
                        size="sm"
                        className="px-0 h-auto"
                        onClick={() => handleContinueWatching(item)}
                      >
                        Continue watching
                      </Button>
                    )}
                  </div>

                  {/* Actions */}
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => alert("View Complete History")}
        >
          View Complete History
        </Button>
      </CardFooter>
    </Card>
  )
}
