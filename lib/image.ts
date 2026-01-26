// lib/images.ts
const ASSET_BASE_URL = "https://api.falconeyephilmz.com" 

export function resolveMovieImage(path?: string | null) {
  if (!path) return null

  // Already a full URL
  if (path.startsWith("http")) return path

  // Backend relative path (prepend /assets if missing)
  const cleanedPath = path.startsWith("/assets") ? path : `/assets/${path}`

  return `${ASSET_BASE_URL}${cleanedPath}`
}
