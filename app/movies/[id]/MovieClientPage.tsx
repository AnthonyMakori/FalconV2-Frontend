"use client"

import { Movie } from "@/lib/api-service"
import MovieInfo from "@/components/movie-info"
import CastSection from "@/components/cast-section"
import SimilarMoviesClient from "@/components/similar-movies-client"

interface Props {
  movie: Movie
}

export default function MovieClientPage({ movie }: Props) {
  return (
    <div className="space-y-10">
      <MovieInfo movie={movie} />

      {movie.casts && movie.casts.length > 0 && (
        <CastSection casts={movie.casts} />
      )}

      <SimilarMoviesClient movie={movie} />
    </div>
  )
}
