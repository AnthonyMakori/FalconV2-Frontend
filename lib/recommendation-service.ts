import { getMovies } from "../lib/movies"
import { Movie } from "@/types/movie"

class RecommendationService {
  async generateRecommendations(userProfile: UserProfile, limit = 20): Promise<Movie[]> {
    const movies = await getMovies()

    const scored = movies
      .filter(m => m.status === "published")
      .map(movie => {
        let score = 0

        // Genre preference
        if (userProfile.favoriteGenres.includes(movie.genre)) {
          score += 3
        }

        // Language preference
        if (userProfile.language === movie.language) {
          score += 1.5
        }

        // Free preview boost
        if (movie.free_preview) {
          score += 1
        }

        // Recency boost
        if (Number(movie.release_year) >= 2023) {
          score += 1
        }

        return { ...movie, score }
      })
      .sort((a, b) => b.score - a.score)

    return scored.slice(0, limit)
  }
}

export const recommendationService = new RecommendationService()
