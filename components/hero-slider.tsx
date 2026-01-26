"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play, Info, ChevronLeft, ChevronRight, Heart } from "lucide-react"
import { getTrendingMovies } from "@/lib/tmdb"
import { cn } from "@/lib/utils"
import { useFavorites } from "@/hooks/use-favorites"
import { motion, AnimatePresence } from "framer-motion"
import { resolveMovieImage } from "@/lib/image"


export default function HeroSlider() {
  const [movies, setMovies] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const { favorites, toggleFavorite } = useFavorites()

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const { results } = await getTrendingMovies()
        setMovies(results.slice(0, 10))
      } catch (error) {
        console.error("Failed to fetch trending movies:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingMovies()
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length)
  }, [movies.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length)
  }, [movies.length])

  useEffect(() => {
    if (!isAutoPlaying || movies.length === 0) return

    const interval = setInterval(nextSlide, 10000)
    return () => clearInterval(interval)
  }, [nextSlide, isAutoPlaying, movies.length])

  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  if (loading) {
    return <div className="w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] bg-muted animate-pulse rounded-lg"></div>
  }

  if (movies.length === 0) {
    return null
  }

  const currentMovie = movies[currentIndex]

  return (
    <div
      className="relative w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden rounded-lg group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {resolveMovieImage(currentMovie.backdrop_path) && (
            <Image
              src={resolveMovieImage(currentMovie.backdrop_path)!}
              alt={currentMovie.title}
              fill
              className="object-cover"
              priority
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows - Hidden on mobile */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-background/20 backdrop-blur-sm rounded-full p-2 sm:p-3 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/40 hidden sm:block"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-background/20 backdrop-blur-sm rounded-full p-2 sm:p-3 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/40 hidden sm:block"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-4 sm:p-6 lg:p-12 z-10">
        <motion.div
          key={`content-${currentIndex}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-2xl lg:max-w-4xl"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-4 leading-tight">
            {currentMovie.title}
          </h1>

          <div className="flex flex-wrap items-center space-x-2 sm:space-x-4 mb-3 sm:mb-4">
            <span className="inline-flex items-center rounded-full bg-primary/20 backdrop-blur-sm px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-primary">
              ⭐ {currentMovie.vote_average.toFixed(1)}
            </span>
            <span className="text-xs sm:text-sm text-muted-foreground">
              {new Date(currentMovie.release_date).getFullYear()}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleFavorite(currentMovie)}
              className="p-1 h-auto hover:bg-background/20"
            >
              <Heart
                className={cn(
                  "h-4 w-4 sm:h-5 sm:w-5 transition-colors",
                  favorites.some((fav) => fav.id === currentMovie.id)
                    ? "fill-red-500 text-red-500"
                    : "text-muted-foreground hover:text-red-500",
                )}
              />
            </Button>
          </div>

          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-4 sm:mb-6 lg:mb-8 line-clamp-2 sm:line-clamp-3 max-w-xl lg:max-w-2xl">
            {currentMovie.overview}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90"
            >
              <Link href={`/watch/${currentMovie.id}`}>
                <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <span>Watch Trailer N N</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto backdrop-blur-sm bg-background/20 border-white/20 hover:bg-background/30"
            >
              <Link href={`/movies/${currentMovie.id}`}>
                <Info className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <span>More Info</span>
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Slide indicators */}
      <div className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 space-x-2 z-10">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              index === currentIndex ? "bg-primary w-8" : "bg-white/50 hover:bg-white/75 w-2",
            )}
          />
        ))}
      </div>


      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 sm:h-1 bg-white/20">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 10, ease: "linear" }}
          key={currentIndex}
        />
      </div>
    </div>
  )
}
