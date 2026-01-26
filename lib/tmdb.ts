import { apiService } from "./api-service"
import { resolveMovieTrailer } from "@/lib/media"
import { getMovieDetails } from "@/lib/movies"
import type { Movie } from "@/lib/movies"


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

// Get movie details
// export async function getMovieDetails(id: string) {
//   try {
//     // Validate the ID
//     if (!id || id === "undefined" || id === "null") {
//       throw new Error("Invalid movie ID provided")
//     }

//     const movieId = Number.parseInt(id)
//     if (isNaN(movieId) || movieId <= 0) {
//       throw new Error("Movie ID must be a valid positive number")
//     }

//     return await apiService.request(`/movie/${movieId}`)
//   } catch (error) {
//     console.error(`Failed to fetch movie details for ID ${id}:`, error)
//     return null
//   }
// }

// Get movie credits (cast and crew) with error handling
export async function getMovieCredits(id: string) {
  try {
    // Validate the ID
    if (!id || id === "undefined" || id === "null") {
      throw new Error("Invalid movie ID provided")
    }

    const movieId = Number.parseInt(id)
    if (isNaN(movieId) || movieId <= 0) {
      throw new Error("Movie ID must be a valid positive number")
    }

    return await apiService.request(`/movie/${movieId}/credits`)
  } catch (error) {
    console.error(`Failed to fetch credits for movie ${id}:`, error)
    // Return empty credits object instead of throwing
    return {
      cast: [],
      crew: [],
    }
  }
}

  // Get movie videos
    export async function getMovieTrailer(id: string): Promise<string | null> {
      try {
        const movie = await getMovieDetails(id)

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

        const data = await apiService.request<{ results: Movie[] }>(
          `/movie/${movieId}/similar`
        )

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
    // Validate the genre ID
    if (!genreId || genreId === "undefined" || genreId === "null") {
      throw new Error("Invalid genre ID provided")
    }

    const id = Number.parseInt(genreId)
    if (isNaN(id) || id <= 0) {
      throw new Error("Genre ID must be a valid positive number")
    }

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

// Get recommended movies (enhanced algorithm)
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
    // Validate the ID
    if (!movieId || movieId === "undefined" || movieId === "null") {
      throw new Error("Invalid movie ID provided")
    }

    const id = Number.parseInt(movieId)
    if (isNaN(id) || id <= 0) {
      throw new Error("Movie ID must be a valid positive number")
    }

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

// Test API connection
// export async function testApiConnection() {
//   try {
//     return await apiService.testConnection()
//   } catch (error) {
//     console.error("API connection test failed:", error)
//     return false
//   }
// }
