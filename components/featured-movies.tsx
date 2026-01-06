import { getTrendingMovies } from "@/lib/tmdb"
import MovieGrid from "@/components/movie-grid"
import SectionHeading from "@/components/section-heading"

export default async function FeaturedMovies() {
  const { results } = await getTrendingMovies()

  return (
    <section className="my-8">
      <SectionHeading title="Featured Movies" description="Popular movies trending this week" viewAllHref="/trending" />
      <MovieGrid movies={results.slice(0, 5)} />
    </section>
  )
}
