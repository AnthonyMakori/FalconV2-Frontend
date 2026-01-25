import { Movie } from "@/lib/api-service"

interface Props {
  movie: Movie
}

export default function MovieInfo({ movie }: Props) {
  return (
    <section className="grid gap-6 md:grid-cols-[300px_1fr]">
      <img
        src={movie.poster_path ?? "/placeholder.png"}
        alt={movie.title}
        className="rounded-lg"
      />

      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{movie.title}</h1>

        <p className="text-neutral-300">{movie.description}</p>

        <div className="flex flex-wrap gap-4 text-sm text-neutral-400">
          {movie.release_year && <span>{movie.release_year}</span>}
          {movie.duration && <span>{movie.duration} min</span>}
          {movie.language && <span>{movie.language}</span>}
          {movie.genre && <span>{movie.genre}</span>}
        </div>
      </div>
    </section>
  )
}
