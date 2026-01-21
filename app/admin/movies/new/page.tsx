'use client'

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import BasicInfo from "@/components/admin/movies/BasicInfo"
import MediaUploadSection from "@/components/admin/movies/MediaUploadSection"
import PricingInfo from "@/components/admin/movies/PricingInfo"
import SeoInfo from "@/components/admin/movies/SeoInfo"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

/**
 * Upload video file to Bunny CDN (NO axios, fully typed)
 */
const uploadVideoToBunny = (
  uploadUrl: string,
  file: File,
  onProgress: (percent: number) => void
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.open("PUT", uploadUrl, true)

    xhr.setRequestHeader(
      "AccessKey",
      process.env.NEXT_PUBLIC_BUNNY_STREAM_API_KEY!
    )
    xhr.setRequestHeader(
      "Content-Type",
      "application/octet-stream"
    )

    xhr.upload.onprogress = (event: ProgressEvent<EventTarget>) => {
      if (event.lengthComputable) {
        const percent = Math.round(
          (event.loaded * 100) / event.total
        )
        onProgress(percent)
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve()
      } else {
        reject(
          new Error(`Bunny upload failed (${xhr.status})`)
        )
      }
    }

    xhr.onerror = () => {
      reject(new Error("Network error during Bunny upload"))
    }

    xhr.send(file)
  })
}

export default function NewMoviePage() {
  const [loading, setLoading] = useState(false)
  const [uploadingMovie, setUploadingMovie] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Basic Info
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [releaseYear, setReleaseYear] = useState("")
  const [duration, setDuration] = useState("")
  const [language, setLanguage] = useState("")
  const [genre, setGenre] = useState("")
  const [status, setStatus] = useState("draft")
  const [casts, setCasts] = useState<string[]>([])
  const [castInput, setCastInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  // Media
  const [poster, setPoster] = useState<File | null>(null)
  const [trailer, setTrailer] = useState<File | null>(null)
  const [movie, setMovie] = useState<File | null>(null)
  const [subtitles, setSubtitles] = useState<File[]>([])

  // Pricing
  const [rentalPrice, setRentalPrice] = useState("")
  const [purchasePrice, setPurchasePrice] = useState("")
  const [rentalPeriod, setRentalPeriod] = useState("")
  const [freePreview, setFreePreview] = useState(false)
  const [previewDuration, setPreviewDuration] = useState("")

  // SEO
  const [seoTitle, setSeoTitle] = useState("")
  const [seoDescription, setSeoDescription] = useState("")
  const [seoKeywords, setSeoKeywords] = useState("")

  // Helpers
  const addCast = () => {
    if (castInput.trim()) {
      setCasts([...casts, castInput.trim()])
      setCastInput("")
    }
  }

  const removeCast = (c: string) =>
    setCasts(casts.filter(x => x !== c))

  const addTag = () => {
    if (tagInput.trim()) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (t: string) =>
    setTags(tags.filter(x => x !== t))

  /**
   * SUBMIT MOVIE (Correct Bunny Flow)
   */
  const submitMovie = async (publish = false) => {
    if (!poster || !movie) {
      alert("Poster and movie file are required")
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem("token")

      /**
       * STEP 1: Send metadata to Laravel
       */
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("price", rentalPrice || "0")
      formData.append("currency", "USD")
      formData.append("category", genre)
      formData.append("date_released", releaseYear)
      formData.append("poster", poster)

      const metaRes = await fetch(`${API_URL}/upload-movie`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!metaRes.ok) {
        throw new Error("Failed to save movie metadata")
      }

      const meta = await metaRes.json()

      /**
       * STEP 2: Upload video to Bunny CDN
       */
      setUploadingMovie(true)

      await uploadVideoToBunny(
        meta.uploadUrl,
        movie,
        (percent: number) => setUploadProgress(percent)
      )

      alert("Movie uploaded successfully 🎉")
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message)
      } else {
        alert("Unknown upload error")
      }
      console.error(err)
    } finally {
      setLoading(false)
      setUploadingMovie(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/movies">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Add New Movie</h1>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="basic">
        <TabsList>
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <BasicInfo
            title={title} setTitle={setTitle}
            description={description} setDescription={setDescription}
            releaseYear={releaseYear} setReleaseYear={setReleaseYear}
            duration={duration} setDuration={setDuration}
            language={language} setLanguage={setLanguage}
            genre={genre} setGenre={setGenre}
            status={status} setStatus={setStatus}
            casts={casts}
            addCast={addCast}
            removeCast={removeCast}
            castInput={castInput}
            setCastInput={setCastInput}
            tags={tags}
            addTag={addTag}
            removeTag={removeTag}
            tagInput={tagInput}
            setTagInput={setTagInput}
          />
        </TabsContent>

        <TabsContent value="media">
          <MediaUploadSection
            poster={poster} setPoster={setPoster}
            trailer={trailer} setTrailer={setTrailer}
            movie={movie} setMovie={setMovie}
            subtitles={subtitles} setSubtitles={setSubtitles}
            uploadingMovie={uploadingMovie}
          />

          {uploadingMovie && (
            <p className="text-sm text-muted-foreground mt-2">
              Uploading to Bunny CDN… {uploadProgress}%
            </p>
          )}
        </TabsContent>

        <TabsContent value="pricing">
          <PricingInfo
            rentalPrice={rentalPrice} setRentalPrice={setRentalPrice}
            purchasePrice={purchasePrice} setPurchasePrice={setPurchasePrice}
            rentalPeriod={rentalPeriod} setRentalPeriod={setRentalPeriod}
            freePreview={freePreview} setFreePreview={setFreePreview}
            previewDuration={previewDuration} setPreviewDuration={setPreviewDuration}
          />
        </TabsContent>

        <TabsContent value="seo">
          <SeoInfo
            seoTitle={seoTitle} setSeoTitle={setSeoTitle}
            seoDescription={seoDescription} setSeoDescription={setSeoDescription}
            seoKeywords={seoKeywords} setSeoKeywords={setSeoKeywords}
          />
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" disabled={loading} onClick={() => submitMovie(false)}>
          Save as Draft
        </Button>
        <Button disabled={loading} onClick={() => submitMovie(true)}>
          Publish Movie
        </Button>
      </div>

    </div>
  )
}
