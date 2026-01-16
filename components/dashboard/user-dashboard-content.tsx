"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Clock,
  Heart,
  ShoppingCart,
  CreditCard,
  Settings,
  Bell,
  Calendar,
  Play,
  Plus,
  ChevronRight,
} from "lucide-react"
import { useSession } from "next-auth/react"

// Mock data kept as fallbacks; actual values are derived from session

// Mock data for recently watched
const recentlyWatched = [
  {
    id: 1,
    title: "The Lion King",
    type: "Movie",
    progress: 100,
    thumbnail: "/placeholder.svg?height=120&width=200",
    lastWatched: "2 hours ago",
  },
  {
    id: 2,
    title: "Queen of Katwe",
    type: "Movie",
    progress: 75,
    thumbnail: "/placeholder.svg?height=120&width=200",
    lastWatched: "Yesterday",
  },
  {
    id: 3,
    title: "Blood Diamond",
    type: "Movie",
    progress: 30,
    thumbnail: "/placeholder.svg?height=120&width=200",
    lastWatched: "3 days ago",
  },
]

// Mock data for watchlist
const watchlist = [
  {
    id: 1,
    title: "Ngori Kuruka",
    type: "Movie",
    thumbnail: "/placeholder.svg?height=120&width=200",
    addedOn: "2 days ago",
  },
  {
    id: 2,
    title: "Half of a Yellow Sun",
    type: "Movie",
    thumbnail: "/placeholder.svg?height=120&width=200",
    addedOn: "1 week ago",
  },
  {
    id: 3,
    title: "The Boy Who Harnessed the Wind",
    type: "Movie",
    thumbnail: "/placeholder.svg?height=120&width=200",
    addedOn: "2 weeks ago",
  },
]

// Mock data for purchases
const purchases = [
  {
    id: 1,
    title: "Beast of No Nation",
    type: "Movie",
    amount: "KES 350",
    date: "May 10, 2023",
    thumbnail: "/placeholder.svg?height=60&width=100",
  },
  {
    id: 2,
    title: "Sarafina",
    type: "Movie",
    amount: "KES 350",
    date: "April 28, 2023",
    thumbnail: "/placeholder.svg?height=60&width=100",
  },
  {
    id: 3,
    title: "Premium Subscription",
    type: "Subscription",
    amount: "KES 1,200",
    date: "April 1, 2023",
    thumbnail: null,
  },
]

// Mock data for upcoming events
const upcomingEvents = [
  {
    id: 1,
    title: "African Film Festival",
    date: "June 15, 2023",
    location: "Nairobi, Kenya",
  },
  {
    id: 2,
    title: "New Release: Coming Home",
    date: "May 20, 2023",
    location: "Online Premiere",
  },
]

export function UserDashboardContent() {
  const { data: session } = useSession()

  const user = {
    name: session?.user?.name ?? "John Doe",
    email: session?.user?.email ?? "john@example.com",
    avatar: session?.user?.image ?? "/placeholder.svg?height=40&width=40",
    memberSince: "Jan 2023",
    plan: "Premium",
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Member since {user.memberSince}</span>
              <span>•</span>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {user.plan}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="history">Watch History</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Watch History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Movies watched this month</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">
                  <Clock className="h-4 w-4 mr-2" />
                  View History
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Watchlist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Items in your watchlist</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">
                  <Heart className="h-4 w-4 mr-2" />
                  View Watchlist
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Purchases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">KES 2,250</div>
                <p className="text-xs text-muted-foreground">Total spent this month</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  View Purchases
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Continue Watching</CardTitle>
                  <CardDescription>Pick up where you left off</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentlyWatched.map((item) => (
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
                            <div className="h-full bg-primary" style={{ width: `${item.progress}%` }} />
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
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Events you might be interested in</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="border-b pb-3 last:border-0 last:pb-0">
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{event.date}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">{event.location}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Events
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="watchlist" className="space-y-4">
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
                          <Button size="sm" variant="secondary">
                            <Play className="h-4 w-4 mr-1" />
                            Watch
                          </Button>
                          <Button size="sm" variant="outline" className="text-white border-white">
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
        </TabsContent>
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Watch History</CardTitle>
              <CardDescription>Movies and series you've watched</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentlyWatched.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
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
                        <div className="h-full bg-primary" style={{ width: `${item.progress}%` }} />
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
        </TabsContent>
        <TabsContent value="purchases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Purchases</CardTitle>
              <CardDescription>Movies, series, and subscriptions you've purchased</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {purchases.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                    {item.thumbnail ? (
                      <div className="relative w-[100px] h-[60px] rounded-md overflow-hidden">
                        <img
                          src={item.thumbnail || "/placeholder.svg"}
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
                      <h4 className="font-medium">{item.title}</h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Badge variant="outline" className="mr-2">
                          {item.type}
                        </Badge>
                        <span>Purchased on {item.date}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{item.amount}</div>
                      {item.type !== "Subscription" && (
                        <Button variant="link" size="sm" className="px-0 h-auto">
                          Watch now
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
