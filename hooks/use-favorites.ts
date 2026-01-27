"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export function useFavorites() {
  const { data: session } = useSession()
  const [favorites, setFavorites] = useState<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load favorites from localStorage on mount
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const stored = localStorage.getItem("Falcon-Movies-favorites")
        if (stored) {
          const parsedFavorites = JSON.parse(stored)
          console.log("Loaded favorites from localStorage:", parsedFavorites)
          setFavorites(parsedFavorites)
        }
      } catch (error) {
        console.error("Failed to parse favorites from localStorage:", error)
        setFavorites([])
      } finally {
        setIsLoaded(true)
      }
    }

    // Only load on client side
    if (typeof window !== "undefined") {
      loadFavorites()
    }
  }, [])

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      try {
        localStorage.setItem("Falcon-Movies-favorites", JSON.stringify(favorites))
        console.log("Saved favorites to localStorage:", favorites)
      } catch (error) {
        console.error("Failed to save favorites to localStorage:", error)
      }
    }
  }, [favorites, isLoaded])

  const toggleFavorite = (movie: any) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === movie.id)
      if (exists) {
        console.log("Removing from favorites:", movie.title)
        return prev.filter((fav) => fav.id !== movie.id)
      } else {
        console.log("Adding to favorites:", movie.title)
        return [...prev, movie]
      }
    })
  }

  const isFavorite = (movieId: number) => {
    return favorites.some((fav) => fav.id === movieId)
  }

  const addToFavorites = (movie: any) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === movie.id)
      if (!exists) {
        console.log("Adding to favorites:", movie.title)
        return [...prev, movie]
      }
      return prev
    })
  }

  const removeFromFavorites = (movieId: number) => {
    setFavorites((prev) => {
      console.log("Removing from favorites:", movieId)
      return prev.filter((fav) => fav.id !== movieId)
    })
  }

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    isLoaded,
  }
}
