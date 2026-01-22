export function getImageUrl(path?: string | null) {
  if (!path) return ""
  if (path.startsWith("http")) return path
  const base = process.env.NEXT_PUBLIC_API_URL || ""
  return `${base}${path}`
}
