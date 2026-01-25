"use client"

import { Movie, apiService } from "@/lib/api-service"
import { useEffect, useState } from "react"
import MovieCard from "@/components/movie-card"

interface Props {
  movie: Movie
}

export default function SimilarMoviesClient({ movie }: Props) {
  const [similar, setSimilar] = useState<Movie[]>([])

  useEffect(() => {
    async function load() {
      const movies = await apiService.getMovies()

      const related = movies
        .filter(
          (m) =>
            m.id !== movie.id &&
            m.status === "published" &&
            (
              m.genre === movie.genre ||
              m.tags?.some((t) =>
                movie.tags?.some((mt) => mt.id === t.id)
              )
            )
        )
        .slice(0, 8)

      setSimilar(related)
    }

    load()
  }, [movie])

  if (!similar.length) return null

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">You may also like</h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {similar.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </section>
  )
}
