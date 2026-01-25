"use client"

import { useState, useEffect } from "react"
import { getSimilarMovies } from "@/lib/tmdb"
import MovieCard from "@/components/movie-card"
import { Skeleton } from "@/components/ui/skeleton"

interface SimilarMoviesClientProps {
  movieId: string
}

export default function SimilarMoviesClient({ movieId }: SimilarMoviesClientProps) {
  const [movies, setMovies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSimilarMovies = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const similarMovies = await getSimilarMovies(movieId)
        setMovies(similarMovies.slice(0, 12))
      } catch (error) {
        console.error("Failed to fetch similar movies:", error)
        setError("Failed to load similar movies")
      } finally {
        setIsLoading(false)
      }
    }

    if (movieId) {
      fetchSimilarMovies()
    }
  }, [movieId])

  if (isLoading) {
    return <SimilarMoviesSkeleton />
  }

  if (error || !movies.length) {
    return null
  }

  return (
    <section className="mt-8 sm:mt-12">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Similar Movies</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  )
}

function SimilarMoviesSkeleton() {
  return (
    <section className="mt-8 sm:mt-12">
      <Skeleton className="h-6 sm:h-8 w-48 mb-4 sm:mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {Array(12)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
      </div>
    </section>
  )
}
