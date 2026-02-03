// lib/video-utils.ts

export function isLocalVideo(url?: string | null): boolean {
  if (!url) {
    console.warn("[VideoUtils] isLocalVideo called with empty url:", url)
    return false
  }

  // Normalize (remove query params, fragments)
  const cleanUrl = url.split("?")[0].split("#")[0].toLowerCase()

  const supportedExtensions = [".mp4", ".webm", ".ogg", ".m3u8"]

  const isSupported = supportedExtensions.some(ext =>
    cleanUrl.endsWith(ext)
  )

  console.log("[VideoUtils] isLocalVideo check:", {
    originalUrl: url,
    cleanUrl,
    isSupported,
  })

  return isSupported
}
