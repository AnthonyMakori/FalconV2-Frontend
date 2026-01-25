import { apiService, Movie } from "@/lib/api-service"
import MovieCard from "@/components/movie-card"

export default async function TrendingSection() {
  const movies = await apiService.getMovies()

  const trendingMovies: Movie[] = movies
    .filter((m) => m.status === "published")
    .sort(
      (a, b) =>
        new Date(b.created_at ?? "").getTime() -
        new Date(a.created_at ?? "").getTime()
    )
    .slice(0, 10)

  if (!trendingMovies.length) return null

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-white">Trending</h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {trendingMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  )
}
