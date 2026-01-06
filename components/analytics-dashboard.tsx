"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Eye, Heart, TrendingUp, Star } from "lucide-react"
import { getMostViewedMovies, getMostEngagedMovies, getUserPreferences } from "@/lib/analytics"
import { useFavorites } from "@/hooks/use-favorites"
import { useWatchlist } from "@/hooks/use-watchlist"

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { favorites } = useFavorites()
  const { watchlist } = useWatchlist()

  useEffect(() => {
    const loadAnalytics = () => {
      try {
        const mostViewed = getMostViewedMovies()
        const mostEngaged = getMostEngagedMovies()
        const userPrefs = getUserPreferences()

        setAnalytics({
          mostViewed,
          mostEngaged,
          userPrefs,
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
  }, [favorites, watchlist])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-full" />
              </CardContent>
            </Card>
          ))}
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    )
  }

  const { mostViewed, mostEngaged, userPrefs, totalFavorites, totalWatchlist } = analytics

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <Eye className="h-4 w-4 text-blue-500" />
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
              <Clock className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {Math.round((userPrefs.viewingPatterns.totalTimeSpent || 0) / 60000)}m
                </p>
                <p className="text-xs text-muted-foreground">Time Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{Math.round(userPrefs.engagementScore * 100)}</p>
                <p className="text-xs text-muted-foreground">Engagement</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Most Viewed Movies */}
      {mostViewed.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Most Viewed Movies
            </CardTitle>
            <CardDescription>Movies you've viewed the most</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mostViewed.slice(0, 5).map((movie, index) => (
                <div key={movie.movieId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <div>
                      <p className="font-medium">Movie ID: {movie.movieId}</p>
                      <p className="text-sm text-muted-foreground">
                        {movie.viewCount} views • {Math.round(movie.totalTime / 1000)}s total
                      </p>
                    </div>
                  </div>
                  <Progress value={(movie.viewCount / mostViewed[0].viewCount) * 100} className="w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Most Engaged Movies */}
      {mostEngaged.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Most Engaged Movies
            </CardTitle>
            <CardDescription>Movies you've spent the most time watching</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mostEngaged.slice(0, 5).map((movie, index) => (
                <div key={movie.movieId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <div>
                      <p className="font-medium">Movie ID: {movie.movieId}</p>
                      <p className="text-sm text-muted-foreground">
                        {Math.round(movie.totalTime / 1000)}s total • {Math.round(movie.avgSessionTime / 1000)}s avg
                      </p>
                    </div>
                  </div>
                  <Progress value={(movie.totalTime / mostEngaged[0].totalTime) * 100} className="w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Your Preferences
          </CardTitle>
          <CardDescription>Based on your viewing behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Preferred Rating Range</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {userPrefs.preferredRatingRange[0].toFixed(1)} - {userPrefs.preferredRatingRange[1].toFixed(1)} ⭐
              </Badge>
            </div>
          </div>

          {userPrefs.favoriteGenres.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Favorite Genres</p>
              <div className="flex flex-wrap gap-2">
                {userPrefs.favoriteGenres.slice(0, 5).map((genreId, index) => (
                  <Badge key={genreId} variant="outline">
                    Genre {genreId}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-sm font-medium mb-2">Viewing Patterns</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Avg. time per movie</p>
                <p className="font-medium">{Math.round((userPrefs.viewingPatterns.avgTimePerMovie || 0) / 1000)}s</p>
              </div>
              <div>
                <p className="text-muted-foreground">Daily average</p>
                <p className="font-medium">{userPrefs.viewingPatterns.averageViewsPerDay.toFixed(1)} views</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
