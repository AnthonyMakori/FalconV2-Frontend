export function isLocalVideo(url: string) {
  return (
    url.endsWith(".mp4") ||
    url.endsWith(".webm") ||
    url.endsWith(".ogg") ||
    url.endsWith(".m3u8")
  )
}
