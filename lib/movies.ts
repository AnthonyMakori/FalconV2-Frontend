import { apiService } from "./api-service"

/**
 * Movie type based on your Laravel model + relations
 */
export interface Movie {
  id: number
  title: string
  description: string
  release_year: number
  duration: number
  language: string
  genre: string
  status: string
  rental_price?: number
  purchase_price?: number
  rental_period?: number
  free_preview: boolean
  preview_duration?: number
  poster_path?: string
  trailer_path?: string
  movie_path?: string
  bunny_video_id?: string
  seo_title?: string | null
  seo_description?: string | null
  seo_keywords?: string | null
  casts: { id: number; name: string }[]
  tags: { id: number; name: string }[]
  subtitles: { id: number; file_path: string; language?: string | null }[]
}

/**
 * Get all movies from backend
 */
export async function getAllMovies(): Promise<Movie[]> {
  try {
    return await apiService.request<Movie[]>("/movies")
  } catch (error) {
    console.error("Failed to fetch all movies:", error)
    return []
  }
}

/**
 * Trending / Popular / Recommended
 * (same data source, different UI logic)
 */
export async function getTrendingMovies(): Promise<Movie[]> {
  return getAllMovies()
}

export async function getPopularMovies(): Promise<Movie[]> {
  return getAllMovies()
}

export async function getRecommendedMovies(): Promise<Movie[]> {
  return getAllMovies()
}

/**
 * Movie details by ID
 */
export async function getMovieDetails(id: string): Promise<Movie | null> {
  try {
    const movies = await getAllMovies()
    return movies.find(m => m.id === Number(id)) ?? null
  } catch (error) {
    console.error(`Failed to fetch movie details for ID ${id}:`, error)
    return null
  }
}

/**
 * Search movies by query
 */
export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query) return []

  const movies = await getAllMovies()
  return movies.filter(m =>
    m.title.toLowerCase().includes(query.toLowerCase())
  )
}

/**
 * Filter movies by genre
 */
export async function getMoviesByGenre(genre: string): Promise<Movie[]> {
  const movies = await getAllMovies()
  return movies.filter(m =>
    m.genre?.toLowerCase().includes(genre.toLowerCase())
  )
}

/**
 * Now playing (status-based)
 */
export async function getNowPlayingMovies(): Promise<Movie[]> {
  const movies = await getAllMovies()
  return movies.filter(m => m.status === "published")
}
