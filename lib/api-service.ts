// FalconEye API service (TMDB REMOVED)

export interface Movie {
  id: number
  title: string
  description: string
  poster_path: string | null
  movie_path: string
  trailer_path?: string | null
  release_year?: string
  duration?: string
  genre?: string
  language?: string
  free_preview?: boolean
  preview_duration?: string
  casts?: { id: number; name: string }[]
  tags?: { id: number; name: string }[]
  subtitles?: {
    id: number
    language: string | null
    file_path: string
  }[]
}

class ApiService {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  private readonly baseUrl = "https://api.falconeyephilmz.com/api"
  private readonly storageUrl = "https://api.falconeyephilmz.com/storage"

  private isValidCache(entry: { timestamp: number; ttl: number }) {
    return Date.now() - entry.timestamp < entry.ttl
  }

  private normalizeMovie(movie: Movie): Movie {
    return {
      ...movie,
      poster_path: movie.poster_path
        ? `${this.storageUrl}/${movie.poster_path}`
        : null,
      trailer_path: movie.trailer_path
        ? `${this.storageUrl}/${movie.trailer_path}`
        : null,
    }
  }

  private cacheGet(key: string) {
    const cached = this.cache.get(key)
    if (cached && this.isValidCache(cached)) return cached.data
    return null
  }

  private cacheSet(key: string, data: any, ttl: number) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  // =========================
  // MOVIES
  // =========================

  async getMovies(ttl = 10 * 60 * 1000): Promise<Movie[]> {
    const cacheKey = "movies"

    const cached = this.cacheGet(cacheKey)
    if (cached) return cached

    const res = await fetch(`${this.baseUrl}/movies`, {
      headers: { Accept: "application/json" },
      next: { revalidate: ttl / 1000 },
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch movies (${res.status})`)
    }

    const data: Movie[] = await res.json()
    const normalized = data.map(this.normalizeMovie.bind(this))

    this.cacheSet(cacheKey, normalized, ttl)
    return normalized
  }

  async getMovieById(id: number, ttl = 10 * 60 * 1000): Promise<Movie | null> {
    const cacheKey = `movie-${id}`

    const cached = this.cacheGet(cacheKey)
    if (cached) return cached

    const movies = await this.getMovies(ttl)
    const movie = movies.find((m) => m.id === id) || null

    if (movie) {
      this.cacheSet(cacheKey, movie, ttl)
    }

    return movie
  }

  // =========================
  // CACHE CONTROL
  // =========================

  clearCache() {
    this.cache.clear()
  }
}

export const apiService = new ApiService()
