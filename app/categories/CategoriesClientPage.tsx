import { Suspense } from "react"
import Link from "next/link"
import { getGenres } from "@/lib/tmdb"
import { Skeleton } from "@/components/ui/skeleton"
import { Film } from "lucide-react"

export default async function CategoriesClientPage() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
          <Film className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Movie Categories</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Browse movies by genre and discover new favorites
          </p>
        </div>
      </div>

      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesGrid />
      </Suspense>
    </div>
  )
}

async function CategoriesGrid() {
  const genres = await getGenres()

  if (genres.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No categories found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
      {genres.map((genre, index) => (
        <Link
          key={genre.id}
          href={`/categories/${genre.id}`}
          className="group block p-4 sm:p-6 bg-gradient-to-br from-muted/50 to-muted/30 hover:from-primary/10 hover:to-primary/5 rounded-xl border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        >
          <div className="text-center">
            <h3 className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">
              {genre.name}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  )
}

function CategoriesSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
      {Array(20)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className="h-20 sm:h-24 rounded-xl" />
        ))}
    </div>
  )
}
