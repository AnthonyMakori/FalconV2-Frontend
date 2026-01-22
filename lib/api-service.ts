// Backend API service with caching and error handling (PUBLIC)
class ApiService {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()
  private readonly baseUrl = process.env.NEXT_PUBLIC_API_URL!

  private isValidCache(entry: { timestamp: number; ttl: number }): boolean {
    return Date.now() - entry.timestamp < entry.ttl
  }

  async request<T>(
    endpoint: string,
    options: {
      method?: string
      body?: any
    } = {},
    ttl: number = 5 * 60 * 1000 // 5 minutes
  ): Promise<T> {
    const cacheKey = endpoint

    // ✅ Cache GET requests only
    if (!options.method || options.method === "GET") {
      const cached = this.cache.get(cacheKey)
      if (cached && this.isValidCache(cached)) {
        return cached.data
      }
    }

    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: options.method ?? "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      next: { revalidate: ttl / 1000 },
    })

    if (!res.ok) {
      const errorText = await res.text()

      if (res.status === 404) {
        throw new Error("Resource not found.")
      }

      throw new Error(errorText || `API error ${res.status}`)
    }

    const data = await res.json()

    // Cache GET responses
    if (!options.method || options.method === "GET") {
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        ttl,
      })
    }

    return data
  }

  clearCache(endpoint?: string) {
    if (!endpoint) {
      this.cache.clear()
      return
    }

    for (const key of this.cache.keys()) {
      if (key.startsWith(endpoint)) {
        this.cache.delete(key)
      }
    }
  }
}

export const apiService = new ApiService()
