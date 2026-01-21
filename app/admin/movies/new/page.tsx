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

  // Add/Remove Casts
  const addCast = () => { if (castInput.trim()) { setCasts([...casts, castInput.trim()]); setCastInput("") } }
  const removeCast = (c: string) => setCasts(casts.filter(x => x !== c))

  // Add/Remove Tags
  const addTag = () => { if (tagInput.trim()) { setTags([...tags, tagInput.trim()]); setTagInput("") } }
  const removeTag = (t: string) => setTags(tags.filter(x => x !== t))

  // -----------------------------
  // Upload video to Bunny CDN
  // -----------------------------
  const uploadVideoToBunny = async (file: File) => {
    const url = `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos`;
    const formData = new FormData();
    formData.append("title", file.name);
    formData.append("file", file);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        AccessKey: BUNNY_ACCESS_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text()
      throw new Error("Failed to upload video to Bunny CDN: " + errText)
    }

    const data = await response.json();
    return data.guid; // Returns Bunny video ID
  };

  // Submit movie
  const submitMovie = async (publish = false) => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      let bunnyVideoId: string | null = null

      // Upload full movie to Bunny if selected
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
        body: formData
      })

      if (!res.ok) throw await res.json()
      alert("Movie saved successfully 🎉")
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

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/movies">
          <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
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
            casts={casts} addCast={addCast} removeCast={removeCast} castInput={castInput} setCastInput={setCastInput}
            tags={tags} addTag={addTag} removeTag={removeTag} tagInput={tagInput} setTagInput={setTagInput}
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
          {uploadingMovie && <p className="text-sm text-muted-foreground">Uploading full movie to Bunny CDN...</p>}
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
        <Button variant="outline" disabled={loading} onClick={() => submitMovie(false)}>Save as Draft</Button>
        <Button disabled={loading} onClick={() => submitMovie(true)}>Publish Movie</Button>
      </div>

    </div>
  )
}
