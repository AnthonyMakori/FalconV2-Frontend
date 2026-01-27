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
  videoUrl: string | null // can be mp4 or m3u8
}

export function VideoPlayerModal({ open, onClose, videoUrl }: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!isPlaying || !videoUrl || !videoRef.current) return

    const video = videoRef.current

    // If HLS
    if (videoUrl.endsWith(".m3u8") && Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(videoUrl)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(console.error)
      })
      return () => {
        hls.destroy()
      }
    } else {
      // Normal mp4
      video.src = videoUrl
      video.play().catch(console.error)
    }
  }, [isPlaying, videoUrl])

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="p-0 bg-black max-w-screen h-screen flex items-center justify-center">
        {/* Accessibility */}
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
