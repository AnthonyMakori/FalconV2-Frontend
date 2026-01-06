import AnimatedMovieCard from "@/components/animated-movie-card"

interface MovieGridProps {
  movies: any[]
  className?: string
}

export default function MovieGrid({ movies, className }: MovieGridProps) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ${className}`}>
      {movies.map((movie, index) => (
        <AnimatedMovieCard key={movie.id} movie={movie} index={index} />
      ))}
    </div>
  )
}
