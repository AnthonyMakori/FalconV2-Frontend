"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bookmark } from "lucide-react"
import { useWatchlist } from "@/hooks/use-watchlist"
import MovieGrid from "@/components/movie-grid"

export default function WatchlistPage() {
  const { data: session } = useSession()
  const { watchlist, isLoaded } = useWatchlist()

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0)
  }, [])

  // Show loading state while data is loading
  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
            <Bookmark className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">My Watchlist</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">Loading your watchlist...</p>
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
        <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
          <Bookmark className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">My Watchlist</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Movies you want to watch later</p>
        </div>
      </div>

      {watchlist.length === 0 ? (
        <div className="text-center py-12">
          <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto mb-6">
            <Bookmark className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Your watchlist is empty</h2>
          <p className="text-muted-foreground mb-6">
            Add movies to your watchlist to keep track of what you want to watch!
          </p>
          <Button asChild>
            <Link href="/">Browse Movies</Link>
          </Button>
        </div>
      ) : (
        <div>
          <p className="mb-4 sm:mb-6 text-sm sm:text-base text-muted-foreground">
            You have {watchlist.length} {watchlist.length === 1 ? "movie" : "movies"} in your watchlist
          </p>
          <MovieGrid movies={watchlist} />
        </div>
      )}
    </div>
  )
}
