// Enhanced API service with caching and error handling
class ApiService {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()
  private readonly baseUrl = "https://api.themoviedb.org/3"
  private readonly apiKey = "9fbedc8868a21a3e82a72025b6ace9db"

  private getCacheKey(endpoint: string, params: Record<string, string> = {}): string {
    const queryParams = new URLSearchParams({ api_key: this.apiKey, ...params })
    return `${endpoint}?${queryParams.toString()}`
  }

  private isValidCache(cacheEntry: { timestamp: number; ttl: number }): boolean {
    return Date.now() - cacheEntry.timestamp < cacheEntry.ttl
  }

  async request<T>(
    endpoint: string,
    params: Record<string, string> = {},
    ttl: number = 60 * 60 * 1000, // 1 hour default TTL
  ): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, params)

    // Check cache first
    const cached = this.cache.get(cacheKey)
    if (cached && this.isValidCache(cached)) {
      return cached.data
    }

    try {
      const queryParams = new URLSearchParams({
        api_key: this.apiKey,
        ...params,
      })

      const url = `${this.baseUrl}${endpoint}?${queryParams.toString()}`
      console.log(`Making API request to: ${url}`)

      const response = await fetch(url, {
        next: { revalidate: ttl / 1000 }, // Convert to seconds for Next.js
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })

      console.log(`API Response status: ${response.status} for ${endpoint}`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API Error Details:`, {
          status: response.status,
          statusText: response.statusText,
          url,
          response: errorText,
        })

        // Handle specific error cases
        if (response.status === 404) {
          throw new Error(`Resource not found: ${endpoint}`)
        } else if (response.status === 401) {
          throw new Error(`Unauthorized: Check your API key`)
        } else if (response.status === 429) {
          throw new Error(`Rate limit exceeded. Please try again later.`)
        } else {
          throw new Error(`API error: ${response.status} ${response.statusText}`)
        }
      }

      const data = await response.json()

      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        ttl,
      })

      return data
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)

      // If it's a network error, provide a more user-friendly message
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Network error: Please check your internet connection")
      }

      throw error
    }
  }

  // Clear cache for specific endpoint or all
  clearCache(endpoint?: string): void {
    if (endpoint) {
      const keysToDelete = Array.from(this.cache.keys()).filter((key) => key.startsWith(endpoint))
      keysToDelete.forEach((key) => this.cache.delete(key))
    } else {
      this.cache.clear()
    }
  }

  // Get cache statistics
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }

  // Test API connection
  async testConnection(): Promise<boolean> {
    try {
      await this.request("/configuration")
      return true
    } catch (error) {
      console.error("API connection test failed:", error)
      return false
    }
  }
}

export const apiService = new ApiService()
