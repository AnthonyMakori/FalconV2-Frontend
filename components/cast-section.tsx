import Image from "next/image"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

interface CastSectionProps {
  credits:
    | {
        cast?: {
          id: number
          name: string
          character: string
          profile_path: string | null
        }[]
        crew?: {
          id: number
          name: string
          job: string
          department: string
          profile_path: string | null
        }[]
      }
    | null
    | undefined
}

export default function CastSection({ credits }: CastSectionProps) {
  // Show loading state if credits is null or undefined
  if (!credits) {
    return <CastSectionSkeleton />
  }

  const cast = credits.cast || []
  const directors = credits.crew?.filter((person) => person.job === "Director") || []

  // Don't render anything if there's no cast or crew data
  if (cast.length === 0 && directors.length === 0) {
    return null
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {directors.length > 0 && (
        <div>
          <h3 className="text-lg sm:text-xl font-semibold mb-3">{directors.length === 1 ? "Director" : "Directors"}</h3>
          <div className="flex flex-wrap gap-2">
            {directors.map((director) => (
              <div key={director.id} className="bg-muted/50 rounded-full px-3 py-1">
                <span className="text-sm font-medium">{director.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {cast.length > 0 && (
        <div>
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Cast</h3>

          {/* Mobile: Grid layout */}
          <div className="block sm:hidden">
            <div className="grid grid-cols-2 gap-3">
              {cast.slice(0, 6).map((person) => (
                <div key={person.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    {person.profile_path ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/public/assets${person.profile_path}`}                        alt={person.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">?</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{person.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{person.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: Horizontal scroll */}
          <div className="hidden sm:block">
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex space-x-4 pb-4">
                {cast.slice(0, 15).map((person) => (
                  <div key={person.id} className="w-[120px] sm:w-[140px] lg:w-[160px] shrink-0 space-y-2">
                    <div className="overflow-hidden rounded-lg bg-muted">
                      {person.profile_path ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}/public/assets${person.profile_path}`}
                          alt={person.name}
                          width={160}
                          height={240}
                          className="w-full aspect-[2/3] object-cover"
                        />
                      ) : (
                        <div className="w-full aspect-[2/3] bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground text-xs">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-sm leading-tight line-clamp-2">{person.name}</p>
                      <p className="text-xs text-muted-foreground leading-tight line-clamp-2">{person.character}</p>
                    </div>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  )
}

// Loading skeleton component
function CastSectionSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Directors skeleton */}
      <div>
        <Skeleton className="h-6 w-24 mb-3" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-full" />
        </div>
      </div>

      {/* Cast skeleton */}
      <div>
        <Skeleton className="h-6 w-16 mb-4" />

        {/* Mobile skeleton */}
        <div className="block sm:hidden">
          <div className="grid grid-cols-2 gap-3">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Desktop skeleton */}
        <div className="hidden sm:block">
          <div className="flex space-x-4 overflow-hidden">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="w-[140px] shrink-0 space-y-2">
                  <Skeleton className="w-full aspect-[2/3] rounded-lg" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
