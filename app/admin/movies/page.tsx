'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash,
  Eye,
  Download,
} from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

/* ================= TYPES ================= */

interface Movie {
  id: number
  title: string
  genre: string
  release_year: number
  status: string
}

interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  total: number
}

/* ================= PAGE ================= */

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true)
      setError(null)

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null

      if (!token) {
        setError("You are not authenticated.")
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`${API_URL}/movies`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })

        if (!res.ok) {
          throw new Error(`Failed to fetch movies (${res.status})`)
        }

        const json: PaginatedResponse<Movie> = await res.json()

        // 🔥 FIX: always extract the array
        setMovies(Array.isArray(json.data) ? json.data : [])
      } catch (err: any) {
        console.error(err)
        setError(err.message ?? "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  /* ================= UI ================= */

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Movies</h1>
        <Link href="/admin/movies/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Movie
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Movie Management</CardTitle>
          <CardDescription>
            Manage all movies on the platform
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search movies..."
                  className="pl-8 w-[300px]"
                  disabled
                />
              </div>
            </div>

            <Button variant="outline" size="sm" disabled>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          {/* STATES */}
          {loading && <p>Loading movies...</p>}

          {!loading && error && (
            <p className="text-destructive">{error}</p>
          )}

          {!loading && !error && movies.length === 0 && (
            <p>No movies found.</p>
          )}

          {/* TABLE */}
          {!loading && !error && movies.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {movies.map((movie) => (
                    <TableRow key={movie.id}>
                      <TableCell className="font-medium">
                        {movie.title}
                      </TableCell>
                      <TableCell>{movie.genre}</TableCell>
                      <TableCell>{movie.release_year}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            movie.status === "published"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                          }`}
                        >
                          {movie.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* FOOTER */}
          {!loading && movies.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing <strong>{movies.length}</strong> movies
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
