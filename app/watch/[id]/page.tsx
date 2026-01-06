import { notFound } from "next/navigation"
import { getMovieDetails } from "@/lib/tmdb"
import ScrollToTopOnMount from "@/components/scroll-to-top-on-mount"
import WatchPageClient from "./WatchPageClient"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const movie = await getMovieDetails(id)

  if (!movie) {
    return {
      title: "Movie Not Found",
    }
  }

  return {
    title: `Watch ${movie.title} - Cynthia Movies`,
    description: `Watch trailer and clips for ${movie.title}`,
  }
}

export default async function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const movie = await getMovieDetails(id)

  if (!movie) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ScrollToTopOnMount />
      <WatchPageClient movieId={id} movie={movie} />
    </div>
  )
}
