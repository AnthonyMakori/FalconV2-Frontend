'use client'
import MediaUpload from "./MediaUpload"

export default function MediaUploadSection({ poster, setPoster, trailer, setTrailer, movie, setMovie, subtitles, setSubtitles, uploadingMovie }: any) {
  return (
    <div className="space-y-6">
      <MediaUpload label="Poster Image" accept="image/*" onChange={setPoster} />
      <MediaUpload label="Trailer Video" accept="video/*" onChange={setTrailer} />
      <MediaUpload label="Full Movie (Bunny Upload)" accept="video/*" onChange={setMovie} />
      {uploadingMovie && <p className="text-sm text-muted-foreground">Uploading movie to Bunny CDN...</p>}
      <MediaUpload label="Subtitles" accept=".srt,.vtt" multiple onChangeMultiple={setSubtitles} />
    </div>
  )
}
