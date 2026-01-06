"use client"

import { useEffect, useState } from "react"
import { useSession, signIn } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { User, Heart, Bookmark, Clock, Eye, TrendingUp, Star, BarChart3, Sparkles, Play } from "lucide-react"
import { useFavorites } from "@/hooks/use-favorites"
import { useWatchlist } from "@/hooks/use-watchlist"
import { getUserPreferences, getMostViewedMovies, getMostEngagedMovies } from "@/lib/analytics"
import { getPersonalizedRecommendations } from "@/lib/recommendation-service"
import MovieAnalyticsItem from "@/components/movie-analytics-item"
import { motion } from "framer-motion"
import ScrollToTopOnMount from "@/components/scroll-to-top-on-mount"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const { favorites, isLoaded: favoritesLoaded } = useFavorites()
  const { watchlist, isLoaded: watchlistLoaded } = useWatchlist()
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const loadData = async () => {
      if (!favoritesLoaded || !watchlistLoaded) return

      try {
        setLoading(true)

        // Load analytics data
        const userPrefs = getUserPreferences()
        const mostViewed = getMostViewedMovies()
        const mostEngaged = getMostEngagedMovies()

        // Load recommendations
        const recs = await getPersonalizedRecommendations(12)

        setAnalytics({
          userPrefs,
          mostViewed,
          mostEngaged,
        })
        setRecommendations(recs)
      } catch (error) {
        console.error("Failed to load profile data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [favoritesLoaded, watchlistLoaded, favorites, watchlist])

  if (status === "loading" || !favoritesLoaded || !watchlistLoaded) {
    return <ProfileSkeleton />
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <ScrollToTopOnMount />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
          <div className="p-4 bg-gradient-to-br from-primary/10 to-orange-500/10 rounded-full w-fit mx-auto mb-6">
            <User className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Welcome to Your Profile</h1>
          <p className="text-muted-foreground mb-8">
            Sign in to access your personalized movie experience, track your favorites, and get tailored
            recommendations.
          </p>
          <Button onClick={() => signIn("google")} size="lg" className="w-full">
            Sign In to Continue
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ScrollToTopOnMount />

      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-orange-500/10 to-red-500/10 rounded-2xl" />
        <div className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-4 ring-primary/20">
              <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
              <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                {session.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{session.user?.name}</h1>
              <p className="text-muted-foreground mb-4">{session.user?.email}</p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{favorites.length}</div>
                  <div className="text-sm text-muted-foreground">Favorites</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{watchlist.length}</div>
                  <div className="text-sm text-muted-foreground">Watchlist</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{analytics?.mostViewed?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Viewed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">
                    {Math.round((analytics?.userPrefs?.engagementScore || 0) * 100)}
                  </div>
                  <div className="text-sm text-muted-foreground">Engagement</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button asChild variant="outline">
                <Link href="/analytics">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Link>
              </Button>
              <Button asChild>
                <Link href="/recommendations">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get Recommendations
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="recommendations">For You</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Viewing Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-500" />
                    Viewing Activity
                  </CardTitle>
                  <CardDescription>Your movie watching patterns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Views</span>
                    <Badge variant="secondary">{analytics?.userPrefs?.viewingPatterns?.totalViews || 0}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Time Spent</span>
                    <Badge variant="secondary">
                      {Math.round((analytics?.userPrefs?.viewingPatterns?.totalTimeSpent || 0) / 60000)}m
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg. per Movie</span>
                    <Badge variant="secondary">
                      {Math.round((analytics?.userPrefs?.viewingPatterns?.avgTimePerMovie || 0) / 1000)}s
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Your Preferences
                  </CardTitle>
                  <CardDescription>Based on your activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Preferred Rating</span>
                      <Badge variant="secondary">
                        {analytics?.userPrefs?.preferredRatingRange?.[0]?.toFixed(1) || "6.0"} -{" "}
                        {analytics?.userPrefs?.preferredRatingRange?.[1]?.toFixed(1) || "10.0"} ⭐
                      </Badge>
                    </div>
                    <Progress value={((analytics?.userPrefs?.preferredRatingRange?.[1] || 10) / 10) * 100} />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Engagement Score</span>
                      <Badge variant="secondary">
                        {Math.round((analytics?.userPrefs?.engagementScore || 0) * 100)}%
                      </Badge>
                    </div>
                    <Progress value={(analytics?.userPrefs?.engagementScore || 0) * 100} />
                  </div>
                </CardContent>
              </Card>

              {/* Most Viewed */}
              {analytics?.mostViewed?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      Most Viewed
                    </CardTitle>
                    <CardDescription>Movies you return to most</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.mostViewed.slice(0, 3).map((movie: any, index: number) => (
                        <MovieAnalyticsItem
                          key={movie.movieId}
                          movieId={movie.movieId}
                          viewCount={movie.viewCount}
                          totalTime={movie.totalTime}
                          index={index}
                          maxValue={analytics.mostViewed[0]?.viewCount || 1}
                          showProgress={false}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-500" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Your latest movie interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {favorites.slice(0, 3).map((movie: any) => (
                      <div key={movie.id} className="flex items-center gap-3">
                        <Heart className="h-4 w-4 text-red-500" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{movie.title}</p>
                          <p className="text-xs text-muted-foreground">Added to favorites</p>
                        </div>
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`/movies/${movie.id}`}>
                            <Play className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                    {watchlist.slice(0, 2).map((movie: any) => (
                      <div key={movie.id} className="flex items-center gap-3">
                        <Bookmark className="h-4 w-4 text-blue-500" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{movie.title}</p>
                          <p className="text-xs text-muted-foreground">Added to watchlist</p>
                        </div>
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`/movies/${movie.id}`}>
                            <Play className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Your Favorites ({favorites.length})
              </CardTitle>
              <CardDescription>Movies you've marked as favorites</CardDescription>
            </CardHeader>
            <CardContent>
              {favorites.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No favorites yet</p>
                  <Button asChild>
                    <Link href="/">Discover Movies</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {favorites.slice(0, 12).map((movie: any) => (
                    <Link key={movie.id} href={`/movies/${movie.id}`} className="group">
                      <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                        {movie.poster_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                            alt={movie.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">No poster</span>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full">
                          <Heart className="h-3 w-3 fill-current" />
                        </div>
                      </div>
                      <p className="text-sm font-medium mt-2 line-clamp-2">{movie.title}</p>
                    </Link>
                  ))}
                </div>
              )}
              {favorites.length > 12 && (
                <div className="text-center mt-6">
                  <Button asChild variant="outline">
                    <Link href="/favorites">View All Favorites</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="watchlist">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-blue-500" />
                Your Watchlist ({watchlist.length})
              </CardTitle>
              <CardDescription>Movies you want to watch later</CardDescription>
            </CardHeader>
            <CardContent>
              {watchlist.length === 0 ? (
                <div className="text-center py-8">
                  <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Your watchlist is empty</p>
                  <Button asChild>
                    <Link href="/">Browse Movies</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {watchlist.slice(0, 12).map((movie: any) => (
                    <Link key={movie.id} href={`/movies/${movie.id}`} className="group">
                      <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                        {movie.poster_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                            alt={movie.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">No poster</span>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full">
                          <Bookmark className="h-3 w-3 fill-current" />
                        </div>
                      </div>
                      <p className="text-sm font-medium mt-2 line-clamp-2">{movie.title}</p>
                    </Link>
                  ))}
                </div>
              )}
              {watchlist.length > 12 && (
                <div className="text-center mt-6">
                  <Button asChild variant="outline">
                    <Link href="/watchlist">View All Watchlist</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                Recommended For You ({recommendations.length})
              </CardTitle>
              <CardDescription>Personalized movie suggestions based on your preferences</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {Array(12)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                </div>
              ) : recommendations.length === 0 ? (
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Add more movies to your favorites to get better recommendations
                  </p>
                  <Button asChild>
                    <Link href="/trending">Discover Movies</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {recommendations.slice(0, 12).map((movie: any) => (
                    <Link key={movie.id} href={`/movies/${movie.id}`} className="group">
                      <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                        {movie.poster_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                            alt={movie.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">No poster</span>
                          </div>
                        )}
                        <div className="absolute top-2 left-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          ✨
                        </div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="bg-black/70 text-white text-xs p-1 rounded flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {movie.vote_average?.toFixed(1)}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-medium mt-2 line-clamp-2">{movie.title}</p>
                    </Link>
                  ))}
                </div>
              )}
              {recommendations.length > 12 && (
                <div className="text-center mt-6">
                  <Button asChild variant="outline">
                    <Link href="/recommendations">View All Recommendations</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ScrollToTopOnMount />

      {/* Header Skeleton */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-muted/50 rounded-2xl" />
        <div className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Skeleton className="h-24 w-24 md:h-32 md:w-32 rounded-full" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
              <div className="grid grid-cols-4 gap-4">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="text-center space-y-2">
                      <Skeleton className="h-6 w-12 mx-auto" />
                      <Skeleton className="h-3 w-16 mx-auto" />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  )
}
