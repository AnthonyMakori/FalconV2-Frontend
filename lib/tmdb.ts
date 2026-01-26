import { apiService } from "./api-service"
import { resolveMovieTrailer } from "@/lib/media"
import type { Movie } from "@/lib/movies"
import { getMovieDetails as getMovieDetailsFromLib } from "@/lib/movies" // renamed to avoid conflict

// Get trending movies with pagination
export async function getTrendingMovies(page = 1) {
  try {
    return await apiService.request("/trending/movie/week", { page: page.toString() })
  } catch (error) {
    console.error("Failed to fetch trending movies:", error)
    return { results: [], total_pages: 0, total_results: 0 }
  }
}

// Get popular movies with pagination
export async function getPopularMovies(page = 1) {
  try {
    return await apiService.request("/movie/popular", { page: page.toString() })
  } catch (error) {
    console.error("Failed to fetch popular movies:", error)
    return { results: [], total_pages: 0, total_results: 0 }
  }
}

// Get top rated movies with pagination
export async function getTopRatedMovies(page = 1) {
  try {
    return await apiService.request("/movie/top_rated", { page: page.toString() })
  } catch (error) {
    console.error("Failed to fetch top rated movies:", error)
    return { results: [], total_pages: 0, total_results: 0 }
  }
}

// Get upcoming movies with pagination
export async function getUpcomingMovies(page = 1) {
  try {
    return await apiService.request("/movie/upcoming", { page: page.toString() })
  } catch (error) {
    console.error("Failed to fetch upcoming movies:", error)
    return { results: [], total_pages: 0, total_results: 0 }
  }
}

// Get movie details by ID (wrapper for TS safety)
export async function getMovieDetails(id: string): Promise<Movie | null> {
  try {
    const movie = await getMovieDetailsFromLib(id) // use imported function
    return movie ?? null
  } catch (error) {
    console.error(`Failed to fetch movie details for ID ${id}:`, error)
    return null
  }
}

// Get movie credits
export async function getMovieCredits(id: string) {
  try {
    const movieId = Number(id)
    if (!movieId) throw new Error("Invalid movie ID")
    return await apiService.request(`/movie/${movieId}/credits`)
  } catch (error) {
    console.error(`Failed to fetch credits for movie ${id}:`, error)
    return { cast: [], crew: [] }
  }
}

// Get trailer for a movie
export async function getMovieTrailer(id: string): Promise<string | null> {
  try {
    const movie: Movie | null = await getMovieDetailsFromLib(id) // typed
    if (!movie?.trailer_path) return null
    return resolveMovieTrailer(movie.trailer_path)
  } catch (error) {
    console.error(`Failed to get trailer for movie ${id}:`, error)
    return null
  }
}

// Get similar movies
export async function getSimilarMovies(id: string) {
  try {
    const movieId = Number(id)
    if (!movieId) throw new Error("Invalid movie ID")
    const data = await apiService.request<{ results: Movie[] }>(`/movie/${movieId}/similar`)
    return data.results ?? []
  } catch (error) {
    console.error(`Failed to fetch similar movies for ${id}:`, error)
    return []
  }
}

// Search movies
export async function searchMovies(query: string, page = 1) {
  try {
    if (!query || query.trim().length === 0) {
      return { results: [], total_pages: 0, total_results: 0 }
    }

    return await apiService.request("/search/movie", {
      query: query.trim(),
      page: page.toString(),
      include_adult: "false",
    })
  } catch (error) {
    console.error("Failed to search movies:", error)
    return { results: [], total_pages: 0, total_results: 0 }
  }
}

// Get movie genres
export async function getGenres() {
  try {
    const data = await apiService.request<{ genres: any[] }>("/genre/movie/list")
    return data.genres ?? []
  } catch (error) {
    console.error("Failed to fetch genres:", error)
    return []
  }
}

// Get movies by genre
export async function getMoviesByGenre(genreId: string, page = 1) {
  try {
    if (!genreId || genreId === "undefined" || genreId === "null") {
      throw new Error("Invalid genre ID provided")
    }
    const id = Number(genreId)
    if (isNaN(id) || id <= 0) throw new Error("Genre ID must be a valid number")

    return await apiService.request("/discover/movie", {
      with_genres: genreId,
      page: page.toString(),
      sort_by: "popularity.desc",
    })
  } catch (error) {
    console.error(`Failed to fetch movies for genre ${genreId}:`, error)
    return { results: [], total_pages: 0, total_results: 0 }
  }
}

// Get recommended movies
export async function getRecommendedMovies() {
  try {
    return await apiService.request("/movie/popular", { page: "1" })
  } catch (error) {
    console.error("Failed to fetch recommended movies:", error)
    return { results: [] }
  }
}

// Get movie recommendations based on a movie
export async function getMovieRecommendations(movieId: string) {
  try {
    const id = Number(movieId)
    if (!id) throw new Error("Invalid movie ID")
    return await apiService.request(`/movie/${id}/recommendations`)
  } catch (error) {
    console.error(`Failed to fetch recommendations for movie ${movieId}:`, error)
    return { results: [] }
  }
}

// Get now playing movies
export async function getNowPlayingMovies() {
  try {
    return await apiService.request("/movie/now_playing")
  } catch (error) {
    console.error("Failed to fetch now playing movies:", error)
    return { results: [] }
  }
}
