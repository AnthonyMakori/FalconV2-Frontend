"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart3, TrendingUp, Eye, Clock, Heart, Bookmark, Star, Activity, User, Sparkles } from "lucide-react"
import {
  getMostViewedMovies,
  getMostEngagedMovies,
  getUserPreferences,
  getViewingActivityOverTime,
  getGenreDistribution,
  getHourlyViewingPattern,
} from "@/lib/analytics"
import { useFavorites } from "@/hooks/use-favorites"
import { useWatchlist } from "@/hooks/use-watchlist"
import MovieAnalyticsItem from "@/components/movie-analytics-item"
import AnalyticsCharts from "@/components/analytics-charts"
import ScrollToTopOnMount from "@/components/scroll-to-top-on-mount"
import { motion } from "framer-motion"

export default function AnalyticsPage() {
  const { data: session, status } = useSession()
  const { favorites, isLoaded: favoritesLoaded } = useFavorites()
  const { watchlist, isLoaded: watchlistLoaded } = useWatchlist()
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const loadAnalytics = () => {
      if (!favoritesLoaded || !watchlistLoaded) return

      try {
        setLoading(true)

        const mostViewed = getMostViewedMovies()
        const mostEngaged = getMostEngagedMovies()
        const userPrefs = getUserPreferences()
        const viewingActivity = getViewingActivityOverTime()
        const genreDistribution = getGenreDistribution()
        const hourlyPattern = getHourlyViewingPattern()

        setAnalytics({
          mostViewed,
          mostEngaged,
          userPrefs,
          viewingActivity,
          genreDistribution,
          hourlyPattern,
          totalFavorites: favorites.length,
          totalWatchlist: watchlist.length,
        })
      } catch (error) {
        console.error("Failed to load analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [favoritesLoaded, watchlistLoaded, favorites, watchlist])

  if (status === "loading" || !favoritesLoaded || !watchlistLoaded) {
    return <AnalyticsSkeleton />
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <ScrollToTopOnMount />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
          <div className="p-4 bg-gradient-to-br from-primary/10 to-orange-500/10 rounded-full w-fit mx-auto mb-6">
            <BarChart3 className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Analytics Dashboard</h1>
          <p className="text-muted-foreground mb-8">
            Sign in to view detailed analytics about your movie watching habits, preferences, and engagement patterns.
          </p>
          <Button asChild size="lg" className="w-full">
            <Link href="/api/auth/signin">Sign In to View Analytics</Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  if (loading || !analytics) {
    return <AnalyticsSkeleton />
  }

  const {
    mostViewed,
    mostEngaged,
    userPrefs,
    viewingActivity,
    genreDistribution,
    hourlyPattern,
    totalFavorites,
    totalWatchlist,
  } = analytics

  return (
    <div className="container mx-auto px-4 py-8">
      <ScrollToTopOnMount />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Comprehensive insights into your movie watching behavior and preferences
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Link>
            </Button>
            <Button asChild>
              <Link href="/recommendations">
                <Sparkles className="h-4 w-4 mr-2" />
                Recommendations
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{totalFavorites}</p>
                <p className="text-xs text-muted-foreground">Favorites</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Bookmark className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{totalWatchlist}</p>
                <p className="text-xs text-muted-foreground">Watchlist</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{userPrefs.viewingPatterns.totalViews}</p>
                <p className="text-xs text-muted-foreground">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">
                  {Math.round((userPrefs.viewingPatterns.totalTimeSpent || 0) / 60000)}m
                </p>
                <p className="text-xs text-muted-foreground">Time Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="viewing">Viewing</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AnalyticsCharts
            viewingActivity={viewingActivity}
            genreDistribution={genreDistribution}
            hourlyPattern={hourlyPattern}
            engagementScore={userPrefs.engagementScore}
            totalViews={userPrefs.viewingPatterns.totalViews}
            totalTimeSpent={userPrefs.viewingPatterns.totalTimeSpent}
          />
        </TabsContent>

        <TabsContent value="viewing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Most Viewed Movies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-500" />
                  Most Viewed Movies
                </CardTitle>
                <CardDescription>Movies you've watched the most</CardDescription>
              </CardHeader>
              <CardContent>
                {mostViewed.length === 0 ? (
                  <div className="text-center py-8">
                    <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No viewing data yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mostViewed.slice(0, 10).map((movie: any, index: number) => (
                      <MovieAnalyticsItem
                        key={movie.movieId}
                        movieId={movie.movieId}
                        viewCount={movie.viewCount}
                        totalTime={movie.totalTime}
                        index={index}
                        maxValue={mostViewed[0]?.viewCount || 1}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Most Engaged Movies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-500" />
                  Most Engaged Movies
                </CardTitle>
                <CardDescription>Movies you've spent the most time watching</CardDescription>
              </CardHeader>
              <CardContent>
                {mostEngaged.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No engagement data yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mostEngaged.slice(0, 10).map((movie: any, index: number) => (
                      <MovieAnalyticsItem
                        key={movie.movieId}
                        movieId={movie.movieId}
                        totalTime={movie.totalTime}
                        avgSessionTime={movie.avgSessionTime}
                        index={index}
                        maxValue={mostEngaged[0]?.totalTime || 1}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rating Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Rating Preferences
                </CardTitle>
                <CardDescription>Your preferred movie rating range</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Preferred Range</span>
                    <Badge variant="secondary">
                      {userPrefs.preferredRatingRange[0].toFixed(1)} - {userPrefs.preferredRatingRange[1].toFixed(1)} ⭐
                    </Badge>
                  </div>
                  <Progress value={(userPrefs.preferredRatingRange[1] / 10) * 100} />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Minimum Rating</p>
                    <p className="font-medium">{userPrefs.preferredRatingRange[0].toFixed(1)} ⭐</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Maximum Rating</p>
                    <p className="font-medium">{userPrefs.preferredRatingRange[1].toFixed(1)} ⭐</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Viewing Patterns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-500" />
                  Viewing Patterns
                </CardTitle>
                <CardDescription>Your movie watching habits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Views</p>
                    <p className="font-medium text-lg">{userPrefs.viewingPatterns.totalViews}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Daily Average</p>
                    <p className="font-medium text-lg">{userPrefs.viewingPatterns.averageViewsPerDay.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Time</p>
                    <p className="font-medium text-lg">
                      {Math.round((userPrefs.viewingPatterns.totalTimeSpent || 0) / 60000)}m
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg per Movie</p>
                    <p className="font-medium text-lg">
                      {Math.round((userPrefs.viewingPatterns.avgTimePerMovie || 0) / 1000)}s
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Genre Preferences */}
            {genreDistribution.length > 0 && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Genre Preferences
                  </CardTitle>
                  <CardDescription>Your favorite movie genres based on activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {genreDistribution.slice(0, 10).map((genre, index) => (
                      <div key={`${genre.genre}-${index}`} className="text-center p-4 rounded-lg border">
                        <Badge variant="outline" className="mb-2">
                          #{index + 1}
                        </Badge>
                        <p className="font-medium">{genre.genre}</p>
                        <p className="text-sm text-muted-foreground">{genre.count} movies</p>
                        <p className="text-xs text-muted-foreground">{Math.round(genre.timeSpent / 60)}m watched</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Engagement Level */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-red-500" />
                  Engagement Level
                </CardTitle>
                <CardDescription>How engaged you are with movies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-500 mb-2">
                    {Math.round(userPrefs.engagementScore * 100)}%
                  </div>
                  <Progress value={userPrefs.engagementScore * 100} className="mb-4" />
                  <p className="text-sm text-muted-foreground">
                    {userPrefs.engagementScore > 0.7
                      ? "Highly Engaged"
                      : userPrefs.engagementScore > 0.4
                        ? "Moderately Engaged"
                        : "Getting Started"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Activity Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  Activity Status
                </CardTitle>
                <CardDescription>Your recent activity level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Recent Views</span>
                    <Badge variant={userPrefs.viewingPatterns.totalViews > 10 ? "default" : "secondary"}>
                      {userPrefs.viewingPatterns.totalViews > 10 ? "Active" : "Getting Started"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Favorites</span>
                    <Badge variant={totalFavorites > 5 ? "default" : "secondary"}>
                      {totalFavorites > 5 ? "Curated" : "Building"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Watchlist</span>
                    <Badge variant={totalWatchlist > 3 ? "default" : "secondary"}>
                      {totalWatchlist > 3 ? "Planned" : "Starting"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  Recommendations
                </CardTitle>
                <CardDescription>Improve your experience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  {totalFavorites < 5 && (
                    <p className="text-muted-foreground">• Add more favorites to get better recommendations</p>
                  )}
                  {userPrefs.viewingPatterns.totalViews < 10 && (
                    <p className="text-muted-foreground">• Watch more movies to improve analytics</p>
                  )}
                  {totalWatchlist < 3 && (
                    <p className="text-muted-foreground">• Build your watchlist for future viewing</p>
                  )}
                  {userPrefs.engagementScore < 0.3 && (
                    <p className="text-muted-foreground">• Spend more time exploring movie details</p>
                  )}
                  <Button asChild size="sm" className="w-full mt-4">
                    <Link href="/recommendations">Get Recommendations</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AnalyticsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ScrollToTopOnMount />

      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <div>
                    <Skeleton className="h-6 w-8 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-40 w-full" />
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  )
}
