"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useFavorites } from "@/hooks/use-favorites"
import MovieGrid from "@/components/movie-grid"

export default function FavoritesPage() {
  const { data: session } = useSession()
  const { favorites, isLoaded } = useFavorites()

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0)
  }, [])

  // Show loading state while data is loading
  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="p-2 sm:p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
            <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">My Favorites</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">Loading your favorite movies...</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array(10)
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
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <div className="p-2 sm:p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
          <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">My Favorites</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Movies you've marked as favorites</p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto mb-6">
            <Heart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
          <p className="text-muted-foreground mb-6">Start exploring movies and add them to your favorites!</p>
          <Button asChild>
            <Link href="/">Discover Movies</Link>
          </Button>
        </div>
      ) : (
        <div>
          <p className="mb-4 sm:mb-6 text-sm sm:text-base text-muted-foreground">
            You have {favorites.length} favorite {favorites.length === 1 ? "movie" : "movies"}
          </p>
          <MovieGrid movies={favorites} />
        </div>
      )}
    </div>
  )
}
