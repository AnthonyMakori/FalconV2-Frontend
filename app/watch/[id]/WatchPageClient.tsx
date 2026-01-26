"use client"

import { useEffect, useState } from "react"
import VideoPlayer from "@/components/video-player"
import MovieInfo from "@/components/movie-info"
import { Skeleton } from "@/components/ui/skeleton"
import { startTimeTracking, stopTimeTracking, trackMovieView } from "@/lib/analytics"
import { getMovieVideos, Video, VideoPlayerVideo } from "@/lib/tmdb"


interface WatchPageClientProps {
  movieId: string
  movie: any
}

export default function WatchPageClient({ movieId, movie }: WatchPageClientProps) {
  const [videos, setVideos] = useState<VideoPlayerVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)


  useEffect(() => {
    // Track movie view and start time tracking
    const initTracking = async () => {
      await trackMovieView(movieId)
      startTimeTracking(movieId, "watch")
    }

    initTracking()

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

    // Cleanup: stop time tracking when unmounting
    return () => {
      stopTimeTracking()
    }
  }, [movieId])

  // Stop tracking when leaving page or tab inactive
  useEffect(() => {
    const handleBeforeUnload = () => stopTimeTracking()
    const handleVisibilityChange = () => {
      if (document.hidden) stopTimeTracking()
      else startTimeTracking(movieId, "watch")
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      stopTimeTracking()
    }
  }, [movieId])

  // Auto-play the first video (trailer)
  useEffect(() => {
    if (videos.length > 0) setCurrentVideoIndex(0)
  }, [videos])

  if (loading) return <VideoPlayerSkeleton />

  if (!videos || videos.length === 0)
    return <p className="text-center text-muted-foreground">No videos available for this movie.</p>

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Video Player */}
      <div className="lg:col-span-2">
        <VideoPlayer
          videos={videos}
          currentIndex={currentVideoIndex}
          onVideoChange={setCurrentVideoIndex}
          autoPlay
        />
      </div>

      {/* Movie Info */}
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
