import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import MovieCard from "@/components/movie-card"
import jest from "jest" // Import jest to fix the undeclared variable error

const mockMovie = {
  id: 1,
  title: "Test Movie",
  poster_path: "/test-poster.jpg",
  vote_average: 8.5,
  release_date: "2023-01-01",
}

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}))

// Mock Next.js Link component
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}))

describe("MovieCard", () => {
  it("renders movie title", () => {
    render(<MovieCard movie={mockMovie} />)
    expect(screen.getByText("Test Movie")).toBeInTheDocument()
  })

  it("renders movie rating", () => {
    render(<MovieCard movie={mockMovie} />)
    expect(screen.getByText("8.5")).toBeInTheDocument()
  })

  it("renders release year", () => {
    render(<MovieCard movie={mockMovie} />)
    expect(screen.getByText("2023")).toBeInTheDocument()
  })

  it("renders poster image when poster_path is provided", () => {
    render(<MovieCard movie={mockMovie} />)
    const image = screen.getByAltText("Test Movie")
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute("src", expect.stringContaining("/test-poster.jpg"))
  })

  it("renders fallback when no poster_path", () => {
    const movieWithoutPoster = { ...mockMovie, poster_path: null }
    render(<MovieCard movie={movieWithoutPoster} />)
    expect(screen.getByText("No poster")).toBeInTheDocument()
  })

  it("links to correct movie page", () => {
    render(<MovieCard movie={mockMovie} />)
    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", "/movies/1")
  })
})
