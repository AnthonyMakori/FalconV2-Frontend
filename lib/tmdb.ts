const API_URL = process.env.NEXT_PUBLIC_API_URL || ""

async function fetchJSON(path: string, params: Record<string, string | number | boolean> = {}) {
  try {
    const url = new URL(path, API_URL)
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v))
    })

    const res = await fetch(url.toString(), { next: { revalidate: 60 } })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Request failed: ${res.status} ${res.statusText} - ${text}`)
    }
    return await res.json()
  } catch (err) {
    console.error(`Failed request to ${path}:`, err)
    throw err
  }
}

export async function getTrendingMovies(page = 1) {
  try {
    return await fetchJSON(`/movies`, { page })
  } catch (error) {
    console.error("Failed to fetch trending movies:", error)
    return { results: [], total_pages: 0, total_results: 0 }
  }
}

export async function getPopularMovies(page = 1) {
  try {
    return await fetchJSON(`/movies`, { page })
  } catch (error) {
    console.error("Failed to fetch popular movies:", error)
    return { results: [], total_pages: 0, total_results: 0 }
  }
}

export async function getTopRatedMovies(page = 1) {
  try {
    return await fetchJSON(`/movies`, { page })
  } catch (error) {
    console.error("Failed to fetch top rated movies:", error)
    return { results: [], total_pages: 0, total_results: 0 }
  }
}

export async function getUpcomingMovies(page = 1) {
  try {
    return await fetchJSON(`/movies`, { page })
  } catch (error) {
    console.error("Failed to fetch upcoming movies:", error)
    return { results: [], total_pages: 0, total_results: 0 }
  }
}

export async function getMovieDetails(id: string) {
  try {
    if (!id) return null
    return await fetchJSON(`/movies/${id}`)
  } catch (error) {
    console.error(`Failed to fetch movie details for ID ${id}:`, error)
    return null
  }
}

export async function getMovieCredits(id: string) {
  try {
    if (!id) return { cast: [], crew: [] }
    return await fetchJSON(`/movies/${id}/credits`)
  } catch (error) {
    console.error(`Failed to fetch credits for movie ${id}:`, error)
    return { cast: [], crew: [] }
  }
}

export async function getMovieVideos(id: string) {
  try {
    if (!id) return []
    const data = await fetchJSON(`/movies/${id}/videos`)
    return data.results || []
  } catch (error) {
    console.error(`Failed to fetch videos for movie ${id}:`, error)
    return []
  }
}

export async function getSimilarMovies(id: string) {
  try {
    if (!id) return []
    const data = await fetchJSON(`/movies/${id}/similar`)
    return data.results || []
  } catch (error) {
    console.error(`Failed to fetch similar movies for ${id}:`, error)
    return []
  }
}

export async function searchMovies(query: string, page = 1) {
  try {
    if (!query || query.trim().length === 0) return { results: [], total_pages: 0, total_results: 0 }
    return await fetchJSON(`/movies`, { q: query.trim(), page })
  } catch (error) {
    console.error("Failed to search movies:", error)
    return { results: [], total_pages: 0, total_results: 0 }
  }
}

export async function getGenres() {
  try {
    const data = await fetchJSON(`/movies/genres`)
    return data.genres || []
  } catch (error) {
    console.error("Failed to fetch genres:", error)
    return []
  }
}

export async function getMoviesByGenre(genreId: string, page = 1) {
  try {
    if (!genreId) return { results: [], total_pages: 0, total_results: 0 }
    return await fetchJSON(`/movies`, { genre: genreId, page })
  } catch (error) {
    console.error(`Failed to fetch movies for genre ${genreId}:`, error)
    return { results: [], total_pages: 0, total_results: 0 }
  }
}

export async function getRecommendedMovies() {
  try {
    return await fetchJSON(`/movies`, { page: 1 })
  } catch (error) {
    console.error("Failed to fetch recommended movies:", error)
    return { results: [] }
  }
}

export async function getMovieRecommendations(movieId: string) {
  try {
    if (!movieId) return { results: [] }
    return await fetchJSON(`/movies/${movieId}/recommendations`)
  } catch (error) {
    console.error(`Failed to fetch recommendations for movie ${movieId}:`, error)
    return { results: [] }
  }
}

export async function getNowPlayingMovies() {
  try {
    return await fetchJSON(`/movies`, { page: 1 })
  } catch (error) {
    console.error("Failed to fetch now playing movies:", error)
    return { results: [] }
  }
}

export async function testApiConnection() {
  try {
    const res = await fetch(new URL(`/movies`, API_URL).toString())
    return res.ok
  } catch (error) {
    console.error("API connection test failed:", error)
    return false
  }
}
