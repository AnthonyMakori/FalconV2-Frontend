"use client"

import { useEffect, useState } from "react"
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

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

export function UserDashboardContent() {
  const [user, setUser] = useState<any>(null)

  const [continueWatching, setContinueWatching] = useState<any[]>([])
  const [watchHistory, setWatchHistory] = useState<any[]>([])
  const [watchlist, setWatchlist] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [purchases, setPurchases] = useState<any[]>([])

  const [totalSpent, setTotalSpent] = useState(0)

  const [loading, setLoading] = useState(true)
  const [eventsLoading, setEventsLoading] = useState(true)
  const [purchasesLoading, setPurchasesLoading] = useState(true)

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  }

  /* ---------------- API CALLS ---------------- */

  const fetchUser = async () => {
    const res = await fetch(`${API_URL}/me`, { headers: authHeaders })
    if (!res.ok) throw new Error("User fetch failed")
    setUser(await res.json())
  }

  const fetchWatchlist = async () => {
    const res = await fetch(`${API_URL}/watchlist`, { headers: authHeaders })
    if (!res.ok) throw new Error("Watchlist failed")
    setWatchlist(await res.json())
  }

  const fetchContinueWatching = async () => {
    const res = await fetch(`${API_URL}/watch-progress/continue`, {
      headers: authHeaders,
    })
    if (!res.ok) throw new Error("Continue watching failed")
    setContinueWatching(await res.json())
  }

  const fetchWatchHistory = async () => {
    const res = await fetch(`${API_URL}/watch-history`, {
      headers: authHeaders,
    })
    if (!res.ok) throw new Error("History failed")
    setWatchHistory(await res.json())
  }

  const fetchPurchases = async () => {
    try {
      const res = await fetch(`${API_URL}/purchases`, {
        headers: authHeaders,
      })
      if (!res.ok) throw new Error()
      setPurchases(await res.json())
    } finally {
      setPurchasesLoading(false)
    }
  }

  const fetchPurchaseSummary = async () => {
    const res = await fetch(`${API_URL}/purchases/summary`, {
      headers: authHeaders,
    })
    if (!res.ok) throw new Error()
    const data = await res.json()
    setTotalSpent(data.total_spent)
  }

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/events`, {
        headers: authHeaders,
      })
      if (!res.ok) throw new Error()
      setEvents(await res.json())
    } finally {
      setEventsLoading(false)
    }
  }

  const removeFromWatchlist = async (movieId: number) => {
    await fetch(`${API_URL}/watchlist/${movieId}`, {
      method: "DELETE",
      headers: authHeaders,
    })
    fetchWatchlist()
  }

  /* ---------------- EFFECT ---------------- */

  useEffect(() => {
    if (!token) return

    Promise.all([
      fetchUser(),
      fetchWatchlist(),
      fetchContinueWatching(),
      fetchWatchHistory(),
      fetchPurchases(),
      fetchPurchaseSummary(),
      fetchEvents(),
    ])
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-6">Loading dashboard...</div>
  if (!user) return <div className="p-6 text-red-500">Failed to load user</div>

  /* ---------------- UI ---------------- */

  return (
    <div>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar || "/placeholder.svg"} />
            <AvatarFallback>
              {user.name?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                Member since{" "}
                {new Date(user.created_at).toLocaleDateString()}
              </span>
              <span>•</span>
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary"
              >
                {user.subscription_plan ?? "Free"}
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

      {/* TABS */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="history">Watch History</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Watch History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {watchHistory.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Movies watched
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Watchlist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {watchlist.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Saved movies
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Purchases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  KES {totalSpent.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total spent
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CONTINUE WATCHING */}
          <Card>
            <CardHeader>
              <CardTitle>Continue Watching</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {continueWatching.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nothing to continue
                </p>
              )}

              {continueWatching.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-[120px] h-[68px] overflow-hidden rounded">
                    <img src={item.thumbnail} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 h-1 w-full bg-gray-700">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    <span className="text-sm text-muted-foreground">
                      {item.lastWatched}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* WATCHLIST */}
        <TabsContent value="watchlist">
          <Card>
            <CardHeader>
              <CardTitle>Your Watchlist</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {watchlist.map((item) => (
                <div key={item.id} className="border rounded overflow-hidden">
                  <img src={item.thumbnail} className="w-full aspect-video object-cover" />
                  <div className="p-3">
                    <h4 className="font-medium">{item.title}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromWatchlist(item.movie_id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* HISTORY */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Watch History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {watchHistory.map((item) => (
                <div key={item.id} className="border-b pb-4">
                  <h4 className="font-medium">{item.movie.title}</h4>
                  <span className="text-sm text-muted-foreground">
                    Watched{" "}
                    {new Date(item.last_watched_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* PURCHASES */}
        <TabsContent value="purchases">
          <Card>
            <CardHeader>
              <CardTitle>Your Purchases</CardTitle>
            </CardHeader>
            <CardContent>
              {purchasesLoading ? (
                <p>Loading...</p>
              ) : purchases.length === 0 ? (
                <p>No purchases</p>
              ) : (
                purchases.map((item) => (
                  <div key={item.id} className="flex justify-between border-b py-3">
                    <span>{item.title ?? `Movie #${item.movie_id}`}</span>
                    <span>KES {Number(item.amount).toLocaleString()}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
