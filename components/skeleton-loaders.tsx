import { Skeleton } from "@/components/ui/skeleton"

export function MovieCardSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-[300px] w-full rounded-lg" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}

export function MovieGridSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="relative w-full h-[70vh] overflow-hidden rounded-lg">
      <Skeleton className="absolute inset-0" />
      <div className="absolute bottom-6 left-6 space-y-4">
        <Skeleton className="h-12 w-96" />
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-20 w-80" />
        <div className="flex gap-4">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-32" />
        </div>
      </div>
    </div>
  )
}

export function MovieDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Skeleton className="aspect-[2/3] w-full max-w-md mx-auto lg:mx-0 rounded-lg" />
      </div>
      <div className="lg:col-span-2 space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  )
}

export function CastSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-32" />
      <div className="flex space-x-4 overflow-hidden">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="w-[150px] shrink-0 space-y-2">
              <Skeleton className="h-[225px] w-[150px] rounded-lg" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
      </div>
    </div>
  )
}
