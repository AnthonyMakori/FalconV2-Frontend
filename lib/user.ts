import { getMovieDetails } from "./tmdb"

// Mock user data storage (in a real app, this would be a database)
const userDataStore: Record<
  string,
  {
    favorites: number[]
    watchlist: number[]
    watchHistory: number[]
  }
> = {}

// Get or initialize user data
function getUserData(userId: string) {
  if (!userDataStore[userId]) {
    userDataStore[userId] = {
      favorites: [],
      watchlist: [],
      watchHistory: [],
    }
  }
  return userDataStore[userId]
}

// Get user's watchlist
export async function getUserWatchlist(userId: string) {
  const userData = getUserData(userId)

  // Fetch details for each movie in the watchlist
  const movies = await Promise.all(
    userData.watchlist.map(async (movieId) => {
      try {
        return await getMovieDetails(movieId.toString())
      } catch (error) {
        console.error(`Failed to fetch movie ${movieId}:`, error)
        return null
      }
    }),
  )

  return movies.filter(Boolean)
}

// Get user's favorites
export async function getUserFavorites(userId: string) {
  const userData = getUserData(userId)

  // Fetch details for each movie in favorites
  const movies = await Promise.all(
    userData.favorites.map(async (movieId) => {
      try {
        return await getMovieDetails(movieId.toString())
      } catch (error) {
        console.error(`Failed to fetch movie ${movieId}:`, error)
        return null
      }
    }),
  )

  return movies.filter(Boolean)
}

// Add movie to watchlist
export function addToWatchlist(userId: string, movieId: number) {
  const userData = getUserData(userId)
  if (!userData.watchlist.includes(movieId)) {
    userData.watchlist.push(movieId)
  }
  return userData.watchlist
}

// Remove movie from watchlist
export function removeFromWatchlist(userId: string, movieId: number) {
  const userData = getUserData(userId)
  userData.watchlist = userData.watchlist.filter((id) => id !== movieId)
  return userData.watchlist
}

// Add movie to favorites
export function addToFavorites(userId: string, movieId: number) {
  const userData = getUserData(userId)
  if (!userData.favorites.includes(movieId)) {
    userData.favorites.push(movieId)
  }
  return userData.favorites
}

// Remove movie from favorites
export function removeFromFavorites(userId: string, movieId: number) {
  const userData = getUserData(userId)
  userData.favorites = userData.favorites.filter((id) => id !== movieId)
  return userData.favorites
}

// Add movie to watch history
export function addToWatchHistory(userId: string, movieId: number) {
  const userData = getUserData(userId)
  if (!userData.watchHistory.includes(movieId)) {
    userData.watchHistory.push(movieId)
  }
  return userData.watchHistory
}

// Get recommended movies based on user preferences
export async function getRecommendedMovies(userId: string) {
  const userData = getUserData(userId)

  // If user has no favorites or watch history, return empty array
  if (userData.favorites.length === 0 && userData.watchHistory.length === 0) {
    return []
  }

  // In a real app, we would use a recommendation algorithm
  // For this demo, we'll just return similar movies to the user's first favorite
  if (userData.favorites.length > 0) {
    try {
      const movieId = userData.favorites[0]
      const { results } = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=9fbedc8868a21a3e82a72025b6ace9db`,
      ).then((res) => res.json())

      return results || []
    } catch (error) {
      console.error("Failed to fetch recommendations:", error)
      return []
    }
  }

  return []
}
