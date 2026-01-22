class ApiService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL!

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || "API request failed")
    }

    return res.json()
  }
}

export const apiService = new ApiService()
