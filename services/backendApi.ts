// Backend API service (Laravel)
class BackendApiService {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()
  private readonly baseUrl = process.env.NEXT_PUBLIC_API_URL

  private isValidCache(entry: { timestamp: number; ttl: number }) {
    return Date.now() - entry.timestamp < entry.ttl
  }

  async request<T>(
    endpoint: string,
    ttl: number = 5 * 60 * 1000 // 5 minutes
  ): Promise<T> {
    const cacheKey = endpoint

    const cached = this.cache.get(cacheKey)
    if (cached && this.isValidCache(cached)) {
      return cached.data
    }

    const url = `${this.baseUrl}${endpoint}`

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: ttl / 1000 },
    })

    if (!response.ok) {
      throw new Error(`Backend API error ${response.status}`)
    }

    const data = await response.json()

    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl,
    })

    return data
  }

  clearCache() {
    this.cache.clear()
  }
}

export const backendApi = new BackendApiService()
