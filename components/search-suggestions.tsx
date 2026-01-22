"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Sparkles, TrendingUp, Star, Calendar, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { getImageUrl } from "@/lib/image"

interface SearchSuggestionsProps {
  trendingMovies: any[]
  popularMovies: any[]
  onMovieSearch: (query: string) => void
}

export default function SearchSuggestions({ trendingMovies, popularMovies, onMovieSearch }: SearchSuggestionsProps) {
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null)

  const hotSearches = [
    "Marvel movies",
    "Christopher Nolan",
    "Best movies 2024",
    "Action thriller",
    "Sci-fi adventure",
    "Comedy romance",
    "Horror movies",
    "Animated films",
  ]

  const mustWatchMovies = trendingMovies.slice(0, 6).filter((movie) => movie.vote_average > 7.5)

  return (
    <div className="space-y-8">
      {/* Hot Searches */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-200/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Sparkles className="h-5 w-5" />
              </div>
              Hot Searches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {hotSearches.map((search, index) => (
                <motion.div
                  key={search}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-105"
                    onClick={() => onMovieSearch(search)}
                  >
                    #{index + 1} {search}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Must Watch */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-200/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Star className="h-5 w-5" />
              </div>
              Must Watch This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {mustWatchMovies.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onHoverStart={() => setHoveredMovie(movie.id)}
                  onHoverEnd={() => setHoveredMovie(null)}
                  className="group cursor-pointer"
                >
                  <Link href={`/movies/${movie.id}`}>
                    <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted">
                      {movie.poster_path ? (
                        <Image src={getImageUrl(movie.poster_path)} alt={movie.title} fill className="object-cover transition-transform duration-300 group-hover:scale-110" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw" />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">No poster</span>
                        </div>
                      )}

                      {/* Rating Badge */}
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        ⭐ {movie.vote_average.toFixed(1)}
                      </div>

                      {/* Hover Overlay */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredMovie === movie.id ? 1 : 0 }}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center"
                      >
                        <Button size="sm" className="bg-white/20 backdrop-blur-sm hover:bg-white/30">
                          <Play className="h-4 w-4 mr-1" />
                          Watch
                        </Button>
                      </motion.div>
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
          </CardContent>
        </Card>
      </motion.div>

      {/* Trending Now */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-200/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
              Trending Now
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingMovies.slice(0, 6).map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group"
                  onClick={() => onMovieSearch(movie.title)}
                >
                  <div className="relative w-12 h-16 flex-shrink-0 overflow-hidden rounded">
                      {movie.poster_path ? (
                      <Image src={getImageUrl(movie.poster_path)} alt={movie.title} fill className="object-cover" sizes="48px" />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                      {movie.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">{new Date(movie.release_date).getFullYear()}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{movie.vote_average.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="text-2xl font-bold text-primary/30">#{index + 1}</div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Popular Genres */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border-green-200/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Calendar className="h-5 w-5" />
              </div>
              Explore by Genre
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                { name: "Action", emoji: "💥", color: "from-red-500 to-orange-500" },
                { name: "Comedy", emoji: "😂", color: "from-yellow-500 to-orange-500" },
                { name: "Drama", emoji: "🎭", color: "from-purple-500 to-pink-500" },
                { name: "Horror", emoji: "👻", color: "from-gray-700 to-gray-900" },
                { name: "Romance", emoji: "💕", color: "from-pink-500 to-red-500" },
                { name: "Sci-Fi", emoji: "🚀", color: "from-blue-500 to-cyan-500" },
                { name: "Thriller", emoji: "🔥", color: "from-red-600 to-red-800" },
                { name: "Animation", emoji: "🎨", color: "from-green-500 to-blue-500" },
              ].map((genre, index) => (
                <motion.button
                  key={genre.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * index }}
                  onClick={() => onMovieSearch(genre.name)}
                  className={`p-4 rounded-xl bg-gradient-to-br ${genre.color} text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                >
                  <div className="text-2xl mb-2">{genre.emoji}</div>
                  <div className="text-sm font-medium">{genre.name}</div>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
