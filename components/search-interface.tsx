"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search, Sparkles, TrendingUp, Heart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { useFavorites } from "@/hooks/use-favorites"
import { useWatchlist } from "@/hooks/use-watchlist"
import { searchMovies } from "@/lib/tmdb"
import { performanceService } from "@/lib/performance"
import SearchResults from "@/components/search-results"
import SearchSuggestions from "@/components/search-suggestions"
import TrendingSection from "@/components/trending-section"
import PersonalizedSection from "@/components/personalized-section"

interface SearchInterfaceProps {
  initialQuery: string
  initialPage: number
  trendingMovies: any[]
  popularMovies: any[]
}

export default function SearchInterface({
  initialQuery,
  initialPage,
  trendingMovies,
  popularMovies,
}: SearchInterfaceProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [searchResults, setSearchResults] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeTab, setActiveTab] = useState("discover")
  const { favorites } = useFavorites()
  const { watchlist } = useWatchlist()

  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      performanceService.debounce(async (searchQuery: string) => {
        if (searchQuery.trim().length < 2) {
          setSearchResults(null)
          return
        }

        setIsSearching(true)
        try {
          const results = await searchMovies(searchQuery)
          setSearchResults(results)

          // Update URL without triggering navigation
          const url = new URL(window.location.href)
          url.searchParams.set("query", searchQuery)
          window.history.replaceState({}, "", url.toString())
        } catch (error) {
          console.error("Search failed:", error)
        } finally {
          setIsSearching(false)
        }
      }, 300),
    [],
  )

  // Generate search suggestions based on trending movies
  const searchSuggestions = useMemo(() => {
    const movieTitles = [...trendingMovies, ...popularMovies].slice(0, 20).map((movie) => movie.title)

    const uniqueTitles = Array.from(new Set(movieTitles))
    return uniqueTitles.slice(0, 8)
  }, [trendingMovies, popularMovies])

  // Filter suggestions based on current query
  const filteredSuggestions = useMemo(() => {
    if (!query || query.length < 2) return []
    return searchSuggestions.filter((suggestion) => suggestion.toLowerCase().includes(query.toLowerCase()))
  }, [query, searchSuggestions])

  useEffect(() => {
    if (initialQuery) {
      debouncedSearch(initialQuery)
      setActiveTab("results")
    }
  }, [initialQuery, debouncedSearch])

  useEffect(() => {
    if (query) {
      debouncedSearch(query)
      setSuggestions(filteredSuggestions)
      setShowSuggestions(filteredSuggestions.length > 0)
      // Automatically switch to results tab when searching
      if (query.trim().length >= 2) {
        setActiveTab("results")
      }
    } else {
      setSearchResults(null)
      setShowSuggestions(false)
      setActiveTab("discover") // Go back to discover when search is cleared
    }
  }, [query, debouncedSearch, filteredSuggestions])

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    setShowSuggestions(false)
    if (searchQuery.trim().length >= 2) {
      setActiveTab("results")
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setShowSuggestions(false)
    debouncedSearch(suggestion)
    setActiveTab("results")
  }

  const clearSearch = () => {
    setQuery("")
    setSearchResults(null)
    setShowSuggestions(false)
    setActiveTab("discover")
    router.push("/search")
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Search Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-orange-500 to-red-500 bg-clip-text text-transparent">
            Discover Movies
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Search through millions of movies, get personalized recommendations, and discover your next favorite film
          </p>
        </div>

        {/* Enhanced Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for movies, actors, directors, genres..."
              className="pl-12 pr-12 h-14 text-lg bg-background/80 backdrop-blur-sm border-2 focus:border-primary transition-all shadow-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(filteredSuggestions.length > 0)}
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="sr-only">Clear search</span>✕
              </button>
            )}
          </div>

          {/* Search Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-lg border rounded-xl shadow-xl z-50"
              >
                <div className="p-2">
                  {filteredSuggestions.map((suggestion, index) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-accent rounded-lg transition-colors flex items-center gap-3"
                    >
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <span>{suggestion}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Search Tags */}
        <div className="flex flex-wrap justify-center gap-2">
          {["Action", "Comedy", "Drama", "Sci-Fi", "Horror", "Romance"].map((genre) => (
            <Badge
              key={genre}
              variant="secondary"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => handleSearch(genre)}
            >
              {genre}
            </Badge>
          ))}
        </div>
      </motion.div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4 mx-auto">
          <TabsTrigger value="discover" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Discover</span>
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Trending</span>
          </TabsTrigger>
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">For You</span>
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2" disabled={!searchResults}>
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Results</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-8">
          <TabsContent value="discover" className="space-y-8">
            <SearchSuggestions
              trendingMovies={trendingMovies}
              popularMovies={popularMovies}
              onMovieSearch={handleSearch}
            />
          </TabsContent>

          <TabsContent value="trending" className="space-y-8">
            <TrendingSection trendingMovies={trendingMovies} popularMovies={popularMovies} />
          </TabsContent>

          <TabsContent value="personal" className="space-y-8">
            <PersonalizedSection favorites={favorites} watchlist={watchlist} onMovieSearch={handleSearch} />
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {searchResults && (
              <SearchResults results={searchResults} query={query} isLoading={isSearching} page={initialPage} />
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
