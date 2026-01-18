import { useState } from "react"
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

interface WatchlistItem {
  id: number
  title: string
  type: string
  addedOn: string
  thumbnail?: string
  video_url: string
}

export function WatchlistTab({ watchlist }: { watchlist: WatchlistItem[] }) {
  const [selectedMovie, setSelectedMovie] =
    useState<WatchlistItem | null>(null)

  const [accessModalOpen, setAccessModalOpen] = useState(false)
  const [playerOpen, setPlayerOpen] = useState(false)

  return (
    <>
      {/* ================= WATCHLIST ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Your Watchlist</CardTitle>
          <CardDescription>
            Movies and series you want to watch
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {watchlist.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg overflow-hidden"
              >
                <div className="relative aspect-video">
                  <img
                    src={item.thumbnail || "/placeholder.svg"}
                    alt={item.title}
                    className="object-cover w-full h-full"
                  />

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
                  <h4 className="font-medium truncate">
                    {item.title}
                  </h4>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <Badge variant="outline">{item.type}</Badge>
                    <span>Added {item.addedOn}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
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

      {/* ================= ACCESS CODE MODAL ================= */}
      {selectedMovie && (
        <AccessCodeModal
          open={accessModalOpen}
          movieId={selectedMovie.id}
          onClose={() => setAccessModalOpen(false)}
          onSuccess={() => {
            setAccessModalOpen(false)
            setPlayerOpen(true)
          }}
        />
      )}

      {/* ================= VIDEO PLAYER ================= */}
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
