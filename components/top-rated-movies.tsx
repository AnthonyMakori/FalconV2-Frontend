import { getTopRatedMovies } from "@/lib/tmdb"
import MovieGrid from "@/components/movie-grid"
import SectionHeading from "@/components/section-heading"


export const dynamic = "force-dynamic"
export default async function TopRatedMovies() {
  const { results } = await getTopRatedMovies()

  return (
    <section className="my-8">
      <SectionHeading
        title="Top Rated Movies"
        description="Highest rated movies of all time"
        viewAllHref="/top-rated"
      />
      <MovieGrid movies={results.slice(0, 5)} />
    </section>
  )
}
