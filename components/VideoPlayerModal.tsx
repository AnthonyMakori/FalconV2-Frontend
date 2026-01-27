import { Dialog, DialogContent } from "@/components/ui/dialog"
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
      // ⚡ Mute for autoplay
      video.muted = true

      if (videoUrl.endsWith(".m3u8")) {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          // Safari native HLS
          video.src = videoUrl
        } else if (Hls.isSupported()) {
          // HLS.js for Chrome/Firefox/Edge
          hls = new Hls()
          hls.loadSource(videoUrl)
          hls.attachMedia(video)
        } else {
          console.error("HLS not supported in this browser")
          return
        }
      } else {
        // MP4 fallback
        video.src = videoUrl
      }

      try {
        await video.play()
        console.log("Video autoplayed successfully")
      } catch (err) {
        console.warn("Autoplay blocked, user interaction required:", err)
      }

      // ⚡ Optional: unmute after user interacts
      video.addEventListener("click", () => {
        if (video.muted) {
          video.muted = false
        }
      })
    }

    // Delay slightly to ensure dialog renders fully
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
        <video
          ref={videoRef}
          controls
          playsInline
          muted // ⚡ important for autoplay
          className="w-full h-full object-contain bg-black"
        />
      </DialogContent>
    </Dialog>
  )
}
