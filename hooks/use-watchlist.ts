"use client"

import { useState, useEffect } from "react"

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const loadWatchlist = () => {
      try {
        const stored = localStorage.getItem("Falcon-Movies-watchlist")
        if (stored) {
          const parsedWatchlist = JSON.parse(stored)
          console.log("Loaded watchlist from localStorage:", parsedWatchlist)
          setWatchlist(parsedWatchlist)
        }
      } catch (error) {
        console.error("Failed to parse watchlist from localStorage:", error)
        setWatchlist([])
      } finally {
        setIsLoaded(true)
      }
    }

    // Only load on client side
    if (typeof window !== "undefined") {
      loadWatchlist()
    }
  }, [])

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      try {
        localStorage.setItem("Falcon-Movies-watchlist", JSON.stringify(watchlist))
        console.log("Saved watchlist to localStorage:", watchlist)
      } catch (error) {
        console.error("Failed to save watchlist to localStorage:", error)
      }
    }
  }, [watchlist, isLoaded])

  const toggleWatchlist = (movie: any) => {
    setWatchlist((prev) => {
      const exists = prev.some((item) => item.id === movie.id)
      if (exists) {
        console.log("Removing from watchlist:", movie.title)
        return prev.filter((item) => item.id !== movie.id)
      } else {
        console.log("Adding to watchlist:", movie.title)
        return [...prev, movie]
      }
    })
  }

  const isInWatchlist = (movieId: number) => {
    return watchlist.some((item) => item.id === movieId)
  }

  const addToWatchlist = (movie: any) => {
    setWatchlist((prev) => {
      const exists = prev.some((item) => item.id === movie.id)
      if (!exists) {
        console.log("Adding to watchlist:", movie.title)
        return [...prev, movie]
      }
      return prev
    })
  }

  const removeFromWatchlist = (movieId: number) => {
    setWatchlist((prev) => {
      console.log("Removing from watchlist:", movieId)
      return prev.filter((item) => item.id !== movieId)
    })
  }

  return {
    watchlist,
    toggleWatchlist,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    isLoaded,
  }
}
