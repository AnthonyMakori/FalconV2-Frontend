import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useEffect, useRef } from "react"
import Hls from "hls.js"

interface VideoPlayerModalProps {
  open: boolean
  onClose: () => void
  videoUrl: string
}

export function VideoPlayerModal({
  open,
  onClose,
  videoUrl,
}: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!open) return

    const video = videoRef.current
    if (!video) return

    let hls: Hls | null = null

    const playVideo = async () => {
      video.muted = true // ⚡ muted for autoplay

      if (videoUrl.endsWith(".m3u8")) {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = videoUrl
        } else if (Hls.isSupported()) {
          hls = new Hls()
          hls.loadSource(videoUrl)
          hls.attachMedia(video)
        } else {
          console.error("HLS not supported in this browser")
          return
        }
      } else {
        video.src = videoUrl
      }

      try {
        await video.play()
        console.log("Video autoplayed successfully")
      } catch (err) {
        console.warn("Autoplay blocked, user interaction required:", err)
      }

      // Allow unmute on click
      video.addEventListener("click", () => {
        if (video.muted) video.muted = false
      })
    }

    // Slight delay to ensure dialog renders
    const timer = setTimeout(playVideo, 100)

    return () => {
      clearTimeout(timer)
      if (hls) hls.destroy()
      video.pause()
      video.src = ""
    }
  }, [open, videoUrl])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 bg-black max-w-screen h-screen">
        {/* ⚡ Required for accessibility */}
        <DialogTitle className="sr-only">Movie Player</DialogTitle>

        <video
          ref={videoRef}
          controls
          playsInline
          muted
          className="w-full h-full object-contain bg-black"
        />
      </DialogContent>
    </Dialog>
  )
}
