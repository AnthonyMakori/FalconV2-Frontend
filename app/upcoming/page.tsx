import { Suspense } from "react"
import { getUpcomingMovies } from "@/lib/tmdb"
import MovieGrid from "@/components/movie-grid"
import { Skeleton } from "@/components/ui/skeleton"
import Pagination from "@/components/pagination"
import { Calendar } from "lucide-react"
import ScrollToTopOnMount from "@/components/scroll-to-top-on-mount"

export const metadata = {
  title: "Upcoming Movies - Cynthia Movies",
  description: "Discover upcoming movie releases",
}

export default async function UpcomingPage({
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
        <div className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl">
          <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Upcoming Movies</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Coming soon to theaters near you</p>
        </div>
      </div>

      <Suspense key={page} fallback={<UpcomingMoviesSkeleton />}>
        <UpcomingMovies page={page} />
      </Suspense>
    </div>
  )
}

async function UpcomingMovies({ page }: { page: number }) {
  const { results, total_pages, total_results } = await getUpcomingMovies(page)

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No upcoming movies found</p>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-4 sm:mb-6 text-sm sm:text-base text-muted-foreground">
        Showing {results.length} of {total_results?.toLocaleString() || "many"} upcoming movies
      </p>

      <MovieGrid movies={results} className="mb-8 sm:mb-12" />

      {total_pages && total_pages > 1 && <Pagination currentPage={page} totalPages={total_pages} baseUrl="/upcoming" />}
    </div>
  )
}

function UpcomingMoviesSkeleton() {
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
