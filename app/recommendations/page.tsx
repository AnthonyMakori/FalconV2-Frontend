"use client"

import { useEffect, useState } from "react"
import { useSession, signIn } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, RefreshCw, TrendingUp, Heart, Star } from "lucide-react"
import { getPersonalizedRecommendations } from "@/lib/recommendation-service"
import { useFavorites } from "@/hooks/use-favorites"
import { useWatchlist } from "@/hooks/use-watchlist"
import MovieGrid from "@/components/movie-grid"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ScrollToTopOnMount from "@/components/scroll-to-top-on-mount"

export default function RecommendationsPage() {
  const { data: session } = useSession()
  const { favorites, isLoaded: favoritesLoaded } = useFavorites()
  const { watchlist, isLoaded: watchlistLoaded } = useWatchlist()
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const loadRecommendations = async () => {
    if (!favoritesLoaded || !watchlistLoaded) return

    try {
      setLoading(true)
      console.log("Loading recommendations...")
      const recs = await getPersonalizedRecommendations(50) // Get more recommendations
      console.log("Loaded recommendations:", recs.length)
      setRecommendations(recs)
    } catch (error) {
      console.error("Failed to load recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecommendations()
  }, [favoritesLoaded, watchlistLoaded, favorites, watchlist])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadRecommendations()
    setRefreshing(false)
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <ScrollToTopOnMount />
        <div className="text-center max-w-md">
          <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full w-fit mx-auto mb-6">
            <Sparkles className="h-12 w-12 text-purple-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Get Personalized Recommendations</h1>
          <p className="text-muted-foreground mb-8">
            Sign in to get movie recommendations tailored to your taste based on your viewing history and preferences.
          </p>
          <Button onClick={() => signIn("google")} size="lg" className="w-full">
            Sign In to Get Recommendations
          </Button>
        </div>
      </div>
    )
  }

  if (loading || !favoritesLoaded || !watchlistLoaded) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <ScrollToTopOnMount />
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Recommendations</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">Loading your personalized suggestions...</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array(20)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-muted rounded-lg animate-pulse" />
            ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <ScrollToTopOnMount />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Recommendations</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Personalized suggestions based on your preferences
            </p>
          </div>
        </div>

        <Button onClick={handleRefresh} disabled={refreshing} variant="outline" className="w-full sm:w-auto">
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{favorites.length}</p>
                <p className="text-xs text-muted-foreground">Favorites Used</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{recommendations.length}</p>
                <p className="text-xs text-muted-foreground">Suggestions Found</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">
                  {recommendations.length > 0
                    ? (
                        recommendations.reduce((sum, movie) => sum + (movie.vote_average || 0), 0) /
                        recommendations.length
                      ).toFixed(1)
                    : "0.0"}
                </p>
                <p className="text-xs text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {recommendations.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Build Your Movie Profile
            </CardTitle>
            <CardDescription>
              Add movies to your favorites and watchlist to get personalized recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                We need more information about your movie preferences to generate recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link href="/trending">Discover Trending Movies</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/popular">Browse Popular Movies</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm sm:text-base text-muted-foreground">
              Found {recommendations.length} personalized recommendations
            </p>
            <div className="flex gap-2">
              <Badge variant="secondary">AI Powered</Badge>
              <Badge variant="outline">Updated</Badge>
            </div>
          </div>
          <MovieGrid movies={recommendations} />
        </div>
      )}
    </div>
  )
}
