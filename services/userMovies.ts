import { getMovieById } from "./movies"

// Mock user store (same as before)
const userDataStore: Record<
  string,
  {
    favorites: number[]
    watchlist: number[]
    watchHistory: number[]
  }
> = {}

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

export async function getUserWatchlist(userId: string) {
  const userData = getUserData(userId)

  const movies = await Promise.all(
    userData.watchlist.map((id) => getMovieById(id))
  )

  return movies.filter(Boolean)
}

export async function getUserFavorites(userId: string) {
  const userData = getUserData(userId)

  const movies = await Promise.all(
    userData.favorites.map((id) => getMovieById(id))
  )

  return movies.filter(Boolean)
}

export function addToWatchlist(userId: string, movieId: number) {
  const userData = getUserData(userId)
  if (!userData.watchlist.includes(movieId)) {
    userData.watchlist.push(movieId)
  }
  return userData.watchlist
}

export function addToFavorites(userId: string, movieId: number) {
  const userData = getUserData(userId)
  if (!userData.favorites.includes(movieId)) {
    userData.favorites.push(movieId)
  }
  return userData.favorites
}
