import { apiService } from "@/lib/api-service"
import { jest } from "@jest/globals"

// Mock fetch
global.fetch = jest.fn()

describe("ApiService", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    apiService.clearCache()
  })

  it("makes successful API request", async () => {
    const mockResponse = { results: [{ id: 1, title: "Test Movie" }] }
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    const result = await apiService.request("/test-endpoint")

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/test-endpoint"), expect.any(Object))
    expect(result).toEqual(mockResponse)
  })

  it("caches API responses", async () => {
    const mockResponse = { results: [{ id: 1, title: "Test Movie" }] }
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    // First request
    await apiService.request("/test-endpoint")

    // Second request should use cache
    const result = await apiService.request("/test-endpoint")

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(result).toEqual(mockResponse)
  })

  it("handles API errors", async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
    })

    await expect(apiService.request("/test-endpoint")).rejects.toThrow("API error: 404 Not Found")
  })
})
