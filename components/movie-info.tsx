"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, Bookmark, Share2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useFavorites } from "@/hooks/use-favorites"
import { useWatchlist } from "@/hooks/use-watchlist"
import { cn } from "@/lib/utils"
import { resolveMovieImage } from "@/lib/image"


interface MovieInfoProps {
  movie: any
}

export default function MovieInfo({ movie }: MovieInfoProps) {
  const { favorites, toggleFavorite } = useFavorites()
  const { watchlist, toggleWatchlist } = useWatchlist()
  const [isSharing, setIsSharing] = useState(false)
  

  const isFavorited = favorites.some((fav) => fav.id === movie.id)
  const isInWatchlist = watchlist.some((item) => item.id === movie.id)

  const handleShare = async () => {
    setIsSharing(true)
    try {
      if (navigator.share) {
        await navigator.share({
          title: movie.title,
          text: movie.overview,
          url: window.location.href,
        })
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href)
        // You could show a toast notification here
      }
    } catch (error) {
      console.error("Error sharing:", error)
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Poster */}
      <div className="relative aspect-[2/3] w-full max-w-sm mx-auto overflow-hidden rounded-lg shadow-lg">
        {resolveMovieImage(movie.poster_path) ? (
          <Image
            src={resolveMovieImage(movie.poster_path)!}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No poster available</span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          variant={isFavorited ? "default" : "outline"}
          size="sm"
          onClick={() => toggleFavorite(movie)}
          className="flex-1"
        >
          <Heart className={cn("h-4 w-4 mr-2", isFavorited && "fill-current")} />
          {isFavorited ? "Favorited" : "Add to Favorites"}
        </Button>

        <Button
          variant={isInWatchlist ? "default" : "outline"}
          size="sm"
          onClick={() => toggleWatchlist(movie)}
          className="flex-1"
        >
          <Bookmark className={cn("h-4 w-4 mr-2", isInWatchlist && "fill-current")} />
          {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
        </Button>

        <Button variant="outline" size="sm" onClick={handleShare} disabled={isSharing}>
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Movie details */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
          {movie.tagline && <p className="text-sm italic text-muted-foreground">{movie.tagline}</p>}
        </div>

        {/* Rating and year */}
        <div className="flex items-center gap-4">
          {movie.vote_average > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-medium">{movie.vote_average.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({movie.vote_count} votes)</span>
            </div>
          )}
          {movie.release_date && (
            <span className="text-sm text-muted-foreground">{new Date(movie.release_date).getFullYear()}</span>
          )}
        </div>

        {/* Genres */}
        {movie.genres && movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {movie.genres.map((genre: any) => (
              <Badge key={genre.id} variant="secondary" className="text-xs">
                {genre.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Overview */}
        <div>
          <h3 className="font-semibold mb-2">Overview</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{movie.overview || "No overview available."}</p>
        </div>

        {/* Additional details */}
        <div className="space-y-2 text-sm">
          {movie.runtime > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Runtime:</span>
              <span>
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </span>
            </div>
          )}

          {movie.budget > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Budget:</span>
              <span>${(movie.budget / 1000000).toFixed(1)}M</span>
            </div>
          )}

          {movie.revenue > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Revenue:</span>
              <span>${(movie.revenue / 1000000).toFixed(1)}M</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
