import { backendApi } from "./backendApi"

export type Movie = {
  id: number
  title: string
  description: string
  poster_path: string | null
  movie_path: string | null
  trailer_path: string | null
  genre: string
  language: string
  release_year: number
  duration: number
  rental_price?: string
  purchase_price?: string
  free_preview: boolean
  preview_duration?: number
  casts: { id: number; name: string }[]
  tags: { id: number; name: string }[]
  subtitles: {
    id: number
    file_path: string
    language?: string
  }[]
}

/**
 * Fetch all movies from Laravel backend
 */
export async function getMovies(): Promise<Movie[]> {
  return backendApi.request<Movie[]>("/movies")
}

/**
 * Fetch single movie by ID (from cached list)
 */
export async function getMovieById(id: number): Promise<Movie | null> {
  const movies = await getMovies()
  return movies.find((movie) => movie.id === id) ?? null
}
