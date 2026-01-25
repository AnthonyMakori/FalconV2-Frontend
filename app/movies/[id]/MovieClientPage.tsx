"use client"

import { useState, useEffect } from "react"
import { notFound, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getMovieDetails, getMovieCredits } from "@/lib/tmdb"
import { formatRuntime, formatCurrency } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Calendar, Clock, DollarSign, Award, Play, Info, AlertCircle } from "lucide-react"
import CastSection from "@/components/cast-section"
import MovieActions from "@/components/movie-actions"
import SimilarMoviesClient from "@/components/similar-movies-client"
import { startTimeTracking, stopTimeTracking, trackMovieView } from "@/lib/analytics"
import { resolveMovieImage } from "@/lib/image"


export default function MovieClientPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [movie, setMovie] = useState<any>(null)
  const [credits, setCredits] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Scroll to top when page loads or movie ID changes
    window.scrollTo(0, 0)
  }, [params.id])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Validate the movie ID first
        if (!params.id || params.id === "undefined" || params.id === "null") {
          setError("Invalid movie ID")
          return
        }

        const movieId = Number.parseInt(params.id)
        if (isNaN(movieId) || movieId <= 0) {
          setError("Invalid movie ID format")
          return
        }

        console.log(`Fetching movie details for ID: ${params.id}`)

        // Track movie view and start time tracking
        await trackMovieView(params.id)
        startTimeTracking(params.id, "details")

        // Fetch movie details first
        const movieData = await getMovieDetails(params.id)

        if (!movieData) {
          console.error(`Movie not found for ID: ${params.id}`)
          setError("Movie not found")
          return
        }

        console.log(`Movie data fetched successfully:`, movieData.title)
        setMovie(movieData)

        // Fetch credits separately to avoid blocking the main content
        try {
          const creditsData = await getMovieCredits(params.id)
          setCredits(creditsData)
        } catch (creditsError) {
          console.error("Failed to fetch credits:", creditsError)
          // Don't fail the whole page if credits fail
          setCredits(null)
        }
      } catch (error) {
        console.error("Failed to fetch movie data:", error)

        // Handle specific error types
        if (error instanceof Error) {
          if (error.message.includes("not found")) {
            setError("Movie not found")
          } else if (error.message.includes("Network error")) {
            setError("Network error. Please check your internet connection.")
          } else if (error.message.includes("Unauthorized")) {
            setError("API access error. Please try again later.")
          } else {
            setError(error.message)
          }
        } else {
          setError("An unexpected error occurred")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    // Cleanup function to stop time tracking when component unmounts
    return () => {
      stopTimeTracking()
    }
  }, [params.id])

  // Stop time tracking when user leaves the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      stopTimeTracking()
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopTimeTracking()
      } else if (params.id) {
        startTimeTracking(params.id, "details")
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      stopTimeTracking()
    }
  }, [params.id])

  if (isLoading) {
    return <MoviePageSkeleton />
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Error Loading Movie</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => window.location.reload()}>Try Again</Button>
            <Button asChild variant="outline">
              <Link href="/">Go Home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/trending">Browse Movies</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!movie) {
    return notFound()
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Backdrop */}
      <div className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden">
        {movie.backdrop_path && (
         <Image
          src={resolveMovieImage(movie.backdrop_path)!}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />

        {/* Mobile-first content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
          <div className="container mx-auto">
            <div className="max-w-2xl">
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-2 sm:mb-4 leading-tight">{movie.title}</h1>

              {movie.tagline && (
                <p className="text-sm sm:text-base lg:text-lg italic text-muted-foreground mb-3 sm:mb-4">
                  {movie.tagline}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                {movie.vote_average > 0 && (
                  <div className="flex items-center gap-1 bg-background/20 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-primary text-primary" />
                    <span className="text-xs sm:text-sm font-medium">{movie.vote_average.toFixed(1)}</span>
                  </div>
                )}

                {movie.release_date && (
                  <div className="flex items-center gap-1 bg-background/20 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">{new Date(movie.release_date).getFullYear()}</span>
                  </div>
                )}

                {movie.runtime > 0 && (
                  <div className="flex items-center gap-1 bg-background/20 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">{formatRuntime(movie.runtime)}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button asChild size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                  <Link href={`/watch/${movie.id}`}>
                    <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Watch Trailer
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto backdrop-blur-sm bg-background/20 border-white/20 hover:bg-background/30"
                  onClick={() => {
                    const detailsElement = document.getElementById("details")
                    if (detailsElement) {
                      detailsElement.scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                >
                  <Info className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  More Info
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8" id="details">
          {/* Poster - Hidden on mobile, shown on larger screens */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl shadow-2xl">
                {movie.poster_path ? (
                 <Image
                    src={resolveMovieImage(movie.poster_path)!}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">No poster available</span>
                  </div>
                )}
              </div>

              {/* Desktop Action Buttons */}
              <div className="mt-6 space-y-3">
                <MovieActions movie={movie} />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6 sm:space-y-8">
            {/* Mobile Poster and Actions */}
            <div className="lg:hidden">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="w-32 sm:w-40 mx-auto sm:mx-0 flex-shrink-0">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-lg">
                    {movie.poster_path ? (
                      <Image
                        src={resolveMovieImage(movie.poster_path)!}
                        alt={movie.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-xs text-muted-foreground text-center">No poster</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <MovieActions movie={movie} />
                </div>
              </div>
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre: any) => (
                  <Badge key={genre.id} variant="secondary" className="text-xs sm:text-sm">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Overview */}
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold">Overview</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {movie.overview || "No overview available."}
              </p>
            </div>

            {/* Movie Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 sm:p-6 bg-muted/50 rounded-xl">
              {movie.budget > 0 && (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Budget</p>
                  <p className="text-sm sm:text-base font-semibold">{formatCurrency(movie.budget)}</p>
                </div>
              )}

              {movie.revenue > 0 && (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Award className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Revenue</p>
                  <p className="text-sm sm:text-base font-semibold">{formatCurrency(movie.revenue)}</p>
                </div>
              )}

              {movie.vote_count > 0 && (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Votes</p>
                  <p className="text-sm sm:text-base font-semibold">{movie.vote_count.toLocaleString()}</p>
                </div>
              )}

              {movie.popularity && (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Info className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Popularity</p>
                  <p className="text-sm sm:text-base font-semibold">{Math.round(movie.popularity)}</p>
                </div>
              )}
            </div>

            {/* Cast Section - Now with proper error handling */}
            <CastSection credits={credits} />
          </div>
        </div>

        {/* Similar Movies - Now using client component */}
        <SimilarMoviesClient movieId={params.id} />
      </div>
    </div>
  )
}

function MoviePageSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <div className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] bg-muted animate-pulse">
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
          <div className="container mx-auto">
            <div className="max-w-2xl space-y-4">
              <Skeleton className="h-8 sm:h-12 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="hidden lg:block lg:col-span-1">
            <Skeleton className="aspect-[2/3] w-full rounded-xl" />
          </div>
          <div className="lg:col-span-3 space-y-6">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-18" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
