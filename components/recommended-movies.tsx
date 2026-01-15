"use client"

import { useSession, signIn } from "next-auth/react"
import { useEffect, useState } from "react"
import MovieGrid from "@/components/movie-grid"
import SectionHeading from "@/components/section-heading"
import { Button } from "@/components/ui/button"
import { getPersonalizedRecommendations } from "@/lib/recommendation-service"
import { useFavorites } from "@/hooks/use-favorites"
import { useWatchlist } from "@/hooks/use-watchlist"

export default function RecommendedMovies() {
  const { data: session, status } = useSession()
  const { favorites, isLoaded: favoritesLoaded } = useFavorites()
  const { watchlist, isLoaded: watchlistLoaded } = useWatchlist()
  const [movies, setMovies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendedMovies = async () => {
      try {
        setLoading(true)

        // Wait for favorites and watchlist to load
        if (!favoritesLoaded || !watchlistLoaded) {
          return
        }

        const recommendations = await getPersonalizedRecommendations(10)
        console.log("Received recommendations:", recommendations.length)

        setMovies(recommendations)
      } catch (error) {
        console.error("Failed to fetch recommended movies:", error)
      } finally {
        setLoading(false)
      }
    }

    // Only fetch when data is loaded
    if (favoritesLoaded && watchlistLoaded) {
      fetchRecommendedMovies()
    }
  }, [favorites, watchlist, favoritesLoaded, watchlistLoaded])

  if (loading || !favoritesLoaded || !watchlistLoaded) {
    return (
      <section className="my-8">
        <SectionHeading title="Recommended For You" description="Personalized movie suggestions" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-muted rounded-lg animate-pulse" />
            ))}
        </div>
      </section>
    )
  }

  // Show sign-in prompt if no session and no local data
  if (!session && status !== "loading" && favorites.length === 0 && watchlist.length === 0) {
    return (
      <section className="my-8">
        <SectionHeading title="Recommended For You" description="Sign in to get personalized recommendations" />
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium mb-2">Get Personalized Recommendations</h3>
          <p className="text-muted-foreground mb-4">
            Sign in to track your favorite movies and get personalized recommendations
          </p>
          <Button asChild>
            <a href="/auth/signin">Sign In</a>
          </Button>
        </div>
      </section>
    )
  }

  if (movies.length > 0) {
    return (
      <section className="my-8">
        <SectionHeading
          title="Recommended For You"
          description="Based on your viewing history and preferences"
          viewAllHref="/profile"
        />
        <MovieGrid movies={movies} />
      </section>
    )
  }

  return (
    <section className="my-8">
      <SectionHeading title="Recommended For You" description="Add more movies to get better recommendations" />
      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <h3 className="text-lg font-medium mb-2">Build Your Movie Profile</h3>
        <p className="text-muted-foreground mb-4">
          Add movies to your favorites and watchlist to get personalized recommendations
        </p>
        <Button asChild>
          <a href="/trending">Discover Movies</a>
        </Button>
      </div>
    </section>
  )
}
