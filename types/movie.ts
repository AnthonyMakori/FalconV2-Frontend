// types/movie.ts
export interface CastType {
  name: string
  image?: File | null
}

export interface Movie {
  id: number
  title: string
  overview: string
  release_date: string
  runtime: number
  language: string
  genre: string
  status: string
  casts: CastType[]
  tags: { id: number; name: string }[]
  subtitles: { id: number; file_path: string }[]
}