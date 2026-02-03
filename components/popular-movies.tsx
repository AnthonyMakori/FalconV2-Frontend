import { getPopularMovies } from "@/lib/tmdb"
import MovieGrid from "@/components/movie-grid"
import SectionHeading from "@/components/section-heading"


export const dynamic = "force-dynamic"
export default async function PopularMovies() {
  const { results } = await getPopularMovies()

  return (
    <section className="my-8">
      <SectionHeading title="Popular Movies" description="Most watched movies by our users" viewAllHref="/popular" />
      <MovieGrid movies={results.slice(0, 5)} />
    </section>
  )
}
