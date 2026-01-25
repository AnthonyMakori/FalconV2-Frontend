"use client"

import Image from "next/image"
import Link from "next/link"
import { Movie } from "@/lib/api-service"

interface MovieCardProps {
  movie: Movie
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movies/${movie.id}`} className="group block">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-neutral-900">
        {movie.poster_path ? (
          <Image
            src={movie.poster_path}
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
            No Poster
          </div>
        )}
      </div>

      <div className="mt-2">
        <h3 className="line-clamp-1 text-sm font-semibold text-white">
          {movie.title}
        </h3>

        {movie.release_year && (
          <p className="text-xs text-neutral-400">
            {movie.release_year}
          </p>
        )}
      </div>
    </Link>
  )
}
