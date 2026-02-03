import { Suspense } from "react"
import HeroSlider from "@/components/hero-slider"
import FeaturedMovies from "@/components/featured-movies"
import PopularMovies from "@/components/popular-movies"
import TopRatedMovies from "@/components/top-rated-movies"
import UpcomingMovies from "@/components/upcoming-movies"
import { Skeleton } from "@/components/ui/skeleton"
import RecommendedMovies from "@/components/recommended-movies"
import ScrollToTopOnMount from "@/components/scroll-to-top-on-mount"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      

      <ScrollToTopOnMount />
      <HeroSlider />
      <Suspense fallback={<MoviesSectionSkeleton title="Featured Movies" />}>
        <FeaturedMovies />
      </Suspense>
      <Suspense fallback={<MoviesSectionSkeleton title="Popular Movies" />}>
        <PopularMovies />
      </Suspense>
      <Suspense fallback={<MoviesSectionSkeleton title="Top Rated Movies" />}>
        <TopRatedMovies />
      </Suspense>
      <Suspense fallback={<MoviesSectionSkeleton title="Upcoming Movies" />}>
        <UpcomingMovies />
      </Suspense>
      <Suspense fallback={<MoviesSectionSkeleton title="Recommended For You" />}>
        <RecommendedMovies />
      </Suspense>
    </div>
  )
}

function MoviesSectionSkeleton({ title }: { title: string }) {
  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-[300px] w-full rounded-lg" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
      </div>
    </section>
  )
}
