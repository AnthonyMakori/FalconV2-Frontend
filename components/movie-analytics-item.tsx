"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Play, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getMovieDetails } from "@/lib/tmdb"
import { resolveMovieImage } from "@/lib/image"


interface MovieAnalyticsItemProps {
  movieId: string
  viewCount?: number
  totalTime?: number
  avgSessionTime?: number
  index: number
  maxValue: number
  showProgress?: boolean
}

export default function MovieAnalyticsItem({
  movieId,
  viewCount,
  totalTime,
  avgSessionTime,
  index,
  maxValue,
  showProgress = true,
}: MovieAnalyticsItemProps) {
  const [movie, setMovie] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true)
        const movieData = await getMovieDetails(movieId)
        setMovie(movieData)
      } catch (error) {
        console.error(`Failed to fetch movie ${movieId}:`, error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchMovie()
  }, [movieId])

  if (loading) {
    return (
      <div className="flex items-center justify-between p-3 rounded-lg border">
        <div className="flex items-center gap-3">
          <Badge variant="outline">#{index + 1}</Badge>
          <Skeleton className="h-12 w-8 rounded" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        {showProgress && <Skeleton className="h-2 w-20" />}
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="flex items-center justify-between p-3 rounded-lg border border-destructive/20">
        <div className="flex items-center gap-3">
          <Badge variant="outline">#{index + 1}</Badge>
          <div className="w-8 h-12 bg-muted rounded flex items-center justify-center">
            <span className="text-xs text-muted-foreground">?</span>
          </div>
          <div>
            <p className="font-medium text-destructive">Movie ID: {movieId}</p>
            <p className="text-sm text-muted-foreground">Failed to load details</p>
          </div>
        </div>
      </div>
    )
  }

  const progressValue = maxValue > 0 ? ((viewCount || totalTime || 0) / maxValue) * 100 : 0

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <Badge variant="outline">#{index + 1}</Badge>

       <div className="relative w-8 h-12 rounded overflow-hidden flex-shrink-0">
          {resolveMovieImage(movie.poster_path) ? (
            <Image
              src={resolveMovieImage(movie.poster_path)!}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="32px"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-xs text-muted-foreground">No poster</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{movie.title}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {movie.release_date && <span>{new Date(movie.release_date).getFullYear()}</span>}
           {movie.vote_average > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{(Number(movie.vote_average) || 0).toFixed(1)}</span>
              </div>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {viewCount && <span>{viewCount} views</span>}
            {totalTime && (
              <span>
                {viewCount && " • "}
                {Math.round(totalTime / 1000)}s total
              </span>
            )}
            {avgSessionTime && (
              <span>
                {(viewCount || totalTime) && " • "}
                {Math.round(avgSessionTime / 1000)}s avg
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {showProgress && <Progress value={progressValue} className="w-20" />}
        <Button asChild size="sm" variant="ghost">
          <Link href={`/movies/${movieId}`}>
            <Play className="h-3 w-3" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
