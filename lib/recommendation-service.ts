import {
  getMovieRecommendations,
  getTrendingMovies,
  getMoviesByGenre,
  getPopularMovies,
  getTopRatedMovies,
} from "./tmdb"
import { getMostViewedMovies, getUserPreferences } from "./analytics"

interface UserProfile {
  favoriteGenres: number[]
  averageRating: number
  preferredDecades: number[]
  viewHistory: string[]
  favorites: any[]
  watchlist: any[]
  engagementScore: number
  mostViewedMovies: { movieId: string; viewCount: number; totalTime: number }[]
  timeSpentData: any
}

class RecommendationService {
  // Generate personalized recommendations with diverse sources
  async generateRecommendations(userProfile: UserProfile, limit = 20): Promise<any[]> {
    try {
      const recommendations = new Map<number, any>() // Use Map to avoid duplicates by ID

      console.log("Generating diverse recommendations for user profile:", userProfile)

      // 1. Engagement-based recommendations (25% weight)
      if (userProfile.mostViewedMovies.length > 0) {
        const engagementRecs = await this.getEngagementBasedRecommendations(userProfile.mostViewedMovies)
        engagementRecs.forEach((movie) => recommendations.set(movie.id, movie))
        console.log("Added engagement-based recommendations:", engagementRecs.length)
      }

      // 2. Content-based filtering from favorites (20% weight)
      if (userProfile.favorites.length > 0) {
        const contentBasedRecs = await this.getContentBasedRecommendations(userProfile.favorites)
        contentBasedRecs.forEach((movie) => recommendations.set(movie.id, movie))
        console.log("Added content-based recommendations:", contentBasedRecs.length)
      }

      // 3. Genre-based recommendations (25% weight)
      if (userProfile.favoriteGenres.length > 0) {
        const genreBasedRecs = await this.getGenreBasedRecommendations(userProfile.favoriteGenres)
        genreBasedRecs.forEach((movie) => recommendations.set(movie.id, movie))
        console.log("Added genre-based recommendations:", genreBasedRecs.length)
      }

      // 4. Popular movies with user preference weighting (15% weight)
      const popularRecs = await this.getPopularRecommendations(userProfile)
      popularRecs.forEach((movie) => recommendations.set(movie.id, movie))
      console.log("Added popular recommendations:", popularRecs.length)

      // 5. Top-rated movies matching preferences (10% weight)
      const topRatedRecs = await this.getTopRatedRecommendations(userProfile)
      topRatedRecs.forEach((movie) => recommendations.set(movie.id, movie))
      console.log("Added top-rated recommendations:", topRatedRecs.length)

      // 6. Trending movies with user preference weighting (5% weight)
      const trendingRecs = await this.getTrendingRecommendations(userProfile)
      trendingRecs.forEach((movie) => recommendations.set(movie.id, movie))
      console.log("Added trending recommendations:", trendingRecs.length)

      // Convert Map to Array and apply final filtering
      let finalRecommendations = Array.from(recommendations.values())

      // Remove movies already in favorites, watchlist, or viewed
      const excludeIds = new Set([
        ...userProfile.favorites.map((m) => m.id),
        ...userProfile.watchlist.map((m) => m.id),
        ...userProfile.viewHistory.map((id) => Number.parseInt(id)),
        ...userProfile.mostViewedMovies.map((m) => Number.parseInt(m.movieId)),
      ])

      finalRecommendations = finalRecommendations.filter((movie) => !excludeIds.has(movie.id))

      // Score and sort recommendations
      finalRecommendations = this.scoreRecommendations(finalRecommendations, userProfile)

      console.log("Final diverse recommendations count:", finalRecommendations.length)
      return finalRecommendations.slice(0, limit)
    } catch (error) {
      console.error("Failed to generate recommendations:", error)
      return []
    }
  }

  // Engagement-based recommendations using time spent and view count
  private async getEngagementBasedRecommendations(
    mostViewedMovies: { movieId: string; viewCount: number; totalTime: number }[],
  ): Promise<any[]> {
    const recommendations: any[] = []

    // Get recommendations from top 5 most engaged movies
    for (const viewedMovie of mostViewedMovies.slice(0, 5)) {
      try {
        const { results } = await getMovieRecommendations(viewedMovie.movieId)
        recommendations.push(...this.normalizeVoteAverage(results).slice(0, 4)) // Top 4 from each
      } catch (error) {
        console.error(`Failed to get recommendations for movie ${viewedMovie.movieId}:`, error)
      }
    }

    return recommendations
  }

  // Content-based filtering using movie similarities
  private async getContentBasedRecommendations(favorites: any[]): Promise<any[]> {
    const recommendations: any[] = []

    // Sort favorites by rating and take top 5
    const topFavorites = favorites
      .sort((a, b) => (Number(b.vote_average) || 0) - (Number(a.vote_average) || 0))
      .slice(0, 5)

    for (const movie of topFavorites) {
      try {
        const { results } = await getMovieRecommendations(movie.id.toString())
        recommendations.push(...this.normalizeVoteAverage(results).slice(0, 3)) // Top 3 from each
      } catch (error) {
        console.error(`Failed to get recommendations for movie ${movie.id}:`, error)
      }
    }

    return recommendations
  }

