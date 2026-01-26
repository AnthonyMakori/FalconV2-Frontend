// lib/image.ts
// Resolve movie image paths coming from either the backend or TMDB.
const ASSET_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ""

export function resolveMovieImage(path?: string | null) {
  if (!path) return null

  // Already a full URL
  if (path.startsWith("http")) return path

  // TMDB-style relative path (e.g. "/abc123.jpg") — use TMDB image base
  // Detect by simple pattern: single-segment path with leading slash and a dot
  if (path.startsWith("/") && path.split("/").length === 2 && path.includes(".")) {
    return `https://image.tmdb.org/t/p/w780${path}`
  }

  // Backend relative path (prepend /assets if missing)
  const cleanedPath = path.startsWith("/assets") ? path : `/assets/${path}`

  return `${ASSET_BASE_URL}${cleanedPath}`
}
