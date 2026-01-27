"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Plus, ChevronRight } from "lucide-react"

import { AccessCodeModal } from "@/components/AccessCodeModal"
import { VideoPlayerModal } from "@/components/VideoPlayerModal"
import { resolveMovieImage } from "@/lib/image"
import { getMovieDetails } from "@/lib/tmdb"

interface WatchlistItem {
  id: number
  movie_id: number
  title: string
  type: string
  addedOn: string
  thumbnail?: string
  video_url: string
}

export function WatchlistTab({ watchlist }: { watchlist: WatchlistItem[] }) {
  const [selectedMovie, setSelectedMovie] = useState<WatchlistItem | null>(null)
  const [playerOpen, setPlayerOpen] = useState(false)
  const [accessModalOpen, setAccessModalOpen] = useState(false)

  // Store full movie details including poster_path
  const [movieDetails, setMovieDetails] = useState<Record<number, any>>({})

  useEffect(() => {
    const fetchDetails = async () => {
      const details: Record<number, any> = {}
      for (const item of watchlist) {
        try {
          const data = await getMovieDetails(item.movie_id.toString())
          if (data) details[item.id] = data
        } catch (err) {
          console.error(`Failed to fetch movie ${item.movie_id}:`, err)
        }
      }
      setMovieDetails(details)
    }

    if (watchlist.length > 0) fetchDetails()
  }, [watchlist])

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your Watchlist</CardTitle>
          <CardDescription>Movies and series you want to watch</CardDescription>
        </CardHeader>

        <CardContent>
          {watchlist.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Your watchlist is empty
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {watchlist.map((item) => {
                const movie = movieDetails[item.id]
                const poster = movie?.poster_path || item.thumbnail
                return (
                  <div key={item.id} className="border rounded-lg overflow-hidden">
                    <div className="relative aspect-video">
                      {poster ? (
                        <Image
                          src={resolveMovieImage(poster)!}
                          alt={item.title}
                          fill
                          className="object-cover w-full h-full"
                          sizes="100vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">
                            No poster
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setSelectedMovie(item)
                              setAccessModalOpen(true)
                            }}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Watch
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            className="text-white border-white"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-3">
                      <h4 className="font-medium truncate">{item.title}</h4>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <Badge variant="outline">{item.type}</Badge>
                        <span>Added {item.addedOn}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Browse Movies
          </Button>
          <Button variant="outline">
            View All
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>

      {selectedMovie && (
        <AccessCodeModal
          open={accessModalOpen}
          movieId={selectedMovie.movie_id}
          onClose={() => setAccessModalOpen(false)}
          onSuccess={() => {
            setAccessModalOpen(false)
            setPlayerOpen(true)
          }}
        />
      )}

      {selectedMovie && (
        <VideoPlayerModal
          open={playerOpen}
          videoUrl={selectedMovie.video_url}
          onClose={() => {
            setPlayerOpen(false)
            setSelectedMovie(null)
          }}
        />
      )}
    </>
  )
}
