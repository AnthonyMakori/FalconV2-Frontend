'use client'

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Upload, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

/* ============================================================
   BUNNY STREAM CONFIG
============================================================ */
const BUNNY_LIBRARY_ID = "583613"
const BUNNY_API_KEY = "319d8af4-f8a4-4570-9c9e8cdeacdc-e2e7-4a7d"
const BUNNY_CDN_HOST = "vz-8e6ec75c-c5b.b-cdn.net"

/* ============================================================
   PAGE
============================================================ */
export default function NewMoviePage() {

  /* ===================== STATE ===================== */
  const [loading, setLoading] = useState(false)
  const [uploadingMovie, setUploadingMovie] = useState(false)

  /* ---------------- BASIC INFO ---------------- */
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [releaseYear, setReleaseYear] = useState("")
  const [duration, setDuration] = useState("")
  const [language, setLanguage] = useState("")
  const [genre, setGenre] = useState("")
  const [status, setStatus] = useState("draft")

  /* ---------------- CAST & TAGS ---------------- */
  const [castInput, setCastInput] = useState("")
  const [casts, setCasts] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
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

  /* ============================================================
     HELPERS
  ============================================================ */
  const addCast = () => {
    if (!castInput.trim()) return
    setCasts([...casts, castInput.trim()])
    setCastInput("")
  }

  const removeCast = (name: string) => {
    setCasts(casts.filter(c => c !== name))
  }

  const addTag = () => {
    if (!tagInput.trim()) return
    setTags([...tags, tagInput.trim()])
    setTagInput("")
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  /* ============================================================
     BUNNY UPLOAD
  ============================================================ */
  const uploadMovieToBunny = async (file: File): Promise<string> => {
    setUploadingMovie(true)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("title", file.name)

    const res = await fetch(
      `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos`,
      {
        method: "POST",
        headers: {
          AccessKey: BUNNY_API_KEY,
        },
        body: formData,
      }
    )

    if (!res.ok) {
      const err = await res.text()
      setUploadingMovie(false)
      throw new Error("Bunny upload failed: " + err)
    }

    const data = await res.json()
    setUploadingMovie(false)

    return data.guid
  }

  /* ============================================================
     SUBMIT
  ============================================================ */
  const submitMovie = async (publish = false) => {
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      let bunnyVideoId: string | null = null

      /* 1️⃣ Upload movie to Bunny */
      if (movie) {
        bunnyVideoId = await uploadMovieToBunny(movie)
      }

      /* 2️⃣ Build form data for backend */
      const formData = new FormData()

      // BASIC
      formData.append("title", title)
      formData.append("description", description)
      formData.append("release_year", releaseYear)
      formData.append("duration", duration)
      formData.append("language", language)
      formData.append("genre", genre)
      formData.append("status", publish ? "published" : status)

      // PRICING
      formData.append("rental_price", rentalPrice)
      formData.append("purchase_price", purchasePrice)
      formData.append("rental_period", rentalPeriod)
      formData.append("free_preview", String(freePreview))
      formData.append("preview_duration", previewDuration)

      // SEO
      formData.append("seo_title", seoTitle)
      formData.append("seo_description", seoDescription)
      formData.append("seo_keywords", seoKeywords)

      // CASTS & TAGS
      casts.forEach(c => formData.append("casts[]", c))
      tags.forEach(t => formData.append("tags[]", t))

      // MEDIA (NON-MOVIE)
      if (poster) formData.append("poster", poster)
      if (trailer) formData.append("trailer", trailer)
      subtitles.forEach(s => formData.append("subtitles[]", s))

      // BUNNY VIDEO ID
      if (bunnyVideoId) {
        formData.append("bunny_video_id", bunnyVideoId)
      }

      /* 3️⃣ Save to backend */
      const res = await fetch(`${API_URL}/movies`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        throw err
      }

      alert("Movie uploaded & saved successfully 🎉")

    } catch (err) {
      console.error(err)
      alert("Failed to save movie")
    } finally {
      setLoading(false)
    }
  }

  /* ============================================================
     UI
  ============================================================ */
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Link href="/admin/movies">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Add New Movie</h1>
      </div>

      {/* TABS */}
      <Tabs defaultValue="basic">

        <TabsList>
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* ================================================= BASIC ================================================= */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter movie details</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">

              <div>
                <Label>Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  className="min-h-[120px]"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Input placeholder="Release Year" value={releaseYear} onChange={e => setReleaseYear(e.target.value)} />
                <Input placeholder="Duration (min)" value={duration} onChange={e => setDuration(e.target.value)} />
                <Input placeholder="Language" value={language} onChange={e => setLanguage(e.target.value)} />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Select onValueChange={setGenre}>
                  <SelectTrigger>
                    <SelectValue placeholder="Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {["action", "comedy", "drama", "horror", "romance", "thriller"].map(g => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* CASTS */}
              <div>
                <Label>Cast</Label>
                <div className="flex flex-wrap gap-2 my-2">
                  {casts.map(c => (
                    <span key={c} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-sm">
                      {c}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeCast(c)} />
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input value={castInput} onChange={e => setCastInput(e.target.value)} />
                  <Button size="sm" onClick={addCast}><Plus /></Button>
                </div>
              </div>

              {/* TAGS */}
              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 my-2">
                  {tags.map(t => (
                    <span key={t} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-sm">
                      {t}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(t)} />
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input value={tagInput} onChange={e => setTagInput(e.target.value)} />
                  <Button size="sm" onClick={addTag}><Plus /></Button>
                </div>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* ================================================= MEDIA ================================================= */}
        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>Media Uploads</CardTitle>
              <CardDescription>Movie file uploads to Bunny CDN</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">

              {/* POSTER */}
              <MediaUpload
                label="Poster Image"
                accept="image/*"
                onChange={f => setPoster(f)}
              />

              {/* TRAILER */}
              <MediaUpload
                label="Trailer Video"
                accept="video/*"
                onChange={f => setTrailer(f)}
              />

              {/* MOVIE */}
              <MediaUpload
                label="Full Movie (Uploaded to Bunny)"
                accept="video/*"
                onChange={f => setMovie(f)}
              />

              {uploadingMovie && (
                <p className="text-sm text-muted-foreground">
                  Uploading movie to Bunny CDN...
                </p>
              )}

              {/* SUBTITLES */}
              <MediaUpload
                label="Subtitles"
                accept=".srt,.vtt"
                multiple
                onChangeMultiple={setSubtitles}
              />

            </CardContent>
          </Card>
        </TabsContent>

        {/* ================================================= PRICING ================================================= */}
        <TabsContent value="pricing">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <Input placeholder="Rental price" value={rentalPrice} onChange={e => setRentalPrice(e.target.value)} />
              <Input placeholder="Purchase price" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} />
              <Input placeholder="Rental period (hours)" value={rentalPeriod} onChange={e => setRentalPeriod(e.target.value)} />

              <label className="flex items-center gap-2">
                <input type="checkbox" checked={freePreview} onChange={e => setFreePreview(e.target.checked)} />
                Allow free preview
              </label>

              <Input placeholder="Preview duration" value={previewDuration} onChange={e => setPreviewDuration(e.target.value)} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================================================= SEO ================================================= */}
        <TabsContent value="seo">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <Input placeholder="SEO title" value={seoTitle} onChange={e => setSeoTitle(e.target.value)} />
              <Textarea placeholder="SEO description" value={seoDescription} onChange={e => setSeoDescription(e.target.value)} />
              <Input placeholder="SEO keywords" value={seoKeywords} onChange={e => setSeoKeywords(e.target.value)} />
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      {/* ACTIONS */}
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

/* ============================================================
   REUSABLE MEDIA UPLOAD COMPONENT (FIXED)
============================================================ */
function MediaUpload({
  label,
  accept,
  multiple = false,
  onChange,
  onChangeMultiple
}: {
  label: string
  accept: string
  multiple?: boolean
  onChange?: (file: File | null) => void
  onChangeMultiple?: (files: File[]) => void
}) {
  const inputId = `file-upload-${label.replace(/\s+/g, "-").toLowerCase()}`
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleChange = (files: FileList | null) => {
    if (!files) return
    if (multiple) {
      const arr = Array.from(files)
      setSelectedFiles(arr)
      onChangeMultiple?.(arr)
    } else {
      const file = files[0]
      setSelectedFiles(file ? [file] : [])
      onChange?.(file || null)
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <input
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleChange(e.target.files)}
      />

      <div className="border-2 border-dashed rounded-lg p-6 text-center">
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-2">
          Click the button below to select file{multiple ? "s" : ""}
        </p>
        <Label htmlFor={inputId} className="cursor-pointer">
          <Button variant="outline" size="sm">
            Select File
          </Button>
        </Label>

        {/* Display selected files */}
        {selectedFiles.length > 0 && (
          <div className="mt-2 text-sm text-muted-foreground">
            {selectedFiles.map((f, i) => (
              <p key={i}>{f.name}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
