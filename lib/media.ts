const API_BASE = process.env.NEXT_PUBLIC_API_URL || ""

function getAssetBaseUrl() {
  // Replace /api with /assets
  return API_BASE.replace(/\/api\/?$/, "/public/assets")
}

export function resolveMovieTrailer(path?: string | null) {
  if (!path) return null

  // Already full URL
  if (path.startsWith("http")) return path

  const assetBase = getAssetBaseUrl()

  return `${assetBase}/${path.replace(/^\/+/, "")}`
}
