// Enhanced analytics service for tracking movie views and user behavior
class AnalyticsService {
  private viewsKey = "cynthia-movies-views"
  private userBehaviorKey = "cynthia-movies-behavior"
  private timeTrackingKey = "cynthia-movies-time-tracking"
  private sessionStartTime: number | null = null
  private currentMovieId: string | null = null
  private timeSpentInterval: NodeJS.Timeout | null = null

  // Check if we're in a browser environment
  private isBrowser(): boolean {
    return typeof window !== "undefined" && typeof localStorage !== "undefined"
  }

  // Start tracking time spent on a page
  startTimeTracking(movieId: string, pageType: "details" | "watch"): void {
    if (!this.isBrowser()) return

    this.currentMovieId = movieId
    this.sessionStartTime = Date.now()

    // Clear any existing interval
    if (this.timeSpentInterval) {
      clearInterval(this.timeSpentInterval)
    }

    // Update time spent every 5 seconds
    this.timeSpentInterval = setInterval(() => {
      this.updateTimeSpent(movieId, pageType)
    }, 5000)

    console.log(`Started tracking time for movie ${movieId} on ${pageType} page`)
  }

  // Stop tracking time spent
  stopTimeTracking(): void {
    if (!this.isBrowser()) return

    if (this.timeSpentInterval) {
      clearInterval(this.timeSpentInterval)
      this.timeSpentInterval = null
    }

    if (this.currentMovieId && this.sessionStartTime) {
      const timeSpent = Date.now() - this.sessionStartTime
      this.saveTimeSpent(this.currentMovieId, timeSpent)
      console.log(`Stopped tracking time. Total time: ${timeSpent}ms`)
    }

    this.sessionStartTime = null
    this.currentMovieId = null
  }

  // Update time spent during the session
  private updateTimeSpent(movieId: string, pageType: "details" | "watch"): void {
    if (!this.sessionStartTime) return

    const timeSpent = Date.now() - this.sessionStartTime
    this.saveTimeSpent(movieId, timeSpent, pageType)
  }

  // Save time spent to localStorage
  private saveTimeSpent(movieId: string, timeSpent: number, pageType?: "details" | "watch"): void {
    if (!this.isBrowser()) return

    try {
      const timeTracking = this.getStoredTimeTracking()

      if (!timeTracking[movieId]) {
        timeTracking[movieId] = {
          totalTime: 0,
          detailsTime: 0,
          watchTime: 0,
          sessions: [],
        }
      }

      timeTracking[movieId].totalTime = Math.max(timeTracking[movieId].totalTime, timeSpent)

      if (pageType === "details") {
        timeTracking[movieId].detailsTime = Math.max(timeTracking[movieId].detailsTime, timeSpent)
      } else if (pageType === "watch") {
        timeTracking[movieId].watchTime = Math.max(timeTracking[movieId].watchTime, timeSpent)
      }

      // Add session data
      timeTracking[movieId].sessions.push({
        timestamp: Date.now(),
        duration: timeSpent,
        pageType: pageType || "unknown",
      })

      // Keep only last 50 sessions per movie
      if (timeTracking[movieId].sessions.length > 50) {
        timeTracking[movieId].sessions = timeTracking[movieId].sessions.slice(-50)
      }

      localStorage.setItem(this.timeTrackingKey, JSON.stringify(timeTracking))
    } catch (error) {
      console.error("Failed to save time tracking data:", error)
    }
  }

  // Track movie view
  async trackMovieView(movieId: string): Promise<void> {
    if (!this.isBrowser()) {
      console.log(`Movie view tracked (server): ${movieId}`)
      return
    }

    try {
      const views = this.getStoredViews()
      const timestamp = Date.now()

      if (!views[movieId]) {
        views[movieId] = []
      }

      views[movieId].push(timestamp)

      // Keep only last 100 views per movie to prevent storage bloat
      if (views[movieId].length > 100) {
        views[movieId] = views[movieId].slice(-100)
      }

      localStorage.setItem(this.viewsKey, JSON.stringify(views))

      // Track in user behavior
      this.trackUserBehavior("movie_view", { movieId, timestamp })
    } catch (error) {
      console.error("Failed to track movie view:", error)
    }
  }

