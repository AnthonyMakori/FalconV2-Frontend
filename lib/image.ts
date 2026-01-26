// lib/images.ts
const ASSET_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export function resolveMovieImage(path?: string | null) {
  if (!path) return null

  // Already a full URL
  if (path.startsWith("http")) return path

  // Backend relative path
  return `${ASSET_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`
}
