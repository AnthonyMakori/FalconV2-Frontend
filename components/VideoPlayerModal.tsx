"use client"

import { useEffect, useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Hls from "hls.js"

interface VideoPlayerModalProps {
  open: boolean
  onClose: () => void
  videoUrl: string | null
}

export function VideoPlayerModal({ open, onClose, videoUrl }: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!isPlaying) {
      console.log("[VideoPlayer] Waiting for user to click Play")
      return
    }

    if (!videoUrl) {
      console.error("[VideoPlayer] videoUrl is null or undefined!")
      return
    }

    const video = videoRef.current
    if (!video) {
      console.error("[VideoPlayer] videoRef is null")
      return
    }

    console.log("[VideoPlayer] Attempting to play video:", videoUrl)

    video.src = "" // reset previous source
    video.load()

    // Listen for native errors
    const onError = (e: any) => {
      console.error("[VideoPlayer] HTML5 video error:", e, video.error)
    }
    video.addEventListener("error", onError)

    // Listen for canplay
    const onCanPlay = () => {
      console.log("[VideoPlayer] Video can play, trying to play...")
      video.play()
        .then(() => console.log("[VideoPlayer] Video started successfully"))
        .catch((err) => console.error("[VideoPlayer] Video play() rejected:", err))
    }
    video.addEventListener("canplay", onCanPlay)

    if (videoUrl.endsWith(".m3u8")) {
      console.log("[VideoPlayer] Detected HLS stream")
      if (Hls.isSupported()) {
        const hls = new Hls()
        hls.loadSource(videoUrl)
        hls.attachMedia(video)
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log("[VideoPlayer] HLS manifest parsed")
        })
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("[VideoPlayer] HLS.js error:", data)
        })
        return () => {
          hls.destroy()
          video.removeEventListener("error", onError)
          video.removeEventListener("canplay", onCanPlay)
        }
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        console.log("[VideoPlayer] Browser supports native HLS")
        video.src = videoUrl
      } else {
        console.error("[VideoPlayer] HLS not supported in this browser")
      }
    } else {
      console.log("[VideoPlayer] Assuming MP4 or standard video format")
      video.src = videoUrl
    }

    return () => {
      video.removeEventListener("error", onError)
      video.removeEventListener("canplay", onCanPlay)
    }
  }, [isPlaying, videoUrl])

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="p-0 bg-black max-w-screen h-screen flex items-center justify-center">
        <DialogTitle className="sr-only">Movie Player</DialogTitle>
        <DialogDescription className="sr-only">Plays the selected movie</DialogDescription>

        {!isPlaying ? (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <Button onClick={() => setIsPlaying(true)} className="px-8 py-4 text-lg">
              ▶ Play Movie
            </Button>
          </div>
        ) : (
          <video
            ref={videoRef}
            controls
            playsInline
            muted={false}
            className="w-full h-full object-contain bg-black"
          />
        )}

        <DialogFooter className="absolute top-4 right-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
