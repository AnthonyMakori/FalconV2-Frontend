import { apiService } from "./api-service"

/**
 * Backend response shape:
 * Movie::with(['casts','tags','subtitles'])->get()
 */
export async function getAllMovies() {
  try {
    return await apiService.request("/movies")
  } catch {
    return []
  }
}

/**
 * Trending / Popular / Recommended
 * (same data source, different UI logic)
 */
export async function getTrendingMovies() {
  return getAllMovies()
}

export async function getPopularMovies() {
  return getAllMovies()
}

export async function getRecommendedMovies() {
  return getAllMovies()
}

/**
 * Movie details
 */
export async function getMovieDetails(id: string) {
  try {
    const movies = await getAllMovies()
    return movies.find((m: any) => m.id === Number(id)) ?? null
  } catch {
    return null
  }
}

/**
 * Search movies
 */
export async function searchMovies(query: string) {
  if (!query) return []

  const movies = await getAllMovies()
  return movies.filter((m: any) =>
    m.title.toLowerCase().includes(query.toLowerCase())
  )
}

/**
 * Filter by genre
 */
export async function getMoviesByGenre(genre: string) {
  const movies = await getAllMovies()
  return movies.filter((m: any) =>
    m.genre?.toLowerCase().includes(genre.toLowerCase())
  )
}

/**
 * Now playing (status-based)
 */
export async function getNowPlayingMovies() {
  const movies = await getAllMovies()
  return movies.filter((m: any) => m.status === "published")
}
