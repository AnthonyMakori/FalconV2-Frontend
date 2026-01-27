"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogPortal } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Hls from "hls.js"

interface VideoPlayerModalProps {
  open: boolean
  onClose: () => void
  videoUrl: string | null
  title?: string
  logoSrc?: string // Intro logo
  logoDuration?: number // Duration to show logo in ms
}

export function VideoPlayerModal({
  open,
  onClose,
  videoUrl,
  title,
  logoSrc,
  logoDuration = 3000,
}: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [showLogo, setShowLogo] = useState(!!logoSrc)
  const [error, setError] = useState<string | null>(null)

  // Logo animation
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

  // Video playback + HLS + error handling
  useEffect(() => {
    if (!open || !videoUrl || showLogo) return

    const video = videoRef.current
    if (!video) return

    video.src = ""
    video.load()
    setError(null)

    const onError = (e: any) => {
      console.error("[VideoPlayer] HTML5 video error:", e, video.error)
      setError("Failed to play video. Please try again later.")
    }

    const onCanPlay = () => {
      video
        .play()
        .then(() => console.log("[VideoPlayer] Video started"))
        .catch((err) => {
          console.error("[VideoPlayer] play() rejected:", err)
          setError("Autoplay blocked. Please tap Play.")
        })
    }

    video.addEventListener("error", onError)
    video.addEventListener("canplay", onCanPlay)

    let hls: Hls | null = null

    if (videoUrl.endsWith(".m3u8")) {
      if (Hls.isSupported()) {
        try {
          hls = new Hls()
          hls.loadSource(videoUrl)
          hls.attachMedia(video)
          hls.on(Hls.Events.MANIFEST_PARSED, () =>
            console.log("[VideoPlayer] HLS manifest parsed")
          )
          hls.on(Hls.Events.ERROR, (_event, data) => {
            console.error("[VideoPlayer] HLS.js error:", data)
            setError("Error loading HLS stream")
          })
        } catch (err) {
          console.error("[VideoPlayer] HLS setup failed:", err)
          setError("Error initializing video stream")
        }
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoUrl
      } else {
        console.error("[VideoPlayer] HLS not supported")
        setError("HLS not supported in this browser")
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

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogPortal>
        {/* Fullscreen wrapper */}
        <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
          {/* Logo overlay */}
          {showLogo && logoSrc && (
            <div className="absolute inset-0 flex items-center justify-center z-30">
              <img
                src={logoSrc}
                alt="Company Logo"
                className="w-56 h-auto animate-fade-in-out"
              />
            </div>
          )}

          {/* Title overlay */}
          {title && !showLogo && (
            <div className="absolute top-6 left-6 text-white z-20 text-2xl font-semibold drop-shadow-lg">
              {title}
            </div>
          )}

          {/* Video player */}
          {!showLogo && !error && (
            <video
              ref={videoRef}
              controls
              autoPlay
              playsInline
              muted={false}
              className="w-full h-full object-contain"
            />
          )}

          {/* Error message */}
          {error && !showLogo && (
            <div className="absolute inset-0 flex items-center justify-center text-white text-lg z-40 px-4 text-center">
              {error}
            </div>
          )}

          {/* Close button */}
          <div className="absolute top-6 right-6 z-50">
            <Button variant="outline" onClick={onClose} className="text-white">
              ✕
            </Button>
          </div>
        </div>
      </DialogPortal>
    </Dialog>
  )
}
