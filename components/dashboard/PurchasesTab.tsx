import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, ChevronRight } from "lucide-react"

export function PurchasesTab({
  purchases,
  loading,
}: {
  purchases: any[]
  loading: boolean
}) {
  return (
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
            <p className="text-sm text-muted-foreground">No purchases yet</p>
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
                      alt={item.title}
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
                  {item.type !== "Subscription" && (
                    <Button variant="link" size="sm" className="px-0 h-auto">
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
  )
}
