import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
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

    const playVideo = () => {
      if (videoUrl.endsWith(".m3u8")) {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          // Safari native HLS
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
        // Normal MP4 fallback
        video.src = videoUrl
      }

      video.play().catch((err) => {
        console.warn("Autoplay failed, user interaction required:", err)
      })
    }

    const timer = setTimeout(playVideo, 100)

    return () => {
      clearTimeout(timer)
      if (hls) {
        hls.destroy()
      }
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
          className="w-full h-full object-contain bg-black"
        />
      </DialogContent>
    </Dialog>
  )
}
