"use client"

import { useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, Bookmark, Sparkles, TrendingUp, Star, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useSession, signIn } from "next-auth/react"

interface PersonalizedSectionProps {
  favorites: any[]
  watchlist: any[]
  onMovieSearch: (query: string) => void
}

export default function PersonalizedSection({ favorites, watchlist, onMovieSearch }: PersonalizedSectionProps) {
  const { data: session } = useSession()

  // Generate recommendations based on user's favorites
  const recommendations = useMemo(() => {
    if (favorites.length === 0) return []

    // Extract genres from favorites
    const favoriteGenres = new Set()
    favorites.forEach((movie) => {
      if (movie.genre_ids) {
        movie.genre_ids.forEach((genreId: number) => favoriteGenres.add(genreId))
      }
    })

    // This would typically call an API for real recommendations
    // For now, we'll return a subset of favorites as placeholder
    return favorites.slice(0, 6)
  }, [favorites])

  if (!session) {
    return (
      <div className="text-center py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
          <div className="p-6 bg-gradient-to-br from-primary/10 to-orange-500/10 rounded-2xl border border-primary/20 mb-6">
            <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Get Personalized Recommendations</h2>
            <p className="text-muted-foreground mb-6">
              Sign in to get movie recommendations based on your favorites and viewing history
            </p>
            <Button onClick={() => signIn("google")} size="lg" className="w-full">
              Sign In to Get Started
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{favorites.length}</div>
            <div className="text-sm text-muted-foreground">Favorites</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <Bookmark className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{watchlist.length}</div>
            <div className="text-sm text-muted-foreground">Watchlist</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <Sparkles className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{recommendations.length}</div>
            <div className="text-sm text-muted-foreground">Recommendations</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {favorites.length > 0
                ? (favorites.reduce((sum, movie) => sum + movie.vote_average, 0) / favorites.length).toFixed(1)
                : "0"}
            </div>
            <div className="text-sm text-muted-foreground">Avg Rating</div>
          </CardContent>
        </Card>
      </div>

      {/* From Your Watchlist */}
      {watchlist.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-200/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Bookmark className="h-5 w-5" />
                </div>
                From Your Watchlist
                <Button asChild variant="ghost" size="sm" className="ml-auto">
                  <Link href="/watchlist">View All</Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {watchlist.slice(0, 6).map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
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
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">No poster</span>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center">
                          <Button
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm hover:bg-white/30"
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-2">
                        <h3 className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
                          {movie.title}
                        </h3>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Your Favorites */}
      {favorites.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border-red-200/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <Heart className="h-5 w-5" />
                </div>
                Your Favorites
                <Button asChild variant="ghost" size="sm" className="ml-auto">
                  <Link href="/favorites">View All</Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {favorites.slice(0, 6).map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
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
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">No poster</span>
                          </div>
                        )}

                        <div className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full">
                          <Heart className="h-3 w-3 fill-current" />
                        </div>

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center">
                          <Button
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm hover:bg-white/30"
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-2">
                        <h3 className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
                          {movie.title}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{movie.vote_average.toFixed(1)}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-200/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Sparkles className="h-5 w-5" />
                </div>
                Recommended for You
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {recommendations.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
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
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">No poster</span>
                          </div>
                        )}

                        <div className="absolute top-2 left-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          ✨ Rec
                        </div>

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center">
                          <Button
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm hover:bg-white/30"
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-2">
                        <h3 className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
                          {movie.title}
                        </h3>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Empty State */}
      {favorites.length === 0 && watchlist.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
          <div className="p-6 bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl max-w-md mx-auto">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Start Building Your Collection</h3>
            <p className="text-muted-foreground mb-6">
              Add movies to your favorites and watchlist to get personalized recommendations
            </p>
            <Button onClick={() => onMovieSearch("popular movies")}>Discover Movies</Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
