import { apiService } from "@/lib/api-service"
import MovieClientPage from "./MovieClientPage"
import { notFound } from "next/navigation"

interface PageProps {
  params: { id: string }
}

export default async function MoviePage({ params }: PageProps) {
  const movieId = Number(params.id)
  const movie = await apiService.getMovieById(movieId)

  if (!movie) notFound()

  return <MovieClientPage movie={movie} />
}
