import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play } from "lucide-react"

export function ContinueWatching({ data = [] }: { data?: any[] }) {
  if (!data.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Continue Watching</CardTitle>
          <CardDescription>Pick up where you left off</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Nothing to continue watching
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Continue Watching</CardTitle>
        <CardDescription>Pick up where you left off</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.id} className="flex gap-4">
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
                    style={{ width: `${item.progress ?? 0}%` }}
                  />
                </div>
              </div>

              <div>
                <h4 className="font-medium">{item.title}</h4>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Badge variant="outline" className="mr-2">
                    {item.type}
                  </Badge>
                  <span>{item.lastWatched}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="outline" className="w-full">
          View All History
        </Button>
      </CardFooter>
    </Card>
  )
}
