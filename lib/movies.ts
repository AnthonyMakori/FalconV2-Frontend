// lib/movies.ts
import { apiService } from "./api-service"

/**
 * Movie type based on your Laravel model + relations
 */
export interface Movie {
  id: number
  title: string
  overview: string       
  release_date: string   
  runtime: number 
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
  subtitles: {
    id: number
    file_path: string
    language?: string | null
  }[]
}

/**
 * Get all movies from backend
 */
export async function getAllMovies(): Promise<Movie[]> {
  try {
    // ✅ Explicit generic ensures no `unknown` leaks
    const movies = await apiService.request<Movie[]>("/movies")
    return movies
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
export async function getMovieDetailsOver(id: string): Promise<Movie | null> {
  try {
    // ✅ Force inference to Movie[]
    const movies: Movie[] = await getAllMovies()

    return movies.find(movie => movie.id === Number(id)) ?? null
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

  const movies: Movie[] = await getAllMovies()

  return movies.filter(movie =>
    movie.title.toLowerCase().includes(query.toLowerCase())
  )
}

/**
 * Filter movies by genre
 */
export async function getMoviesByGenre(genre: string): Promise<Movie[]> {
  const movies: Movie[] = await getAllMovies()

  return movies.filter(movie =>
    movie.genre?.toLowerCase().includes(genre.toLowerCase())
  )
}

/**
 * Now playing (status-based)
 */
export async function getNowPlayingMovies(): Promise<Movie[]> {
  const movies: Movie[] = await getAllMovies()

  return movies.filter(movie => movie.status === "published")
}