  // Get most viewed movies
  getMostViewedMovies(): { movieId: string; viewCount: number; totalTime: number }[] {
    if (!this.isBrowser()) {
      return []
    }

    try {
      const views = this.getStoredViews()
      const timeTracking = this.getStoredTimeTracking()

      return Object.entries(views)
        .map(([movieId, timestamps]) => ({
          movieId,
          viewCount: timestamps.length,
          totalTime: timeTracking[movieId]?.totalTime || 0,
        }))
        .sort((a, b) => {
          // Sort by engagement score (views * time spent)
          const scoreA = a.viewCount * (a.totalTime / 1000) // Convert to seconds
          const scoreB = b.viewCount * (b.totalTime / 1000)
          return scoreB - scoreA
        })
        .slice(0, 20) // Top 20 most engaged
    } catch (error) {
      console.error("Failed to get most viewed movies:", error)
      return []
    }
  }

  // Get movies with most time spent
  getMostEngagedMovies(): { movieId: string; totalTime: number; avgSessionTime: number }[] {
    if (!this.isBrowser()) {
      return []
    }

    try {
      const timeTracking = this.getStoredTimeTracking()

      return Object.entries(timeTracking)
        .map(([movieId, data]) => ({
          movieId,
          totalTime: data.totalTime,
          avgSessionTime:
            data.sessions.length > 0
              ? data.sessions.reduce((sum: number, session: any) => sum + session.duration, 0) / data.sessions.length
              : 0,
        }))
        .filter((movie) => movie.totalTime > 10000) // At least 10 seconds
        .sort((a, b) => b.totalTime - a.totalTime)
        .slice(0, 20)
    } catch (error) {
      console.error("Failed to get most engaged movies:", error)
      return []
    }
  }

