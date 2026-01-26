// lib/media.ts
const ASSET_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export function resolveMovieTrailer(path?: string | null) {
  if (!path) return null

  // Full URL already
  if (path.startsWith("http")) return path

  // Backend relative path
  return `${ASSET_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`
}
