import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play } from "lucide-react"

export function HistoryTab({ history }: { history: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Watch History</CardTitle>
        <CardDescription>Movies and series you've watched</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 border-b pb-4 last:border-0 last:pb-0"
            >
              <div className="relative w-[120px] h-[68px] rounded-md overflow-hidden">
                <img
                  src={item.thumbnail || "/placeholder.svg"}
                  alt={item.title}
                  className="object-cover w-full h-full"
                />

                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" className="text-white">
                    <Play className="h-8 w-8" />
                  </Button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex-1">
                <h4 className="font-medium">{item.title}</h4>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Badge variant="outline" className="mr-2">
                    {item.type}
                  </Badge>
                  <span>Watched {item.lastWatched}</span>
                </div>

                {item.progress < 100 && (
                  <Button variant="link" size="sm" className="px-0 h-auto">
                    Continue watching
                  </Button>
                )}
              </div>

              <div>
                <Button variant="ghost" size="sm">
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="outline" className="w-full">
          View Complete History
        </Button>
      </CardFooter>
    </Card>
  )
}