  // Get viewing activity over time for charts
  getViewingActivityOverTime(): { date: string; views: number; timeSpent: number }[] {
    if (!this.isBrowser()) {
      return []
    }

    try {
      const behavior = this.getStoredBehavior()
      const movieViews = behavior.filter((event: any) => event.action === "movie_view")
      const timeTracking = this.getStoredTimeTracking()

      // Group by date
      const dailyActivity = new Map<string, { views: number; timeSpent: number }>()

      movieViews.forEach((view: any) => {
        const date = new Date(view.timestamp).toISOString().split("T")[0]
        const existing = dailyActivity.get(date) || { views: 0, timeSpent: 0 }
        existing.views += 1
        dailyActivity.set(date, existing)
      })

      // Add time spent data
      Object.entries(timeTracking).forEach(([movieId, data]: [string, any]) => {
        data.sessions.forEach((session: any) => {
          const date = new Date(session.timestamp).toISOString().split("T")[0]
          const existing = dailyActivity.get(date) || { views: 0, timeSpent: 0 }
          existing.timeSpent += session.duration / 1000 // Convert to seconds
          dailyActivity.set(date, existing)
        })
      })

      // Convert to array and sort by date
      return Array.from(dailyActivity.entries())
        .map(([date, data]) => ({
          date,
          views: data.views,
          timeSpent: Math.round(data.timeSpent),
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-30) // Last 30 days
    } catch (error) {
      console.error("Failed to get viewing activity over time:", error)
      return []
    }
  }

  // Get genre distribution for charts
  getGenreDistribution(): { genre: string; count: number; timeSpent: number }[] {
    if (!this.isBrowser()) {
      return []
    }

    try {
      const favorites = JSON.parse(localStorage.getItem("cynthia-movies-favorites") || "[]")
      const watchlist = JSON.parse(localStorage.getItem("cynthia-movies-watchlist") || "[]")
      const timeTracking = this.getStoredTimeTracking()

      const genreMap = new Map<number, { name: string; count: number; timeSpent: number }>()

      // Genre ID to name mapping (common genres)
      const genreNames: Record<number, string> = {
        28: "Action",
        12: "Adventure",
        16: "Animation",
        35: "Comedy",
        80: "Crime",
        99: "Documentary",
        18: "Drama",
        10751: "Family",
        14: "Fantasy",
        36: "History",
        27: "Horror",
        10402: "Music",
        9648: "Mystery",
        10749: "Romance",
        878: "Sci-Fi",
        10770: "TV Movie",
        53: "Thriller",
        10752: "War",
        37: "Western",
      }

      // Count from favorites and watchlist
      favorites.concat(watchlist).forEach((movie: any) => {
        if (movie.genre_ids) {
          movie.genre_ids.forEach((genreId: number) => {
            const existing = genreMap.get(genreId) || {
              name: genreNames[genreId] || `Genre ${genreId}`,
              count: 0,
              timeSpent: 0,
            }
            existing.count += 1

            // Add time spent if available
            if (timeTracking[movie.id]) {
              existing.timeSpent += timeTracking[movie.id].totalTime / 1000 // Convert to seconds
            }

            genreMap.set(genreId, existing)
          })
        }
      })

      return Array.from(genreMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 10) // Top 10 genres
    } catch (error) {
      console.error("Failed to get genre distribution:", error)
      return []
    }
  }

  // Get hourly viewing patterns
  getHourlyViewingPattern(): { hour: number; views: number }[] {
    if (!this.isBrowser()) {
      return []
    }

    try {
      const behavior = this.getStoredBehavior()
      const movieViews = behavior.filter((event: any) => event.action === "movie_view")

      const hourlyPattern = new Array(24).fill(0).map((_, hour) => ({ hour, views: 0 }))

      movieViews.forEach((view: any) => {
        const hour = new Date(view.timestamp).getHours()
        hourlyPattern[hour].views += 1
      })

      return hourlyPattern
    } catch (error) {
      console.error("Failed to get hourly viewing pattern:", error)
      return new Array(24).fill(0).map((_, hour) => ({ hour, views: 0 }))
    }
  }

  // Track user behavior
  trackUserBehavior(action: string, data: any): void {
    if (!this.isBrowser()) {
      return
    }

    try {
      const behavior = this.getStoredBehavior()
      const event = {
        action,
        data,
        timestamp: Date.now(),
      }

      behavior.push(event)

      // Keep only last 1000 events
      if (behavior.length > 1000) {
        behavior.splice(0, behavior.length - 1000)
      }

      localStorage.setItem(this.userBehaviorKey, JSON.stringify(behavior))
    } catch (error) {
      console.error("Failed to track user behavior:", error)
    }
  }

  // Get user preferences based on behavior
  getUserPreferences(): {
    favoriteGenres: number[]
    preferredRatingRange: [number, number]
    viewingPatterns: any
    engagementScore: number
  } {
    if (!this.isBrowser()) {
      return {
        favoriteGenres: [],
        preferredRatingRange: [6.0, 10.0],
        viewingPatterns: { totalViews: 0, averageViewsPerDay: 0 },
        engagementScore: 0,
      }
    }

    try {
      const behavior = this.getStoredBehavior()
      const movieViews = behavior.filter((event: any) => event.action === "movie_view")
      const timeTracking = this.getStoredTimeTracking()

      // Calculate engagement score
      const totalTimeSpent = Object.values(timeTracking).reduce((sum: number, data: any) => sum + data.totalTime, 0)
      const engagementScore = (movieViews.length * totalTimeSpent) / 1000000 // Normalize

      return {
        favoriteGenres: this.extractFavoriteGenres(),
        preferredRatingRange: this.calculatePreferredRatingRange(),
        viewingPatterns: {
          totalViews: movieViews.length,
          averageViewsPerDay: this.calculateAverageViewsPerDay(movieViews),
          totalTimeSpent,
          avgTimePerMovie: Object.keys(timeTracking).length > 0 ? totalTimeSpent / Object.keys(timeTracking).length : 0,
        },
        engagementScore,
      }
    } catch (error) {
      console.error("Failed to get user preferences:", error)
      return {
        favoriteGenres: [],
        preferredRatingRange: [6.0, 10.0],
        viewingPatterns: { totalViews: 0, averageViewsPerDay: 0 },
        engagementScore: 0,
      }
    }
  }

  // Extract favorite genres from favorites and viewed movies
  private extractFavoriteGenres(): number[] {
    try {
      const favorites = JSON.parse(localStorage.getItem("cynthia-movies-favorites") || "[]")
      const genreMap = new Map<number, number>()

      favorites.forEach((movie: any) => {
        if (movie.genre_ids) {
          movie.genre_ids.forEach((genreId: number) => {
            genreMap.set(genreId, (genreMap.get(genreId) || 0) + 1)
          })
        }
      })

      return Array.from(genreMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([genreId]) => genreId)
    } catch (error) {
      return []
    }
  }

  // Calculate preferred rating range
  private calculatePreferredRatingRange(): [number, number] {
    try {
      const favorites = JSON.parse(localStorage.getItem("cynthia-movies-favorites") || "[]")

      if (favorites.length === 0) return [6.0, 10.0]

      const ratings = favorites.map((movie: any) => movie.vote_average).filter((rating: number) => rating > 0)

      if (ratings.length === 0) return [6.0, 10.0]

      const avgRating = ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length
      const minRating = Math.max(avgRating - 1.5, 0)
      const maxRating = Math.min(avgRating + 1.5, 10)

      return [minRating, maxRating]
    } catch (error) {
      return [6.0, 10.0]
    }
  }

  private getStoredViews(): Record<string, number[]> {
    if (!this.isBrowser()) {
      return {}
    }

    try {
      const stored = localStorage.getItem(this.viewsKey)
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.error("Failed to parse stored views:", error)
      return {}
    }
  }

  private getStoredBehavior(): any[] {
    if (!this.isBrowser()) {
      return []
    }

    try {
      const stored = localStorage.getItem(this.userBehaviorKey)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Failed to parse stored behavior:", error)
      return []
    }
  }

  private getStoredTimeTracking(): Record<string, any> {
    if (!this.isBrowser()) {
      return {}
    }

    try {
      const stored = localStorage.getItem(this.timeTrackingKey)
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.error("Failed to parse stored time tracking:", error)
      return {}
    }
  }

  private calculateAverageViewsPerDay(views: any[]): number {
    if (views.length === 0) return 0

    const firstView = views[0].timestamp
    const lastView = views[views.length - 1].timestamp
    const daysDiff = (lastView - firstView) / (1000 * 60 * 60 * 24)

    return daysDiff > 0 ? views.length / daysDiff : views.length
  }

  // Clean up when component unmounts
  cleanup(): void {
    this.stopTimeTracking()
  }
}

export const analyticsService = new AnalyticsService()

// Convenience functions
export async function trackMovieView(movieId: string): Promise<void> {
  return analyticsService.trackMovieView(movieId)
}

export function startTimeTracking(movieId: string, pageType: "details" | "watch"): void {
  analyticsService.startTimeTracking(movieId, pageType)
}

export function stopTimeTracking(): void {
  analyticsService.stopTimeTracking()
}

export function getMostViewedMovies() {
  return analyticsService.getMostViewedMovies()
}

export function getMostEngagedMovies() {
  return analyticsService.getMostEngagedMovies()
}

export function getUserPreferences() {
  return analyticsService.getUserPreferences()
}

export function getViewingActivityOverTime() {
  return analyticsService.getViewingActivityOverTime()
}

export function getGenreDistribution() {
  return analyticsService.getGenreDistribution()
}

export function getHourlyViewingPattern() {
  return analyticsService.getHourlyViewingPattern()
}
