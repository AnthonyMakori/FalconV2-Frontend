import { getMovie } from "../lib/movies"

export async function getUserWatchlist(userId: string) {
  const userData = getUserData(userId)

  const movies = await Promise.all(
    userData.watchlist.map(id => getMovie(id))
  )

  return movies.filter(Boolean)
}
