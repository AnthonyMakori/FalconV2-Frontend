"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Hls from "hls.js"

interface VideoPlayerModalProps {
  open: boolean
  onClose: () => void
  videoUrl: string | null
  title?: string
  logoSrc?: string // Your intro logo
  logoDuration?: number // How long to show logo in ms
}

export function VideoPlayerModal({
  open,
  onClose,
  videoUrl,
  title,
  logoSrc,
  logoDuration = 3000, // default 3 seconds
}: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showLogo, setShowLogo] = useState(!!logoSrc)

  // Handle logo animation timing
  useEffect(() => {
    if (!open) return

    if (logoSrc) {
      setShowLogo(true)
      const timer = setTimeout(() => setShowLogo(false), logoDuration)
      return () => clearTimeout(timer)
    } else {
      setShowLogo(false)
    }
  }, [open, logoSrc, logoDuration])

  // Handle video playback
  useEffect(() => {
    if (!open || !videoUrl || showLogo) return // wait until logo disappears

    const video = videoRef.current
    if (!video) return

    console.log("[VideoPlayer] Attempting to play video:", videoUrl)

    video.src = ""
    video.load()

    const onError = (e: any) =>
      console.error("[VideoPlayer] HTML5 video error:", e, video.error)
    const onCanPlay = () =>
      video.play().catch(err => console.error("[VideoPlayer] play() rejected:", err))

    video.addEventListener("error", onError)
    video.addEventListener("canplay", onCanPlay)

    let hls: Hls | null = null
    if (videoUrl.endsWith(".m3u8")) {
      if (Hls.isSupported()) {
        hls = new Hls()
        hls.loadSource(videoUrl)
        hls.attachMedia(video)
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoUrl
      } else {
        console.error("[VideoPlayer] HLS not supported")
      }
    } else {
      video.src = videoUrl
    }

    return () => {
      video.pause()
      video.removeEventListener("error", onError)
      video.removeEventListener("canplay", onCanPlay)
      if (hls) hls.destroy()
      video.src = ""
    }
  }, [open, videoUrl, showLogo])

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="p-0 bg-black max-w-screen h-screen flex flex-col items-center justify-center relative">
        
        {/* Logo Animation Overlay */}
        {showLogo && logoSrc && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
            <img
              src={logoSrc}
              alt="Company Logo"
              className="w-48 h-auto animate-fade-in-out"
            />
          </div>
        )}

        {/* Movie Title */}
        {title && !showLogo && (
          <div className="absolute top-4 left-4 text-white z-10 text-xl font-semibold drop-shadow-lg">
            {title}
          </div>
        )}

        {/* Video Player */}
        {!showLogo && (
          <video
            ref={videoRef}
            controls
            autoPlay
            playsInline
            muted={false}
            className="w-full h-full object-contain bg-black"
          />
        )}

        {/* Close Button */}
        <div className="absolute top-4 right-4 z-10">
          <Button variant="outline" onClick={onClose}>
            ✕
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
