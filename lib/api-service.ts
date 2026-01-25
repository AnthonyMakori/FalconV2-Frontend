// api-service.ts
class ApiService {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()
  private readonly baseUrl = process.env.NEXT_PUBLIC_API_URL!

  private getCacheKey(endpoint: string, params: Record<string, string> = {}) {
    const queryParams = new URLSearchParams(params)
    return `${endpoint}?${queryParams.toString()}`
  }

  private isValidCache(entry: { timestamp: number; ttl: number }) {
    return Date.now() - entry.timestamp < entry.ttl
  }

  async request<T>(
    endpoint: string,
    params: Record<string, string> = {},
    ttl = 5 * 60 * 1000, // 5 mins
  ): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, params)
    const cached = this.cache.get(cacheKey)

    if (cached && this.isValidCache(cached)) {
      return cached.data
    }

    const url = `${this.baseUrl}${endpoint}?${new URLSearchParams(params)}`

    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`API error ${response.status}`)
      }

      const data = await response.json()

      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        ttl,
      })

      return data
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  clearCache() {
    this.cache.clear()
  }
}

export const apiService = new ApiService()
