"use client"

import { useEffect, useState } from "react"
import VideoPlayer from "@/components/video-player"
import MovieInfo from "@/components/movie-info"
import { Skeleton } from "@/components/ui/skeleton"
import { startTimeTracking, stopTimeTracking, trackMovieView } from "@/lib/analytics"
import { getMovieVideos } from "@/lib/tmdb"

interface WatchPageClientProps {
  movieId: string
  movie: any
}

export default function WatchPageClient({ movieId, movie }: WatchPageClientProps) {
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Track movie view and start time tracking for watch page
    const initializeTracking = async () => {
      await trackMovieView(movieId)
      startTimeTracking(movieId, "watch")
    }

    initializeTracking()

    // Fetch videos
    const fetchVideos = async () => {
      try {
        const movieVideos = await getMovieVideos(movieId)
        setVideos(movieVideos)
      } catch (error) {
        console.error("Failed to fetch videos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()

    // Cleanup function to stop time tracking when component unmounts
    return () => {
      stopTimeTracking()
    }
  }, [movieId])

  // Stop time tracking when user leaves the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      stopTimeTracking()
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopTimeTracking()
      } else {
        startTimeTracking(movieId, "watch")
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      stopTimeTracking()
    }
  }, [movieId])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">{loading ? <VideoPlayerSkeleton /> : <VideoPlayer videos={videos} />}</div>

      <div className="lg:col-span-1">
        <MovieInfo movie={movie} />
      </div>
    </div>
  )
}

function VideoPlayerSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="w-full aspect-video rounded-lg" />
      <div className="flex gap-2">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="w-32 h-20 rounded" />
          ))}
      </div>
    </div>
  )
}
