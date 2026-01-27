"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart, Bookmark, Share2, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFavorites } from "@/hooks/use-favorites"
import { useWatchlist } from "@/hooks/use-watchlist"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface MovieActionsProps {
  movie: any
}

export default function MovieActions({ movie }: MovieActionsProps) {
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
        await navigator.clipboard.writeText(window.location.href)
      }
    } catch (error) {
      console.error("Error sharing:", error)
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* Primary Watch Button */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          asChild
          size="lg"
          className="w-full bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90"
        >
          <Link href={`/watch/${movie.id}`}>
            <DollarSign className="h-5 w-5 mr-2" />
            Purchase Movie
          </Link>
        </Button>
      </motion.div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-3 gap-2">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant={isFavorited ? "default" : "outline"}
            size="sm"
            onClick={() => toggleFavorite(movie)}
            className={cn("w-full", isFavorited && "bg-red-500 hover:bg-red-600 text-white")}
          >
            <Heart className={cn("h-4 w-4", isFavorited && "fill-current")} />
            <span className="sr-only sm:not-sr-only sm:ml-2">{isFavorited ? "Liked" : "Like"}</span>
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant={isInWatchlist ? "default" : "outline"}
            size="sm"
            onClick={() => toggleWatchlist(movie)}
            className={cn("w-full", isInWatchlist && "bg-blue-500 hover:bg-blue-600 text-white")}
          >
            <Bookmark className={cn("h-4 w-4", isInWatchlist && "fill-current")} />
            <span className="sr-only sm:not-sr-only sm:ml-2">{isInWatchlist ? "Saved" : "Save"}</span>
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="outline" size="sm" onClick={handleShare} disabled={isSharing} className="w-full">
            <Share2 className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:ml-2">Share</span>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
