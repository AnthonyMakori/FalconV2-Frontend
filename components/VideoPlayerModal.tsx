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
  logoSrc?: string
  logoDuration?: number
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

 /* --------------------------------------------------
 * Orientation lock (TypeScript-safe, no DOM lib deps)
 * -------------------------------------------------- */
useEffect(() => {
  if (!open) return

  type OrientationLock =
    | "any"
    | "natural"
    | "landscape"
    | "portrait"
    | "portrait-primary"
    | "portrait-secondary"
    | "landscape-primary"
    | "landscape-secondary"

  const orientation = screen.orientation as
    | {
        lock?: (orientation: OrientationLock) => Promise<void>
        unlock?: () => void
      }
    | undefined

  const lockOrientation = async () => {
    try {
      if (orientation?.lock) {
        await orientation.lock("landscape")
        console.log("[VideoPlayer] Orientation locked")
      }
    } catch (err) {
      console.warn("[VideoPlayer] Orientation lock failed", err)
    }
  }

  lockOrientation()

  return () => {
    try {
      orientation?.unlock?.()
    } catch {}
  }
}, [open])


  /* --------------------------------------------------
   * Logo animation
   * -------------------------------------------------- */
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

  /* --------------------------------------------------
   * Video + HLS handling
   * -------------------------------------------------- */
  useEffect(() => {
    if (!open || !videoUrl || showLogo) return

    const video = videoRef.current
    if (!video) return

    video.src = ""
    video.load()
    setError(null)

    const onError = (e: any) => {
      console.error("[VideoPlayer] HTML5 error:", e, video.error)
      setError("Failed to play video. Please try again later.")
    }

    const onCanPlay = async () => {
      try {
        // Request fullscreen for better rotation behavior
        if (video.requestFullscreen) {
          await video.requestFullscreen()
        }

        await video.play()
        console.log("[VideoPlayer] Playback started")
      } catch (err) {
        console.warn("[VideoPlayer] Autoplay blocked:", err)
        setError("Tap play to start the video.")
      }
    }

    video.addEventListener("error", onError)
    video.addEventListener("canplay", onCanPlay)

    let hls: Hls | null = null

    if (videoUrl.endsWith(".m3u8")) {
      if (Hls.isSupported()) {
        hls = new Hls()
        hls.loadSource(videoUrl)
        hls.attachMedia(video)

        hls.on(Hls.Events.ERROR, (_event, data) => {
          console.error("[VideoPlayer] HLS error:", data)
          setError("Error loading video stream.")
        })
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoUrl
      } else {
        setError("HLS not supported in this browser.")
      }
    } else {
      video.src = videoUrl
    }

    return () => {
      video.pause()
      video.removeEventListener("error", onError)
      video.removeEventListener("canplay", onCanPlay)
      hls?.destroy()
      video.src = ""
    }
  }, [open, videoUrl, showLogo])

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogPortal>
        <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
          {/* Logo overlay */}
          {showLogo && logoSrc && (
            <div className="absolute inset-0 flex items-center justify-center z-30">
              <img
                src={logoSrc}
                alt="Intro Logo"
                className="w-56 h-auto animate-fade-in-out"
              />
            </div>
          )}

          {/* Title */}
          {title && !showLogo && (
            <div className="absolute top-6 left-6 z-20 text-white text-2xl font-semibold drop-shadow-lg">
              {title}
            </div>
          )}

          {/* Video */}
          {!showLogo && !error && (
            <div className="w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                controls
                playsInline
                muted={false}
                className="
                  w-full h-full object-contain
                  portrait:rotate-90
                  portrait:w-[100vh]
                  portrait:h-[100vw]
                "
              />
            </div>
          )}

          {/* Error */}
          {error && !showLogo && (
            <div className="absolute inset-0 z-40 flex items-center justify-center px-4 text-center text-white text-lg">
              {error}
            </div>
          )}

          {/* Close */}
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
