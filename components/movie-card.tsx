import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { getImageUrl } from "@/lib/image"

interface MovieCardProps {
  movie: {
    id: number
    title: string
    poster_path: string | null
    vote_average: number
    release_date?: string
  }
  className?: string
}

export default function MovieCard({ movie, className }: MovieCardProps) {
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : null

  return (
    <Link href={`/movies/${movie.id}`} className={cn("block group", className)}>
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg movie-card-hover bg-muted">
        {movie.poster_path ? (
          <Image
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-xs sm:text-sm text-center px-2">No poster</span>
          </div>
        )}

        {movie.vote_average > 0 && (
          <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium flex items-center gap-1 shadow-lg">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </div>

      <div className="mt-2 space-y-1">
        <h3 className="font-medium text-sm sm:text-base line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        {releaseYear && <p className="text-xs sm:text-sm text-muted-foreground">{releaseYear}</p>}
      </div>
    </Link>
  )
}
