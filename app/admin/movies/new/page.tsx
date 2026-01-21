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
const BUNNY_LIBRARY_ID = "583613"
const BUNNY_ACCESS_KEY = "319d8af4-f8a4-4570-9c9e8cdeacdc-e2e7-4a7d"

export default function NewMoviePage() {
  const [loading, setLoading] = useState<boolean>(false)
  const [uploadingMovie, setUploadingMovie] = useState<boolean>(false)

  // Basic Info
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [releaseYear, setReleaseYear] = useState<string>("")
  const [duration, setDuration] = useState<string>("")
  const [language, setLanguage] = useState<string>("")
  const [genre, setGenre] = useState<string>("")
  const [status, setStatus] = useState<string>("draft")
  const [casts, setCasts] = useState<string[]>([])
  const [castInput, setCastInput] = useState<string>("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState<string>("")

  // Media
  const [poster, setPoster] = useState<File | null>(null)
  const [trailer, setTrailer] = useState<File | null>(null)
  const [movie, setMovie] = useState<File | null>(null)
  const [subtitles, setSubtitles] = useState<File[]>([])

  // Pricing
  const [rentalPrice, setRentalPrice] = useState<string>("")
  const [purchasePrice, setPurchasePrice] = useState<string>("")
  const [rentalPeriod, setRentalPeriod] = useState<string>("")
  const [freePreview, setFreePreview] = useState<boolean>(false)
  const [previewDuration, setPreviewDuration] = useState<string>("")

  // SEO
  const [seoTitle, setSeoTitle] = useState<string>("")
  const [seoDescription, setSeoDescription] = useState<string>("")
  const [seoKeywords, setSeoKeywords] = useState<string>("")

  // Helpers
  const addCast = (): void => {
    if (!castInput.trim()) return
    setCasts([...casts, castInput.trim()])
    setCastInput("")
  }

  const removeCast = (c: string): void =>
    setCasts(casts.filter(x => x !== c))

  const addTag = (): void => {
    if (!tagInput.trim()) return
    setTags([...tags, tagInput.trim()])
    setTagInput("")
  }

  const removeTag = (t: string): void =>
    setTags(tags.filter(x => x !== t))

  // ===============================
  // BUNNY STREAM – CORRECT FLOW
  // ===============================

  const uploadMovieToBunny = async (file: File): Promise<string> => {
    // STEP 1: Create video (JSON ONLY)
    const createRes = await fetch(
      `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos`,
      {
        method: "POST",
        headers: {
          "AccessKey": BUNNY_ACCESS_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title: file.name })
      }
    )

    if (!createRes.ok) {
      const text = await createRes.text()
      throw new Error(`Bunny create failed: ${text}`)
    }

    const createData: { guid: string } = await createRes.json()
    const videoGuid = createData.guid

    // STEP 2: Upload binary file
    const uploadRes = await fetch(
      `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos/${videoGuid}`,
      {
        method: "PUT",
        headers: {
          "AccessKey": BUNNY_ACCESS_KEY,
          "Content-Type": "application/octet-stream"
        },
        body: file
      }
    )

    if (!uploadRes.ok) {
      const text = await uploadRes.text()
      throw new Error(`Bunny upload failed: ${text}`)
    }

    return videoGuid
  }

  // ===============================
  // SUBMIT MOVIE
  // ===============================
  const submitMovie = async (publish: boolean): Promise<void> => {
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Not authenticated")

      let bunnyVideoId: string | null = null

      if (movie) {
        setUploadingMovie(true)
        bunnyVideoId = await uploadMovieToBunny(movie)
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
      formData.append("free_preview", String(freePreview))
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
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(errText)
      }

      alert("🎉 Movie saved successfully!")
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unexpected error"
      console.error(err)
      alert(`Failed: ${message}`)
    } finally {
      setLoading(false)
      setUploadingMovie(false)
    }
  }

  // ===============================
  // UI
  // ===============================
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
          <BasicInfo
            title={title} setTitle={setTitle}
            description={description} setDescription={setDescription}
            releaseYear={releaseYear} setReleaseYear={setReleaseYear}
            duration={duration} setDuration={setDuration}
            language={language} setLanguage={setLanguage}
            genre={genre} setGenre={setGenre}
            status={status} setStatus={setStatus}
            casts={casts} addCast={addCast} removeCast={removeCast}
            castInput={castInput} setCastInput={setCastInput}
            tags={tags} addTag={addTag} removeTag={removeTag}
            tagInput={tagInput} setTagInput={setTagInput}
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
            <p className="text-sm text-muted-foreground">
              Uploading movie to Bunny CDN...
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

      <div className="flex justify-end gap-4">
        <Button variant="outline" disabled={loading} onClick={() => submitMovie(false)}>
          Save Draft
        </Button>
        <Button disabled={loading} onClick={() => submitMovie(true)}>
          Publish Movie
        </Button>
      </div>
    </div>
  )
}
