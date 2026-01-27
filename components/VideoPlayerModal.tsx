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
    if (!isPlaying || !videoUrl) return

    const video = videoRef.current
    if (!video) return

    console.log("Starting video playback for URL:", videoUrl)

    if (videoUrl.endsWith(".m3u8")) {
      if (Hls.isSupported()) {
        const hls = new Hls()
        hls.loadSource(videoUrl)
        hls.attachMedia(video)
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log("HLS manifest parsed, playing video...")
          video.play().catch((err) => console.error("HLS play error:", err))
        })
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS.js error:", data)
        })
        return () => hls.destroy()
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoUrl
        video.play().catch((err) => console.error("Native HLS play error:", err))
      } else {
        console.error("HLS not supported in this browser")
      }
    } else {
      // mp4 fallback
      video.src = videoUrl
      video.play().catch((err) => console.error("MP4 play error:", err))
    }
  }, [isPlaying, videoUrl])

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="p-0 bg-black max-w-screen h-screen flex items-center justify-center">
        <DialogTitle className="sr-only">Movie Player</DialogTitle>
        <DialogDescription className="sr-only">
          Plays the selected movie
        </DialogDescription>

        {!isPlaying ? (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <Button
              onClick={() => setIsPlaying(true)}
              className="px-8 py-4 text-lg"
            >
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
