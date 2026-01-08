'use client'

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Upload, Plus, X } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

export default function NewMoviePage() {
  const [loading, setLoading] = useState(false)

  // BASIC INFO
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [releaseYear, setReleaseYear] = useState("")
  const [duration, setDuration] = useState("")
  const [language, setLanguage] = useState("")
  const [genre, setGenre] = useState("")
  const [status, setStatus] = useState("draft")

  // CAST & TAGS
  const [castInput, setCastInput] = useState("")
  const [casts, setCasts] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])

  // MEDIA
  const [poster, setPoster] = useState<File | null>(null)
  const [trailer, setTrailer] = useState<File | null>(null)
  const [movie, setMovie] = useState<File | null>(null)
  const [subtitles, setSubtitles] = useState<File[]>([])

  // PRICING
  const [rentalPrice, setRentalPrice] = useState("")
  const [purchasePrice, setPurchasePrice] = useState("")
  const [rentalPeriod, setRentalPeriod] = useState("")
  const [freePreview, setFreePreview] = useState(false)
  const [previewDuration, setPreviewDuration] = useState("")

  // SEO
  const [seoTitle, setSeoTitle] = useState("")
  const [seoDescription, setSeoDescription] = useState("")
  const [seoKeywords, setSeoKeywords] = useState("")

  // ------------------ HELPERS ------------------

  const addCast = () => {
    if (!castInput.trim()) return
    setCasts([...casts, castInput.trim()])
    setCastInput("")
  }

  const removeCast = (name: string) =>
    setCasts(casts.filter(c => c !== name))

  const addTag = () => {
    if (!tagInput.trim()) return
    setTags([...tags, tagInput.trim()])
    setTagInput("")
  }

  const removeTag = (tag: string) =>
    setTags(tags.filter(t => t !== tag))

  // ------------------ SUBMIT ------------------

  const submitMovie = async (publish = false) => {
    setLoading(true)

    const formData = new FormData()
    const token = localStorage.getItem("token");

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

    // CAST & TAGS
    casts.forEach(c => formData.append("casts[]", c))
    tags.forEach(t => formData.append("tags[]", t))

    // MEDIA
    if (poster) formData.append("poster", poster)
    if (trailer) formData.append("trailer", trailer)
    if (movie) formData.append("movie", movie)
    subtitles.forEach(s => formData.append("subtitles[]", s))

    try {
      const res = await fetch(`${API_URL}/movies`, {
        method: "POST",
         headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        throw err
      }

      alert("Movie saved successfully!")
    } catch (err: any) {
      console.error(err)
      alert("Failed to save movie")
    } finally {
      setLoading(false)
    }
  }

  // ------------------ UI ------------------

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

        {/* ---------------- BASIC ---------------- */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic details of the movie</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  className="min-h-[120px]"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Input placeholder="Release Year" type="number" value={releaseYear} onChange={e => setReleaseYear(e.target.value)} />
                <Input placeholder="Duration (min)" type="number" value={duration} onChange={e => setDuration(e.target.value)} />
                <Input placeholder="Language" value={language} onChange={e => setLanguage(e.target.value)} />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Select onValueChange={setGenre}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {["action","comedy","drama","horror","romance","thriller"].map(g => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* CAST */}
              <div className="space-y-2">
                <Label>Cast</Label>
                <div className="flex flex-wrap gap-2">
                  {casts.map(c => (
                    <span key={c} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-sm">
                      {c}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeCast(c)} />
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input value={castInput} onChange={e => setCastInput(e.target.value)} />
                  <Button size="sm" onClick={addCast}><Plus className="h-4 w-4" /></Button>
                </div>
              </div>

              {/* TAGS */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {tags.map(t => (
                    <span key={t} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-sm">
                      {t}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(t)} />
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input value={tagInput} onChange={e => setTagInput(e.target.value)} />
                  <Button size="sm" onClick={addTag}><Plus className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

       {/* MEDIA */}
        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>Media Files</CardTitle>
              <CardDescription>
                Upload movie poster, trailer, full movie, and subtitles
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">

              {/* POSTER */}
              <div className="space-y-2">
                <Label>Poster Image</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload the movie poster image
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Recommended size: 500×750px (JPG / PNG)
                  </p>

                  <Input
                    id="poster-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setPoster(e.target.files?.[0] || null)}
                  />

                  <Button variant="outline" size="sm" className="mt-4">
                    <Label htmlFor="poster-upload" className="cursor-pointer">
                      Select Poster
                    </Label>
                  </Button>
                </div>
              </div>

              {/* TRAILER */}
              <div className="space-y-2">
                <Label>Trailer Video</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload a short trailer clip
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: MP4, MOV, MKV
                  </p>

                  <Input
                    id="trailer-upload"
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => setTrailer(e.target.files?.[0] || null)}
                  />

                  <Button variant="outline" size="sm" className="mt-4">
                    <Label htmlFor="trailer-upload" className="cursor-pointer">
                      Select Trailer
                    </Label>
                  </Button>
                </div>
              </div>

              {/* FULL MOVIE */}
              <div className="space-y-2">
                <Label>Full Movie</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload the full movie file
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: MP4, MOV, MKV
                  </p>

                  <Input
                    id="movie-upload"
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => setMovie(e.target.files?.[0] || null)}
                  />

                  <Button variant="outline" size="sm" className="mt-4">
                    <Label htmlFor="movie-upload" className="cursor-pointer">
                      Select Movie File
                    </Label>
                  </Button>
                </div>
              </div>

              {/* SUBTITLES */}
              <div className="space-y-2">
                <Label>Subtitle Files</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload subtitle files (multiple allowed)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: SRT, VTT
                  </p>

                  <Input
                    id="subtitle-upload"
                    type="file"
                    accept=".srt,.vtt"
                    multiple
                    className="hidden"
                    onChange={(e) =>
                      setSubtitles(Array.from(e.target.files || []))
                    }
                  />

                  <Button variant="outline" size="sm" className="mt-4">
                    <Label htmlFor="subtitle-upload" className="cursor-pointer">
                      Select Subtitle Files
                    </Label>
                  </Button>
                </div>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* PRICING */}
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

        {/* SEO */}
        <TabsContent value="seo">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <Input placeholder="SEO title" value={seoTitle} onChange={e => setSeoTitle(e.target.value)} />
              <Textarea placeholder="SEO description" value={seoDescription} onChange={e => setSeoDescription(e.target.value)} />
              <Input placeholder="Keywords" value={seoKeywords} onChange={e => setSeoKeywords(e.target.value)} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
