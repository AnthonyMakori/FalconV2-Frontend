"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { TrendingUp, Star, Calendar, Play, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface TrendingSectionProps {
  trendingMovies: any[]
  popularMovies: any[]
}

export default function TrendingSection({ trendingMovies, popularMovies }: TrendingSectionProps) {
  const [activeCategory, setActiveCategory] = useState<"trending" | "popular">("trending")

  const currentMovies = activeCategory === "trending" ? trendingMovies : popularMovies

  return (
    <div className="space-y-6">
      {/* Category Selector */}
      <div className="flex justify-center">
        <div className="flex bg-muted rounded-lg p-1">
          <button
            onClick={() => setActiveCategory("trending")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeCategory === "trending"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <TrendingUp className="h-4 w-4 mr-2 inline" />
            Trending
          </button>
          <button
            onClick={() => setActiveCategory("popular")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeCategory === "popular"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Star className="h-4 w-4 mr-2 inline" />
            Popular
          </button>
        </div>
      </div>

      {/* Featured Movie */}
      {currentMovies[0] && (
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-[400px] sm:h-[500px] overflow-hidden rounded-2xl"
        >
          <Image
            src={`https://image.tmdb.org/t/p/original${currentMovies[0].backdrop_path}`}
            alt={currentMovies[0].title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <div className="max-w-2xl">
              <Badge className="mb-3 bg-primary/20 text-primary border-primary/30">
                #{1} {activeCategory === "trending" ? "Trending" : "Popular"}
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">{currentMovies[0].title}</h2>
              <p className="text-white/90 text-sm sm:text-base mb-4 line-clamp-3">{currentMovies[0].overview}</p>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-white text-sm">{currentMovies[0].vote_average.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-white/70" />
                  <span className="text-white/70 text-sm">{new Date(currentMovies[0].release_date).getFullYear()}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link href={`/watch/${currentMovies[0].id}`}>
                    <Play className="h-5 w-5 mr-2" />
                    Watch Trailer
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <Link href={`/movies/${currentMovies[0].id}`}>
                    <Info className="h-5 w-5 mr-2" />
                    More Info
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Movie Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {currentMovies.slice(1, 19).map((movie, index) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
            className="group"
          >
            <Link href={`/movies/${movie.id}`}>
              <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted">
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">No poster</span>
                  </div>
                )}

                {/* Ranking Badge */}
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                  #{index + 2}
                </div>

                {/* Rating Badge */}
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {movie.vote_average.toFixed(1)}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center">
                  <Button
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm hover:bg-white/30"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-2 space-y-1">
                <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                  {movie.title}
                </h3>
                <p className="text-xs text-muted-foreground">{new Date(movie.release_date).getFullYear()}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center">
        <Button asChild variant="outline" size="lg">
          <Link href={`/${activeCategory}`}>
            View All {activeCategory === "trending" ? "Trending" : "Popular"} Movies
          </Link>
        </Button>
      </div>
    </div>
  )
}
