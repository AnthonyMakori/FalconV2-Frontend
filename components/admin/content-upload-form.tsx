"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Upload, Plus, X } from "lucide-react"

export function ContentUploadForm() {
  const [isUploading, setIsUploading] = useState(false)
  const [contentType, setContentType] = useState("movie")
  const [cast, setCast] = useState<string[]>([])
  const [genres, setGenres] = useState<string[]>([])
  const [newCastMember, setNewCastMember] = useState("")
  const [newGenre, setNewGenre] = useState("")
  const { toast } = useToast()

  const handleAddCastMember = () => {
    if (newCastMember.trim() && !cast.includes(newCastMember.trim())) {
      setCast([...cast, newCastMember.trim()])
      setNewCastMember("")
    }
  }

  const handleRemoveCastMember = (member: string) => {
    setCast(cast.filter((m) => m !== member))
  }

  const handleAddGenre = () => {
    if (newGenre.trim() && !genres.includes(newGenre.trim())) {
      setGenres([...genres, newGenre.trim()])
      setNewGenre("")
    }
  }

  const handleRemoveGenre = (genre: string) => {
    setGenres(genres.filter((g) => g !== genre))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    // Simulate API call
    setTimeout(() => {
      setIsUploading(false)
      toast({
        title: "Content uploaded successfully",
        description: "Your content has been uploaded and is now being processed.",
      })
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Content</CardTitle>
        <CardDescription>Add new movies or series to the platform.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="content-type">Content Type</Label>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger id="content-type">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="movie">Movie</SelectItem>
                <SelectItem value="series">Series</SelectItem>
                <SelectItem value="episode">Episode</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Enter title" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Enter description" className="min-h-[100px]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input id="year" type="number" placeholder="Enter release year" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input id="duration" type="number" placeholder="Enter duration" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select>
                <SelectTrigger id="region">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="west-africa">West Africa</SelectItem>
                  <SelectItem value="east-africa">East Africa</SelectItem>
                  <SelectItem value="north-africa">North Africa</SelectItem>
                  <SelectItem value="south-africa">South Africa</SelectItem>
                  <SelectItem value="central-africa">Central Africa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Input id="language" placeholder="Enter language" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input id="price" type="number" step="0.01" placeholder="Enter price" />
          </div>

          <div className="space-y-2">
            <Label>Cast</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {cast.map((member) => (
                <div key={member} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-sm">
                  {member}
                  <button
                    type="button"
                    onClick={() => handleRemoveCastMember(member)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add cast member"
                value={newCastMember}
                onChange={(e) => setNewCastMember(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCastMember())}
              />
              <Button type="button" size="sm" onClick={handleAddCastMember}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Genres</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {genres.map((genre) => (
                <div key={genre} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-sm">
                  {genre}
                  <button
                    type="button"
                    onClick={() => handleRemoveGenre(genre)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add genre"
                value={newGenre}
                onChange={(e) => setNewGenre(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddGenre())}
              />
              <Button type="button" size="sm" onClick={handleAddGenre}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Poster Image</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">Drag and drop or click to upload</p>
              <p className="text-xs text-muted-foreground">Recommended size: 500x750px</p>
              <Input type="file" className="hidden" id="poster-upload" />
              <Button type="button" variant="outline" size="sm" className="mt-4">
                <Label htmlFor="poster-upload" className="cursor-pointer">
                  Select File
                </Label>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Video File</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">Drag and drop or click to upload</p>
              <p className="text-xs text-muted-foreground">Supported formats: MP4, MOV, MKV</p>
              <Input type="file" className="hidden" id="video-upload" />
              <Button type="button" variant="outline" size="sm" className="mt-4">
                <Label htmlFor="video-upload" className="cursor-pointer">
                  Select File
                </Label>
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload Content"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