  // Genre-based recommendations with variety
  private async getGenreBasedRecommendations(favoriteGenres: number[]): Promise<any[]> {
    const recommendations: any[] = []

    for (const genreId of favoriteGenres) {
      try {
        const { results } = await getMoviesByGenre(genreId.toString())
        recommendations.push(...this.normalizeVoteAverage(results).slice(0, 8))
      } catch (error) {
        console.error(`Failed to get movies for genre ${genreId}:`, error)
      }
    }

    return recommendations
  }

  // Popular movies
  private async getPopularRecommendations(userProfile: UserProfile): Promise<any[]> {
    try {
      const { results } = await getPopularMovies()
      return this.normalizeVoteAverage(results)
        .filter((movie) => (Number(movie.vote_average) || 0) >= userProfile.averageRating - 2)
        .slice(0, 15)
    } catch (error) {
      console.error("Failed to get popular recommendations:", error)
      return []
    }
  }

  // Top-rated movies
  private async getTopRatedRecommendations(userProfile: UserProfile): Promise<any[]> {
    try {
      const { results } = await getTopRatedMovies()
      return this.normalizeVoteAverage(results)
        .filter((movie) => (Number(movie.vote_average) || 0) >= userProfile.averageRating - 1)
        .slice(0, 10)
    } catch (error) {
      console.error("Failed to get top-rated recommendations:", error)
      return []
    }
  }

  // Trending movies
  private async getTrendingRecommendations(userProfile: UserProfile): Promise<any[]> {
    try {
      const { results } = await getTrendingMovies()
      return this.normalizeVoteAverage(results)
        .filter((movie) => (Number(movie.vote_average) || 0) >= 5.0)
        .slice(0, 8)
    } catch (error) {
      console.error("Failed to get trending recommendations:", error)
      return []
    }
  }

  // Score recommendations
  private scoreRecommendations(movies: any[], userProfile: UserProfile): any[] {
    return movies
      .map((movie) => {
        const voteAvg = Number(movie.vote_average) || 0
        let score = voteAvg

        if (userProfile.favoriteGenres.length > 0 && movie.genre_ids) {
          const genreMatches = movie.genre_ids.filter((genreId: number) =>
            userProfile.favoriteGenres.includes(genreId),
          ).length
          score += genreMatches * 1.5
        }

        if (voteAvg >= userProfile.averageRating - 1) score += 1.0

        const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 0
        if (releaseYear >= 2020) score += 0.5

        if (movie.popularity > 100) score += 0.3

        score *= 1 + userProfile.engagementScore * 0.05
        score += Math.random() * 0.5

        return { ...movie, recommendationScore: score }
      })
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
  }

  // Build user profile
  buildUserProfile(): UserProfile {
    try {
      const favorites = JSON.parse(localStorage.getItem("cynthia-movies-favorites") || "[]")
      const watchlist = JSON.parse(localStorage.getItem("cynthia-movies-watchlist") || "[]")
      const userPreferences = getUserPreferences()
      const mostViewedMovies = getMostViewedMovies()

      const genreMap = new Map<number, number>()
      favorites.forEach((movie: any) => {
        if (movie.genre_ids) {
          movie.genre_ids.forEach((genreId: number) => {
            genreMap.set(genreId, (genreMap.get(genreId) || 0) + 1)
          })
        }
      })

      const favoriteGenres = Array.from(genreMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([genreId]) => genreId)

      const averageRating =
        favorites.length > 0
          ? favorites.reduce((sum: number, movie: any) => sum + (Number(movie.vote_average) || 0), 0) /
            favorites.length
          : 6.5

      return {
        favoriteGenres,
        averageRating,
        preferredDecades: [],
        viewHistory: mostViewedMovies.map((m) => m.movieId),
        favorites,
        watchlist,
        engagementScore: userPreferences.engagementScore,
        mostViewedMovies,
        timeSpentData: userPreferences.viewingPatterns,
      }
    } catch (error) {
      console.error("Failed to build user profile:", error)
      return {
        favoriteGenres: [],
        averageRating: 6.5,
        preferredDecades: [],
        viewHistory: [],
        favorites: [],
        watchlist: [],
        engagementScore: 0,
        mostViewedMovies: [],
        timeSpentData: {},
      }
    }
  }

  // Helper: normalize vote_average for all movies
  private normalizeVoteAverage(movies: any[]): any[] {
    return movies.map((movie) => ({
      ...movie,
      vote_average: movie.vote_average != null ? Number(movie.vote_average) : 0,
    }))
  }
}

export const recommendationService = new RecommendationService()

export async function getPersonalizedRecommendations(limit = 20): Promise<any[]> {
  const userProfile = recommendationService.buildUserProfile()
  return recommendationService.generateRecommendations(userProfile, limit)
}