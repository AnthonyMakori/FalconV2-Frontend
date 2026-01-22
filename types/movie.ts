export interface Movie {
  id: number
  title: string
  description: string
  poster_path: string
  movie_path: string
  trailer_path?: string
  purchase_price: string
  rental_price: string
  rental_period: string
  release_year: string
  duration: string
  language: string
  genre: string
  status: "published" | "draft"
  free_preview: boolean
  preview_duration?: string
  casts: { id: number; name: string }[]
  tags: { id: number; name: string }[]
  subtitles: {
    id: number
    language: string | null
    file_path: string
  }[]
  created_at: string
}
