"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts"
import { TrendingUp, Clock, BarChart3, PieChartIcon, Activity } from "lucide-react"

interface AnalyticsChartsProps {
  viewingActivity: { date: string; views: number; timeSpent: number }[]
  genreDistribution: { genre: string; count: number; timeSpent: number }[]
  hourlyPattern: { hour: number; views: number }[]
  engagementScore: number
  totalViews: number
  totalTimeSpent: number
}

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#00ff00",
  "#ff00ff",
  "#00ffff",
  "#ff0000",
  "#0000ff",
  "#ffff00",
]

export default function AnalyticsCharts({
  viewingActivity,
  genreDistribution,
  hourlyPattern,
  engagementScore,
  totalViews,
  totalTimeSpent,
}: AnalyticsChartsProps) {
  // Prepare data for radial chart
  const radialData = [
    {
      name: "Engagement",
      value: Math.round(engagementScore * 100),
      fill: "#8884d8",
    },
  ]

  // Format time for tooltips
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  // Format date for charts
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  // Format hour for hourly chart
  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM"
    if (hour === 12) return "12 PM"
    if (hour < 12) return `${hour} AM`
    return `${hour - 12} PM`
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Viewing Activity Over Time - Line Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Viewing Activity Over Time
          </CardTitle>
          <CardDescription>Your daily movie viewing patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={viewingActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                labelFormatter={(value) => formatDate(value as string)}
                formatter={(value, name) => [
                  name === "timeSpent" ? formatTime(value as number) : value,
                  name === "views" ? "Views" : "Time Spent",
                ]}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="views"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Views"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="timeSpent"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Time Spent (seconds)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Genre Distribution - Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-purple-500" />
            Genre Preferences
          </CardTitle>
          <CardDescription>Your favorite movie genres</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genreDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ genre, percent }) => `${genre} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {genreDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value, "Movies"]} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Hourly Viewing Pattern - Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            Viewing Times
          </CardTitle>
          <CardDescription>When you watch movies most</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyPattern}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tickFormatter={formatHour} tick={{ fontSize: 10 }} interval={1} />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => formatHour(value as number)}
                formatter={(value) => [value, "Views"]}
              />
              <Bar dataKey="views" fill="#ffc658" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Time Spent by Genre - Area Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            Time by Genre
          </CardTitle>
          <CardDescription>Time spent watching each genre</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={genreDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="genre" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip formatter={(value) => [formatTime(value as number), "Time Spent"]} />
              <Area type="monotone" dataKey="timeSpent" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Engagement Score - Radial Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-red-500" />
            Engagement Score
          </CardTitle>
          <CardDescription>Your overall movie engagement level</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={radialData}>
              <RadialBar
                minAngle={15}
                label={{ position: "insideStart", fill: "#fff" }}
                background
                clockWise
                dataKey="value"
                fill="#8884d8"
              />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold">
                {Math.round(engagementScore * 100)}%
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 mt-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-500">{totalViews}</p>
              <p className="text-sm text-muted-foreground">Total Views</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-500">{formatTime(totalTimeSpent / 1000)}</p>
              <p className="text-sm text-muted-foreground">Total Time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
