"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import MovieGrid from "@/components/movie-grid"
import Pagination from "@/components/pagination"
import { getImageUrl } from "@/lib/image"

interface SearchResultsProps {
  results: {
    results: any[]
    total_results: number
    total_pages: number
  }
  query: string
  isLoading: boolean
  page: number
}

export default function SearchResults({ results, query, isLoading, page }: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("relevance")

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-[2/3] bg-muted animate-pulse rounded-lg" />
                <div className="h-4 bg-muted animate-pulse rounded" />
                <div className="h-3 w-2/3 bg-muted animate-pulse rounded" />
              </div>
            ))}
        </div>
      </div>
    )
  }

  if (!results || results.results.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
        <div className="p-6 bg-muted/30 rounded-2xl max-w-md mx-auto">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No results found</h3>
          <p className="text-muted-foreground mb-6">
            We couldn't find any movies matching "{query}". Try different keywords or browse our categories.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline">
              <Link href="/trending">Browse Trending</Link>
            </Button>
            <Button asChild>
              <Link href="/categories">Explore Categories</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Search Results</h2>
          <p className="text-muted-foreground">
            Found {results.total_results.toLocaleString()} results for "
            <span className="font-medium text-foreground">{query}</span>"
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort Options */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="release_date">Release Date</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded transition-colors ${
                viewMode === "grid" ? "bg-background shadow-sm" : "hover:bg-background/50"
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded transition-colors ${
                viewMode === "list" ? "bg-background shadow-sm" : "hover:bg-background/50"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
          All Results
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-accent">
          Movies Only
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-accent">
          High Rated (7+)
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-accent">
          Recent (2020+)
        </Badge>
      </div>

      {/* Results Grid/List */}
      {viewMode === "grid" ? (
        <MovieGrid movies={results.results} />
      ) : (
        <div className="space-y-4">
          {results.results.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
              className="flex gap-4 p-4 bg-card rounded-lg border hover:shadow-md transition-shadow"
            >
              <Link href={`/movies/${movie.id}`} className="flex-shrink-0">
                <div className="w-20 h-28 bg-muted rounded overflow-hidden">
                  {movie.poster_path && (
                    <img src={getImageUrl(movie.poster_path)} alt={movie.title} className="w-full h-full object-cover" />
                  )}
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/movies/${movie.id}`}>
                  <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1">
                    {movie.title}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground mb-2">
                  {movie.release_date && new Date(movie.release_date).getFullYear()}
                </p>
                <p className="text-sm line-clamp-2 mb-3">{movie.overview}</p>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">⭐ {movie.vote_average.toFixed(1)}</Badge>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/movies/${movie.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {results.total_pages > 1 && (
        <Pagination currentPage={page} totalPages={results.total_pages} query={query} baseUrl="/search" />
      )}
    </motion.div>
  )
}
