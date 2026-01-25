import MovieSection from "@/components/movie-section"

export default function UpcomingMovies() {
  return (
    <MovieSection
      title="Upcoming"
      limit={10}
      filterFn={(m) =>
        m.status === "published" &&
        Number(m.release_year) > new Date().getFullYear()
      }
      sortFn={(a, b) =>
        Number(a.release_year) - Number(b.release_year)
      }
    />
  )
}
