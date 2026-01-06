import { getUpcomingMovies } from "@/lib/tmdb"
import MovieGrid from "@/components/movie-grid"
import SectionHeading from "@/components/section-heading"

export default async function UpcomingMovies() {
  const { results } = await getUpcomingMovies()

  return (
    <section className="my-8">
      <SectionHeading title="Coming Soon" description="Upcoming movie releases" viewAllHref="/upcoming" />
      <MovieGrid movies={results.slice(0, 5)} />
    </section>
  )
}
