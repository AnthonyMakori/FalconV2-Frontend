"use client"

import { useState, useEffect } from "react"
import { Play, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { isLocalVideo } from "@/lib/video-utils"

interface Video {
  id: string
  key: string
  name: string
  type: string
  site: string
}

export default function VideoPlayer({ videos }: { videos: Video[] }) {
  const [selectedVideo, setSelectedVideo] = useState(videos[0])
  const [isMuted, setIsMuted] = useState(false)

  /* ================= DEBUG LOGS ================= */
  useEffect(() => {
    console.group("🎬 VideoPlayer INIT")
    console.log("All videos:", videos)
    console.log("Initial selected video:", videos[0])
    console.groupEnd()
  }, [videos])

  useEffect(() => {
    console.group("▶️ Selected Video Changed")
    console.log("Video object:", selectedVideo)
    console.log("Video URL:", selectedVideo?.key)
    console.log("isLocalVideo:", isLocalVideo(selectedVideo?.key))
    console.groupEnd()
  }, [selectedVideo])

  if (!videos || videos.length === 0) {
    return (
      <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No videos available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* MAIN PLAYER */}
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group">
        {isLocalVideo(selectedVideo.key) ? (
          <video
            key={selectedVideo.key} // 🔑 force reload when switching
            src={selectedVideo.key}
            controls
            autoPlay
            muted={isMuted}
            className="w-full h-full object-contain"
            onLoadedMetadata={() => {
              console.log("✅ Video metadata loaded:", selectedVideo.key)
            }}
            onCanPlay={() => {
              console.log("✅ Video can play:", selectedVideo.key)
            }}
            onError={(e) => {
              const videoEl = e.currentTarget
              console.error("❌ VIDEO ERROR")
              console.error("src:", videoEl.src)
              console.error("error code:", videoEl.error?.code)
              console.error("error message:", videoEl.error)
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Unsupported video format
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className="bg-black/50 hover:bg-black/70"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* VIDEO SELECTOR */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">
          Now Playing: {selectedVideo.name}
        </h3>

        <div className="flex gap-3 overflow-x-auto">
          {videos.map((video) => (
            <button
              key={video.id}
              onClick={() => {
                console.log("🖱 Switching to video:", video)
                setSelectedVideo(video)
              }}
              className={cn(
                "relative w-40 h-24 rounded overflow-hidden bg-black flex items-center justify-center transition-all",
                selectedVideo.id === video.id
                  ? "ring-2 ring-primary"
                  : "hover:scale-105"
              )}
            >
              <Play className="h-8 w-8 text-white opacity-80" />
              <span className="absolute bottom-1 left-1 right-1 text-xs text-white truncate">
                {video.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
