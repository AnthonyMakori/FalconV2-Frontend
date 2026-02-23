'use client'

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import BasicInfo from "@/components/admin/movies/BasicInfo"
import MediaUploadSection from "@/components/admin/movies/MediaUploadSection"
import PricingInfo from "@/components/admin/movies/PricingInfo"
import SeoInfo from "@/components/admin/movies/SeoInfo"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

/* ================= TYPES ================= */

export interface CastType {
  name: string
  image?: File | null
}

/* ================= PAGE ================= */

export default function NewMoviePage() {
  const [loading, setLoading] = useState(false)

  /* ---------------- BASIC ---------------- */

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [releaseYear, setReleaseYear] = useState("")
  const [duration, setDuration] = useState("")
  const [language, setLanguage] = useState("")
  const [genre, setGenre] = useState("")
  const [status, setStatus] = useState("draft")

  const [casts, setCasts] = useState<CastType[]>([])
  const [tags, setTags] = useState<string[]>([])

  /* ---------------- MEDIA ---------------- */

  const [poster, setPoster] = useState<File | null>(null)
  const [trailer, setTrailer] = useState<File | null>(null)
  const [movie, setMovie] = useState<File | null>(null)
  const [subtitles, setSubtitles] = useState<File[]>([])

  /* ---------------- PRICING ---------------- */

  const [rentalPrice, setRentalPrice] = useState("")
  const [purchasePrice, setPurchasePrice] = useState("")
  const [rentalPeriod, setRentalPeriod] = useState("")
  const [freePreview, setFreePreview] = useState(false)
  const [previewDuration, setPreviewDuration] = useState("")

  /* ---------------- SEO ---------------- */

  const [seoTitle, setSeoTitle] = useState("")
  const [seoDescription, setSeoDescription] = useState("")
  const [seoKeywords, setSeoKeywords] = useState("")

  /* ================= RESET FORM ================= */

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setReleaseYear("")
    setDuration("")
    setLanguage("")
    setGenre("")
    setStatus("draft")
    setCasts([])
    setTags([])
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
  }

  /* ================= SUBMIT ================= */

  const submitMovie = async (publish = false) => {
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Authentication token missing")

      const formData = new FormData()

      /* ---------- BASIC ---------- */

      formData.append("title", title)
      formData.append("description", description)
      formData.append("release_year", releaseYear)
      formData.append("duration", duration)
      formData.append("language", language)
      formData.append("genre", genre)
      formData.append("status", publish ? "published" : status)

      /* ---------- PRICING ---------- */

      formData.append("rental_price", rentalPrice)
      formData.append("purchase_price", purchasePrice)
      formData.append("rental_period", rentalPeriod)
      formData.append("free_preview", freePreview ? "1" : "0")
      formData.append("preview_duration", previewDuration)

      /* ---------- SEO ---------- */

      formData.append("seo_title", seoTitle)
      formData.append("seo_description", seoDescription)
      formData.append("seo_keywords", seoKeywords)

      /* ---------- CASTS (Structured) ---------- */

      casts.forEach((cast, index) => {
        formData.append(`casts[${index}][name]`, cast.name)

        if (cast.image) {
          formData.append(`casts[${index}][image]`, cast.image)
        }
      })

      /* ---------- TAGS ---------- */

      tags.forEach((tag) => {
        formData.append("tags[]", tag)
      })

      /* ---------- MEDIA ---------- */

      if (poster) formData.append("poster", poster)
      if (trailer) formData.append("trailer", trailer)
      if (movie) formData.append("movie", movie)

      subtitles.forEach((sub) => {
        formData.append("subtitles[]", sub)
      })

      /* ---------- REQUEST ---------- */

      const res = await fetch(`${API_URL}/movies`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to save movie")
      }

      alert("Movie saved successfully 🎉")
      resetForm()

    } catch (err: any) {
      console.error(err)
      alert("Failed: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  /* ================= UI ================= */

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

        {/* BASIC */}
        <TabsContent value="basic">
          <BasicInfo
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            releaseYear={releaseYear}
            setReleaseYear={setReleaseYear}
            duration={duration}
            setDuration={setDuration}
            language={language}
            setLanguage={setLanguage}
            genre={genre}
            setGenre={setGenre}
            status={status}
            setStatus={setStatus}
            casts={casts}
            setCasts={setCasts}
            tags={tags}
            setTags={setTags}
          />
        </TabsContent>

        {/* MEDIA */}
        <TabsContent value="media">
          <MediaUploadSection
            poster={poster}
            setPoster={setPoster}
            trailer={trailer}
            setTrailer={setTrailer}
            movie={movie}
            setMovie={setMovie}
            subtitles={subtitles}
            setSubtitles={setSubtitles}
          />
        </TabsContent>

        {/* PRICING */}
        <TabsContent value="pricing">
          <PricingInfo
            rentalPrice={rentalPrice}
            setRentalPrice={setRentalPrice}
            purchasePrice={purchasePrice}
            setPurchasePrice={setPurchasePrice}
            rentalPeriod={rentalPeriod}
            setRentalPeriod={setRentalPeriod}
            freePreview={freePreview}
            setFreePreview={setFreePreview}
            previewDuration={previewDuration}
            setPreviewDuration={setPreviewDuration}
          />
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo">
          <SeoInfo
            seoTitle={seoTitle}
            setSeoTitle={setSeoTitle}
            seoDescription={seoDescription}
            setSeoDescription={setSeoDescription}
            seoKeywords={seoKeywords}
            setSeoKeywords={setSeoKeywords}
          />
        </TabsContent>
      </Tabs>

      {/* Buttons */}
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          disabled={loading}
          onClick={() => submitMovie(false)}
        >
          Save as Draft
        </Button>

        <Button
          disabled={loading}
          onClick={() => submitMovie(true)}
        >
          Publish Movie
        </Button>
      </div>
    </div>
  )
}