"use client"

import { useState, useEffect } from "react"
import { Play, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface VideoPlayerVideo {
  id: string
  key: string
  name: string
  type: string
  site: string
}

interface VideoPlayerProps {
  videos: VideoPlayerVideo[]
  currentIndex?: number
  onVideoChange?: (index: number) => void
  autoPlay?: boolean
}

export default function VideoPlayer({
  videos,
  currentIndex = 0,
  onVideoChange,
  autoPlay = false,
}: VideoPlayerProps) {
  const [selectedIndex, setSelectedIndex] = useState(currentIndex)
  const [isMuted, setIsMuted] = useState(false)

  const selectedVideo = videos[selectedIndex]

  // Sync parent index changes
  useEffect(() => {
    if (currentIndex !== selectedIndex) {
      setSelectedIndex(currentIndex)
    }
  }, [currentIndex])

  // Notify parent when selectedIndex changes
  useEffect(() => {
    onVideoChange?.(selectedIndex)
  }, [selectedIndex])

  // Autoplay first video
  useEffect(() => {
    if (autoPlay && selectedVideo) {
      // For YouTube iframe, autoplay handled via URL
    }
  }, [selectedVideo, autoPlay])

  if (!videos || videos.length === 0) {
    return (
      <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No videos available</p>
      </div>
    )
  }

  const trailers = videos.filter((v) => v.type === "Trailer")
  const clips = videos.filter((v) => v.type === "Clip")
  const teasers = videos.filter((v) => v.type === "Teaser")

  const renderVideoSection = (label: string, sectionVideos: VideoPlayerVideo[]) => {
    if (!sectionVideos || sectionVideos.length === 0) return null
    return (
      <div>
        <h4 className="text-sm font-medium mb-2 text-muted-foreground">{label}</h4>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {sectionVideos.map((video, idx) => (
            <VideoThumbnail
              key={video.id}
              video={video}
              isSelected={video.id === selectedVideo.id}
              onClick={() => setSelectedIndex(videos.indexOf(video))}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main video player */}
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group">
        <iframe
          src={`https://www.youtube.com/embed/${selectedVideo.key}?autoplay=${autoPlay ? 1 : 0
            }&mute=${isMuted ? 1 : 0}&rel=0&modestbranding=1`}
          title={selectedVideo.name}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />

        {/* Video controls overlay */}
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

      {/* Video selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Current: {selectedVideo.name}</h3>
        {renderVideoSection("Trailers", trailers)}
        {renderVideoSection("Clips", clips)}
        {renderVideoSection("Teasers", teasers)}
      </div>
    </div>
  )
}

function VideoThumbnail({
  video,
  isSelected,
  onClick,
}: {
  video: VideoPlayerVideo
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex-shrink-0 w-32 h-20 rounded overflow-hidden group transition-all",
        isSelected ? "ring-2 ring-primary" : "hover:scale-105",
      )}
    >
      <img
        src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
        alt={video.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Play className="h-6 w-6 text-white drop-shadow-lg" />
      </div>
      <div className="absolute bottom-1 left-1 right-1">
        <p className="text-xs text-white font-medium truncate drop-shadow-lg">{video.name}</p>
      </div>
    </button>
  )
}
