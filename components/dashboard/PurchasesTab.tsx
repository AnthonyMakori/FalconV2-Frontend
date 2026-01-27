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
import { CreditCard, ChevronRight, Play } from "lucide-react"

import { AccessCodeModal } from "@/components/AccessCodeModal"
import { VideoPlayerModal } from "@/components/VideoPlayerModal"
import { resolveMovieImage } from "@/lib/image"
import { getMovieDetails } from "@/lib/tmdb"

interface PurchaseItem {
  id: number
  movie_id: number
  title?: string
  type?: string
  amount: number
  created_at: string
  thumbnail?: string
}

export function PurchasesTab({
  purchases,
  loading,
}: {
  purchases: PurchaseItem[]
  loading: boolean
}) {
  const [selectedPurchase, setSelectedPurchase] =
    useState<PurchaseItem | null>(null)
  const [accessModalOpen, setAccessModalOpen] = useState(false)
  const [playerOpen, setPlayerOpen] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)


  // Store full movie details including poster_path
  const [movieDetails, setMovieDetails] = useState<Record<number, any>>({})

  useEffect(() => {
    const fetchDetails = async () => {
      const details: Record<number, any> = {}
      for (const item of purchases) {
        try {
          const data = await getMovieDetails(item.movie_id.toString())
          if (data) details[item.id] = data
        } catch (err) {
          console.error(`Failed to fetch movie ${item.movie_id}:`, err)
        }
      }
      setMovieDetails(details)
    }

    if (purchases.length > 0) fetchDetails()
  }, [purchases])

  // TEMP: resolve video after verification (replace with secure token endpoint)
  const getVideoUrl = (movieId: number) =>
    `${process.env.NEXT_PUBLIC_API_URL}/movies/${movieId}/stream`

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your Purchases</CardTitle>
          <CardDescription>
            Movies, series, and subscriptions you've purchased
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <p className="text-sm text-muted-foreground">
                Loading purchases...
              </p>
            ) : purchases.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No purchases yet
              </p>
            ) : (
              purchases.map((item) => {
                const movie = movieDetails[item.id]
                const poster = movie?.poster_path || item.thumbnail

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 border-b pb-4 last:border-0 last:pb-0"
                  >
                    {poster ? (
                      <div className="relative w-[100px] h-[60px] rounded-md overflow-hidden">
                        <Image
                          src={resolveMovieImage(poster)!}
                          alt={item.title ?? "Movie"}
                          fill
                          className="object-cover w-full h-full"
                          sizes="100vw"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-[100px] h-[60px] bg-muted rounded-md">
                        <CreditCard className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}

                    <div className="flex-1">
                      <h4 className="font-medium">
                        {item.title ?? movie?.title ?? `Movie ID: ${item.movie_id}`}
                      </h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        {(item.type || movie?.media_type) && (
                          <Badge variant="outline" className="mr-2">
                            {item.type || movie?.media_type}
                          </Badge>
                        )}
                        <span>
                          Purchased on{" "}
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-medium">
                        KES {Number(item.amount).toLocaleString()}
                      </div>

                      {item.type !== "Subscription" && (
                        <Button
                          variant="link"
                          size="sm"
                          className="px-0 h-auto flex items-center gap-1"
                          onClick={() => {
                            setSelectedPurchase(item)
                            setAccessModalOpen(true)
                          }}
                        >
                          <Play className="h-4 w-4" />
                          Watch now
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment Methods
          </Button>
          <Button variant="outline">
            View All Transactions
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>

   {selectedPurchase && (
        <AccessCodeModal
          open={accessModalOpen}
          movieId={selectedPurchase.movie_id}
          onClose={() => setAccessModalOpen(false)}
          onSuccess={(url) => {
            console.log("Received video URL:", url)
            setVideoUrl(url)
            setAccessModalOpen(false)
            setPlayerOpen(true)
          }}
        />
      )}

      {selectedPurchase && videoUrl && (
        <VideoPlayerModal
          open={playerOpen}
          onClose={() => {
            setPlayerOpen(false)
            setSelectedPurchase(null)
            setVideoUrl(null)
          }}
          videoUrl={videoUrl}
          title={selectedPurchase.title}
          logoSrc="/images/intro/SITE 1@3x.jpg.jpeg"
          logoDuration={3000}
        />
      )}
    </>
  )
}
