"use client"

import { useState, useEffect } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { isLocalVideo } from "@/lib/video-utils"

interface Video {
  id: string
  key: string
  name: string
  type: string
  site: string
}

export default function VideoPlayer({ videos }: { videos: Video[] }) {
  const [isMuted, setIsMuted] = useState(false)

  const selectedVideo = videos?.[0] 

  useEffect(() => {
    console.group("🎬 Auto Video Player INIT")
    console.log("Videos received:", videos)
    console.log("Auto playing video:", selectedVideo)
    console.groupEnd()
  }, [videos, selectedVideo])

  if (!videos || videos.length === 0 || !selectedVideo) {
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
            key={selectedVideo.key}
            src={selectedVideo.key}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            controls={false} 
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Unsupported video format
          </div>
        )}

        {/* Mute Control Only */}
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className="bg-black/50 hover:bg-black/70"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <h3 className="text-lg font-semibold">
        Now Playing: {selectedVideo.name}
      </h3>
    </div>
  )
}
