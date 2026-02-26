import { Suspense } from "react"
import { getMoviesByGenre, getGenres } from "@/lib/tmdb"
import MovieCard from "@/components/movie-card"
import { Skeleton } from "@/components/ui/skeleton"
import Pagination from "@/components/pagination"
import ScrollToTopOnMount from "@/components/scroll-to-top-on-mount"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const genres = await getGenres()
  const genre = genres.find((g) => g.id.toString() === id)

  if (!genre) {
    return {
      title: "Category Not Found",
    }
  }

  return {
    title: `${genre.name} Movies - Falcon Eye Movies`,
    description: `Browse the best ${genre.name.toLowerCase()} movies`,
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { id } = await params
  const { page: pageParam } = await searchParams
  const page = Number.parseInt(pageParam || "1")

  const genres = await getGenres()
  const genre = genres.find((g) => g.id.toString() === id)

  if (!genre) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ScrollToTopOnMount />
        <h1 className="text-3xl font-bold mb-6">Category Not Found</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ScrollToTopOnMount />
      <h1 className="text-3xl font-bold mb-6">{genre.name} Movies</h1>

      <Suspense key={`${id}-${page}`} fallback={<CategoryResultsSkeleton />}>
        <CategoryResults genreId={id} page={page} />
      </Suspense>
    </div>
  )
}

async function CategoryResults({ genreId, page }: { genreId: string; page: number }) {
  const { results, total_pages } = await getMoviesByGenre(genreId, page)

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No movies found in this category</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        {results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {total_pages > 1 && <Pagination currentPage={page} totalPages={total_pages} baseUrl={`/categories/${genreId}`} />}
    </div>
  )
}

function CategoryResultsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array(10)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-[300px] w-full rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
    </div>
  )
}
