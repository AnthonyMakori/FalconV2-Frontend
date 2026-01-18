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
import { CreditCard, ChevronRight, Play } from "lucide-react"

import { AccessCodeModal } from "@/components/AccessCodeModal"
import { VideoPlayerModal } from "@/components/VideoPlayerModal"

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
              purchases.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border-b pb-4 last:border-0 last:pb-0"
                >
                  {item.thumbnail ? (
                    <div className="relative w-[100px] h-[60px] rounded-md overflow-hidden">
                      <img
                        src={item.thumbnail}
                        alt={item.title ?? "Movie"}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-[100px] h-[60px] bg-muted rounded-md">
                      <CreditCard className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}

                  <div className="flex-1">
                    <h4 className="font-medium">
                      {item.title ?? `Movie ID: ${item.movie_id}`}
                    </h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      {item.type && (
                        <Badge variant="outline" className="mr-2">
                          {item.type}
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

                    {/* ✅ WATCH NOW FIXED */}
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
              ))
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

      {/* ================= ACCESS CODE MODAL ================= */}
      {selectedPurchase && (
        <AccessCodeModal
          open={accessModalOpen}
          movieId={selectedPurchase.movie_id}
          onClose={() => setAccessModalOpen(false)}
          onSuccess={() => {
            setAccessModalOpen(false)
            setPlayerOpen(true)
          }}
        />
      )}

      {/* ================= VIDEO PLAYER ================= */}
      {selectedPurchase && (
        <VideoPlayerModal
          open={playerOpen}
          videoUrl={getVideoUrl(selectedPurchase.movie_id)}
          onClose={() => {
            setPlayerOpen(false)
            setSelectedPurchase(null)
          }}
        />
      )}
    </>
  )
}
