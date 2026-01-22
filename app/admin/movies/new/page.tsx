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
const BUNNY_LIBRARY_ID = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID!
const BUNNY_ACCESS_KEY = process.env.NEXT_PUBLIC_BUNNY_STREAM_API_KEY!

/* -------------------- Circular Progress -------------------- */
const CircularProgress = ({ value }: { value: number }) => {
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="relative w-28 h-28">
      <svg className="w-full h-full -rotate-90">
        <circle
          cx="56"
          cy="56"
          r={radius}
          strokeWidth="8"
          fill="transparent"
          className="text-muted stroke-current"
        />
        <circle
          cx="56"
          cy="56"
          r={radius}
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-primary stroke-current transition-all duration-200"
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
        {value}%
      </div>
    </div>
  )
}

export default function NewMoviePage() {
  const [loading, setLoading] = useState(false)
  const [uploadingMovie, setUploadingMovie] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  /* -------------------- Basic Info -------------------- */
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

  /* -------------------- Media -------------------- */
  const [poster, setPoster] = useState<File | null>(null)
  const [trailer, setTrailer] = useState<File | null>(null)
  const [movie, setMovie] = useState<File | null>(null)
  const [subtitles, setSubtitles] = useState<File[]>([])

  /* -------------------- Pricing -------------------- */
  const [rentalPrice, setRentalPrice] = useState("")
  const [purchasePrice, setPurchasePrice] = useState("")
  const [rentalPeriod, setRentalPeriod] = useState("")
  const [freePreview, setFreePreview] = useState(false)
  const [previewDuration, setPreviewDuration] = useState("")

  /* -------------------- SEO -------------------- */
  const [seoTitle, setSeoTitle] = useState("")
  const [seoDescription, setSeoDescription] = useState("")
  const [seoKeywords, setSeoKeywords] = useState("")

  /* -------------------- Bunny Upload (with progress) -------------------- */
  const uploadVideoToBunny = (file: File): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      if (!BUNNY_LIBRARY_ID || !BUNNY_ACCESS_KEY) {
        reject("Bunny credentials missing")
        return
      }

      try {
        // 1️⃣ Create video
        const createRes = await fetch(
          `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos`,
          {
            method: "POST",
            headers: {
              AccessKey: BUNNY_ACCESS_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: file.name }),
          }
        )

        if (!createRes.ok) {
          reject(await createRes.text())
          return
        }

        const { guid } = await createRes.json()

        // 2️⃣ Upload file with progress
        const xhr = new XMLHttpRequest()
        xhr.open(
          "PUT",
          `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos/${guid}`
        )

        xhr.setRequestHeader("AccessKey", BUNNY_ACCESS_KEY)
        xhr.setRequestHeader("Content-Type", "application/octet-stream")

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setUploadProgress(Math.round((e.loaded / e.total) * 100))
          }
        }

        xhr.onload = () => {
          xhr.status >= 200 && xhr.status < 300
            ? resolve(guid)
            : reject(xhr.responseText)
        }

        xhr.onerror = () => reject("Upload failed")

        xhr.send(file)
      } catch (err) {
        reject(err)
      }
    })
  }

  /* -------------------- Reset Form -------------------- */
  const resetForm = () => {
    setTitle("")
    setDescription("")
    setReleaseYear("")
    setDuration("")
    setLanguage("")
    setGenre("")
    setStatus("draft")
    setCasts([])
    setCastInput("")
    setTags([])
    setTagInput("")
    setPoster(null)
    setTrailer(null)
    setMovie(null)
    setSubtitles([])
    setRentalPrice("")
    setPurchasePrice("")
    setRentalPeriod("")
    setFreePreview(false)
    setPreviewDuration("")
    setSeoTitle("")
    setSeoDescription("")
    setSeoKeywords("")
    setUploadProgress(0)
  }

  /* -------------------- Submit Movie -------------------- */
  const submitMovie = async (publish = false) => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      let bunnyVideoId: string | null = null

      if (movie) {
        setUploadingMovie(true)
        bunnyVideoId = await uploadVideoToBunny(movie)
        setUploadingMovie(false)
      }

      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("release_year", releaseYear)
      formData.append("duration", duration)
      formData.append("language", language)
      formData.append("genre", genre)
      formData.append("status", publish ? "published" : status)

      formData.append("rental_price", rentalPrice)
      formData.append("purchase_price", purchasePrice)
      formData.append("rental_period", rentalPeriod)
      formData.append("free_preview", freePreview ? "1" : "0")
      formData.append("preview_duration", previewDuration)

      formData.append("seo_title", seoTitle)
      formData.append("seo_description", seoDescription)
      formData.append("seo_keywords", seoKeywords)

      casts.forEach(c => formData.append("casts[]", c))
      tags.forEach(t => formData.append("tags[]", t))

      if (poster) formData.append("poster", poster)
      if (trailer) formData.append("trailer", trailer)
      subtitles.forEach(s => formData.append("subtitles[]", s))
      if (bunnyVideoId) formData.append("bunny_video_id", bunnyVideoId)

      const res = await fetch(`${API_URL}/movies`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (!res.ok) throw await res.json()

      alert("Movie saved successfully 🎉")
      resetForm()
    } catch (err: any) {
      console.error(err)
      alert("Failed: " + (err.message || JSON.stringify(err)))
    } finally {
      setLoading(false)
      setUploadingMovie(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/movies">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Add New Movie</h1>
      </div>

      <Tabs defaultValue="basic">
        <TabsList>
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <BasicInfo {...{
            title, setTitle, description, setDescription,
            releaseYear, setReleaseYear, duration, setDuration,
            language, setLanguage, genre, setGenre,
            status, setStatus,
            casts, addCast, removeCast, castInput, setCastInput,
            tags, addTag, removeTag, tagInput, setTagInput
          }} />
        </TabsContent>

        <TabsContent value="media">
          <MediaUploadSection {...{
            poster, setPoster, trailer, setTrailer,
            movie, setMovie, subtitles, setSubtitles,
            uploadingMovie
          }} />
          {uploadingMovie && (
            <div className="flex justify-center mt-6">
              <CircularProgress value={uploadProgress} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="pricing">
          <PricingInfo {...{
            rentalPrice, setRentalPrice,
            purchasePrice, setPurchasePrice,
            rentalPeriod, setRentalPeriod,
            freePreview, setFreePreview,
            previewDuration, setPreviewDuration
          }} />
        </TabsContent>

        <TabsContent value="seo">
          <SeoInfo {...{
            seoTitle, setSeoTitle,
            seoDescription, setSeoDescription,
            seoKeywords, setSeoKeywords
          }} />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          disabled={loading || uploadingMovie}
          onClick={() => submitMovie(false)}
        >
          Save as Draft
        </Button>

        <Button
          disabled={loading || uploadingMovie}
          onClick={() => submitMovie(true)}
        >
          Publish Movie
        </Button>
      </div>
    </div>
  )
}
