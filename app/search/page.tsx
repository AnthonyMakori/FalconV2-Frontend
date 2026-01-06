import { Suspense } from "react"
import { getTrendingMovies, getPopularMovies } from "@/lib/tmdb"
import SearchInterface from "@/components/search-interface"
import { Skeleton } from "@/components/ui/skeleton"
import ScrollToTopOnMount from "@/components/scroll-to-top-on-mount"

export const metadata = {
  title: "Search Movies - Cynthia Movies",
  description: "Search for movies, discover trending content, and get personalized recommendations",
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>
}) {
  const { query = "", page: pageParam = "1" } = await searchParams
  const page = Number.parseInt(pageParam)

  // Pre-fetch trending and popular movies for suggestions
  const [trendingData, popularData] = await Promise.all([getTrendingMovies(), getPopularMovies()])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <ScrollToTopOnMount />
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <Suspense fallback={<SearchPageSkeleton />}>
          <SearchInterface
            initialQuery={query}
            initialPage={page}
            trendingMovies={trendingData.results}
            popularMovies={popularData.results}
          />
        </Suspense>
      </div>
    </div>
  )
}

function SearchPageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Search bar skeleton */}
      <div className="text-center space-y-4">
        <Skeleton className="h-12 w-96 mx-auto" />
        <Skeleton className="h-6 w-64 mx-auto" />
      </div>

      {/* Suggestions skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-6 w-32" />
              <div className="grid grid-cols-3 gap-2">
                {Array(3)
                  .fill(0)
                  .map((_, j) => (
                    <Skeleton key={j} className="aspect-[2/3] rounded-lg" />
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
