import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { useEffect, useRef } from "react"

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
    const video = videoRef.current
    if (!video) return

    // Auto-play when opened
    if (open) {
      video.play().catch(() => {})
    }

    // Auto fullscreen on mobile
    const handleOrientation = () => {
      if (window.innerWidth < 768 && video.requestFullscreen) {
        video.requestFullscreen().catch(() => {})
      }
    }

    window.addEventListener("orientationchange", handleOrientation)

    return () => {
      window.removeEventListener("orientationchange", handleOrientation)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 bg-black max-w-screen h-screen">
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          playsInline
          autoPlay
          className="w-full h-full object-contain bg-black"
        />
      </DialogContent>
    </Dialog>
  )
}
