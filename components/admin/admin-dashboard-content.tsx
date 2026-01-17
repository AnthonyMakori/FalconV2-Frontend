"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function AdminDashboardContent() {
  const [stats, setStats] = useState<any>(null)
  const [recentUploads, setRecentUploads] = useState<any>(null)
  const [recentActivities, setRecentActivities] = useState<any>(null)
  const [viewsData, setViewsData] = useState<any[]>([])
  const [revenueData, setRevenueData] = useState<any[]>([])

  // Helper function for authorized fetch
  const authFetch = async (url: string) => {
    const token = localStorage.getItem("token") 
    if (!token) throw new Error("No auth token found")

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`)
    return res.json()
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, uploadsData, activitiesData, viewsChartData, revenueChartData] =
          await Promise.all([
            authFetch(`${API_URL}/api/dashboard/stats`),
            authFetch(`${API_URL}/api/dashboard/recent-uploads`),
            authFetch(`${API_URL}/api/dashboard/recent-activities`),
            authFetch(`${API_URL}/api/dashboard/views-overview`),
            authFetch(`${API_URL}/api/dashboard/revenue-overview`),
          ])

        setStats(statsData)
        setRecentUploads(uploadsData)
        setRecentActivities(activitiesData)
        setViewsData(viewsChartData)
        setRevenueData(revenueChartData)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      }
    }

    fetchData()
  }, [])

  if (!stats) return <p>Loading dashboard...</p>

  return (
    <div className="space-y-6">
      {/* --- Stats Cards --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {stats.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscribers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* --- Charts --- */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Views Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={viewsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="views" fill="#ff6900" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#ff6900" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* --- Recent Uploads --- */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Uploads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUploads &&
                [...recentUploads.movies, ...recentUploads.events, ...recentUploads.merchandises].map(
                  (item: any, index: number) => (
                    <div key={index} className="flex items-center gap-4">
                      <div
                        className="h-12 w-20 bg-muted rounded-md"
                        style={{
                          backgroundImage: `url(${API_URL}/storage/${item.thumbnail})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      ></div>
                      <div>
                        <h4 className="text-sm font-medium">{item.title || item.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          Uploaded {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )
                )}
            </div>
          </CardContent>
        </Card>

        {/* --- Recent Activities --- */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities &&
                [...recentActivities.recentUsers, ...recentActivities.recentPurchases].map(
                  (activity: any, index: number) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                        {activity.name?.charAt(0) || activity.user_id}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">
                          {activity.name
                            ? "User Registration"
                            : "Purchase Received"}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {activity.name
                            ? `New user registered on ${new Date(activity.created_at).toLocaleDateString()}`
                            : `KES ${activity.amount} purchase by user ${activity.user_id} on ${new Date(
                                activity.created_at
                              ).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                  )
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
