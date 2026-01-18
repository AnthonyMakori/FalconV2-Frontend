import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Plus, ChevronRight } from "lucide-react"

export function WatchlistTab({ watchlist }: { watchlist: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Watchlist</CardTitle>
        <CardDescription>Movies and series you want to watch</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {watchlist.map((item) => (
            <div key={item.id} className="border rounded-lg overflow-hidden">
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
                      onClick={async () => {
                        const accessCode = prompt("Enter your access code to watch this movie:");
                        if (!accessCode) return;

                        try {
                          const res = await fetch("/verify-access-code", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              access_code: accessCode,
                              movie_id: item.id,
                            }),
                          });

                          const data = await res.json();

                          if (res.ok && data.success) {
                            alert("Access granted! Enjoy the movie 🎬");
                            // Redirect or open the movie player here
                          } else {
                            alert(data.message || "Access denied.");
                          }
                        } catch (error) {
                          console.error(error);
                          alert("An error occurred. Please try again.");
                        }
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
  )
}
