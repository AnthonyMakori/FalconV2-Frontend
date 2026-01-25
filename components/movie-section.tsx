import { apiService, Movie } from "@/lib/api-service"
import MovieCard from "@/components/movie-card"

interface MovieSectionProps {
  title: string
  filterFn?: (movie: Movie) => boolean
  sortFn?: (a: Movie, b: Movie) => number
  limit?: number
}

export default async function MovieSection({
  title,
  filterFn = (m) => m.status === "published",
  sortFn = (a, b) =>
    new Date(b.created_at ?? "").getTime() -
    new Date(a.created_at ?? "").getTime(),
  limit = 10,
}: MovieSectionProps) {
  const movies = await apiService.getMovies()

  const filtered = movies.filter(filterFn).sort(sortFn).slice(0, limit)

  if (!filtered.length) return null

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-white">{title}</h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {filtered.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  )
}
