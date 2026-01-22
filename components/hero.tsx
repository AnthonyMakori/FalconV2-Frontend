"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play, Info } from "lucide-react"
import { getTrendingMovies } from "@/lib/tmdb"
import { cn } from "@/lib/utils"
import { getImageUrl } from "@/lib/image"

export default function Hero() {
  const [movie, setMovie] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrendingMovie = async () => {
      try {
        const { results } = await getTrendingMovies()
        // Get a random movie from the top 5 trending movies
        const randomIndex = Math.floor(Math.random() * Math.min(5, results.length))
        setMovie(results[randomIndex])
      } catch (error) {
        console.error("Failed to fetch trending movie:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingMovie()
  }, [])

  if (loading) {
    return <div className="w-full h-[60vh] bg-muted animate-pulse rounded-lg"></div>
  }

  if (!movie) {
    return null
  }

  return (
    <div className="relative w-full h-[60vh] overflow-hidden rounded-lg">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image src={getImageUrl(movie.backdrop_path)} alt={movie.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/30" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center p-6 md:p-12 max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">{movie.title}</h1>

        <div className="flex items-center space-x-2 mb-4">
          <span className="inline-flex items-center rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary">
            {movie.vote_average.toFixed(1)} ★
          </span>
          <span className="text-sm text-muted-foreground">{new Date(movie.release_date).getFullYear()}</span>
        </div>

        <p className={cn("text-base text-muted-foreground mb-6", "line-clamp-3 md:line-clamp-4")}>{movie.overview}</p>

        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" className="gap-2">
            <Link href={`/movies/${movie.id}`}>
              <Play className="h-5 w-5" />
              <span>Watch Trailer</span>
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href={`/movies/${movie.id}`}>
              <Info className="h-5 w-5" />
              <span>More Info</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
