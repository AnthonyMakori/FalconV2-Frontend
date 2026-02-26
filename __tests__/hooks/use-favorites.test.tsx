import { renderHook, act } from "@testing-library/react"
import { useFavorites } from "@/hooks/use-favorites"
import jest from "jest"

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock as any

// Mock next-auth
jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: null }),
}))

const mockMovie = {
  id: 1,
  title: "Test Movie",
  poster_path: "/test.jpg",
  vote_average: 8.5,
}

describe("useFavorites", () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
  })

  it("initializes with empty favorites", () => {
    localStorageMock.getItem.mockReturnValue(null)
    const { result } = renderHook(() => useFavorites())

    expect(result.current.favorites).toEqual([])
  })

  it("loads favorites from localStorage", () => {
    const storedFavorites = [mockMovie]
    localStorageMock.getItem.mockReturnValue(JSON.stringify(storedFavorites))

    const { result } = renderHook(() => useFavorites())

    expect(result.current.favorites).toEqual(storedFavorites)
  })

  it("adds movie to favorites", () => {
    localStorageMock.getItem.mockReturnValue("[]")
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.toggleFavorite(mockMovie)
    })

    expect(result.current.favorites).toContain(mockMovie)
    expect(localStorageMock.setItem).toHaveBeenCalledWith("Falcon-Eye-favorites", JSON.stringify([mockMovie]))
  })

  it("removes movie from favorites", () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify([mockMovie]))
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.toggleFavorite(mockMovie)
    })

    expect(result.current.favorites).not.toContain(mockMovie)
    expect(localStorageMock.setItem).toHaveBeenCalledWith("Falcon-Eye-favorites", JSON.stringify([]))
  })

  it("checks if movie is favorite", () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify([mockMovie]))
    const { result } = renderHook(() => useFavorites())

    expect(result.current.isFavorite(mockMovie.id)).toBe(true)
    expect(result.current.isFavorite(999)).toBe(false)
  })
})
