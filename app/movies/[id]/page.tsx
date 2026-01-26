import { getMovieDetails } from "@/lib/tmdb"
import MovieClientPage from "./MovieClientPage"


export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const movie = await getMovieDetails(id)

  if (!movie) {
    return {
      title: "Movie Not Found",
    }
  }

  return {
    title: `${movie.title} (${movie.release_date?.split("-")[0] ?? "Hahahaaa"}) - Falcon-Eye-Movies`,
    description: movie.overview,
  }
}

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <MovieClientPage params={{ id }} />
}
