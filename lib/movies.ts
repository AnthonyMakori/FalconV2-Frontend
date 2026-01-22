import { apiService } from "./api-service"
import { Movie } from "@/types/movie"

// Get all movies
export async function getMovies(): Promise<Movie[]> {
  return apiService.request<Movie[]>("/movies")
}

// Get single movie by ID
export async function getMovie(id: number): Promise<Movie | null> {
  try {
    return await apiService.request<Movie>(`/movies/${id}`)
  } catch {
    return null
  }
}

// Search movies
export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query.trim()) return []
  return apiService.request<Movie[]>(`/movies?search=${encodeURIComponent(query)}`)
}

// Filter by genre
export async function getMoviesByGenre(genre: string): Promise<Movie[]> {
  return apiService.request<Movie[]>(`/movies?genre=${encodeURIComponent(genre)}`)
}
