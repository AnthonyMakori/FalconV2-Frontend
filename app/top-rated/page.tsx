import { Suspense } from "react"
import { getTopRatedMovies } from "@/lib/tmdb"
import MovieGrid from "@/components/movie-grid"
import { Skeleton } from "@/components/ui/skeleton"
import Pagination from "@/components/pagination"
import { Award } from "lucide-react"
import ScrollToTopOnMount from "@/components/scroll-to-top-on-mount"

export const metadata = {
  title: "Top Rated Movies - Cynthia Movies",
  description: "Discover the highest rated movies of all time",
}

export default async function TopRatedPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Number.parseInt(pageParam || "1")

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <ScrollToTopOnMount />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <div className="p-2 sm:p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
          <Award className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Top Rated Movies</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">The highest rated movies of all time</p>
        </div>
      </div>

      <Suspense key={page} fallback={<TopRatedMoviesSkeleton />}>
        <TopRatedMovies page={page} />
      </Suspense>
    </div>
  )
}

async function TopRatedMovies({ page }: { page: number }) {
  const { results, total_pages, total_results } = await getTopRatedMovies(page)

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No top rated movies found</p>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-4 sm:mb-6 text-sm sm:text-base text-muted-foreground">
        Showing {results.length} of {total_results?.toLocaleString() || "many"} top rated movies
      </p>

      <MovieGrid movies={results} className="mb-8 sm:mb-12" />

      {total_pages && total_pages > 1 && (
        <Pagination currentPage={page} totalPages={total_pages} baseUrl="/top-rated" />
      )}
    </div>
  )
}

function TopRatedMoviesSkeleton() {
  return (
    <div>
      <Skeleton className="h-6 w-64 mb-4 sm:mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {Array(20)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
      </div>
    </div>
  )
}
