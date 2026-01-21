"use client"

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

export default function NewMoviePage() {
  const [loading, setLoading] = useState(false)
  const [uploadingMovie, setUploadingMovie] = useState(false)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [releaseYear, setReleaseYear] = useState("")
  const [duration, setDuration] = useState("")
  const [language, setLanguage] = useState("")
  const [genre, setGenre] = useState("")
  const [status, setStatus] = useState("draft")

  const [casts, setCasts] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])

  const [poster, setPoster] = useState<File | null>(null)
  const [trailer, setTrailer] = useState<File | null>(null)
  const [movie, setMovie] = useState<File | null>(null)
  const [subtitles, setSubtitles] = useState<File[]>([])

  const [rentalPrice, setRentalPrice] = useState("")
  const [purchasePrice, setPurchasePrice] = useState("")
  const [rentalPeriod, setRentalPeriod] = useState("")
  const [freePreview, setFreePreview] = useState(false)
  const [previewDuration, setPreviewDuration] = useState("")

  const [seoTitle, setSeoTitle] = useState("")
  const [seoDescription, setSeoDescription] = useState("")
  const [seoKeywords, setSeoKeywords] = useState("")

  const uploadToBunny = async (file: File) => {
    const res = await fetch(
      `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos`,
      {
        method: "POST",
        headers: { AccessKey: BUNNY_ACCESS_KEY },
        body: (() => {
          const f = new FormData()
          f.append("title", file.name)
          f.append("file", file)
          return f
        })()
      }
    )

    if (!res.ok) throw new Error("Bunny upload failed")
    const data = await res.json()
    return data.guid
  }

  const submitMovie = async (publish = false) => {
    setLoading(true)
    try {
      let bunnyVideoId = null

      if (movie) {
        setUploadingMovie(true)
        bunnyVideoId = await uploadToBunny(movie)
        setUploadingMovie(false)
      }

      const form = new FormData()
      form.append("title", title)
      form.append("description", description)
      form.append("release_year", releaseYear)
      form.append("duration", duration)
      form.append("language", language)
      form.append("genre", genre)
      form.append("status", publish ? "published" : status)

      form.append("rental_price", rentalPrice)
      form.append("purchase_price", purchasePrice)
      form.append("rental_period", rentalPeriod)
      form.append("free_preview", freePreview ? "1" : "0")
      form.append("preview_duration", previewDuration)

      if (poster) form.append("poster", poster)
      if (trailer) form.append("trailer", trailer)
      subtitles.forEach(s => form.append("subtitles[]", s))

      casts.forEach(c => form.append("casts[]", c))
      tags.forEach(t => form.append("tags[]", t))

      if (bunnyVideoId) form.append("bunny_video_id", bunnyVideoId)

      form.append("seo_title", seoTitle)
      form.append("seo_description", seoDescription)
      form.append("seo_keywords", seoKeywords)

      const res = await fetch(`${API_URL}/movies`, {
        method: "POST",
        body: form
      })

      if (!res.ok) throw await res.json()
      alert("Movie saved successfully")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/movies">
          <Button variant="outline" size="icon"><ArrowLeft /></Button>
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
            title, setTitle,
            description, setDescription,
            releaseYear, setReleaseYear,
            duration, setDuration,
            language, setLanguage,
            genre, setGenre,
            status, setStatus,
            casts, setCasts,
            tags, setTags
          }} />
        </TabsContent>

        <TabsContent value="media">
          <MediaUploadSection {...{
            poster, setPoster,
            trailer, setTrailer,
            movie, setMovie,
            subtitles, setSubtitles,
            uploadingMovie
          }} />
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
        <Button variant="outline" onClick={() => submitMovie(false)}>Save Draft</Button>
        <Button onClick={() => submitMovie(true)}>Publish</Button>
      </div>
    </div>
  )
}
