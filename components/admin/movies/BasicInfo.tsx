'use client'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import React from "react"

interface BasicInfoProps {
  title: string
  setTitle: (v: string) => void
  description: string
  setDescription: (v: string) => void
  releaseYear: string
  setReleaseYear: (v: string) => void
  duration: string
  setDuration: (v: string) => void
  language: string
  setLanguage: (v: string) => void
  genre: string
  setGenre: (v: string) => void
  status: string
  setStatus: (v: string) => void

  // Updated casts type
  casts: { name: string; image: File | null }[]
  addCast: () => void
  removeCast: (name: string) => void
  castInput: string
  setCastInput: (v: string) => void
  castImage: File | null
  setCastImage: (v: File | null) => void

  tags: string[]
  addTag: () => void
  removeTag: (t: string) => void
  tagInput: string
  setTagInput: (v: string) => void
}

export default function BasicInfo({
  title, setTitle,
  description, setDescription,
  releaseYear, setReleaseYear,
  duration, setDuration,
  language, setLanguage,
  genre, setGenre,
  status, setStatus,
  casts, addCast, removeCast, castInput, setCastInput, castImage, setCastImage,
  tags, addTag, removeTag, tagInput, setTagInput
}: BasicInfoProps) {

  return (
    <div className="space-y-6">

      <div>
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          className="min-h-[120px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Input
          placeholder="Release Year"
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.target.value)}
        />
        <Input
          placeholder="Duration (min)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <Input
          placeholder="Language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Select onValueChange={setGenre}>
          <SelectTrigger><SelectValue placeholder="Genre" /></SelectTrigger>
          <SelectContent>
            {["action","comedy","drama","horror","romance","thriller"].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select onValueChange={setStatus}>
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
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
          {casts.map((c) => (
            <div key={c.name} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-sm">
              {c.image && (
                <img
                  src={URL.createObjectURL(c.image)}
                  alt={c.name}
                  className="w-6 h-6 object-cover rounded-full"
                />
              )}
              {c.name}
              <span className="cursor-pointer text-red-500 font-bold" onClick={() => removeCast(c.name)}>×</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={castInput}
            onChange={(e) => setCastInput(e.target.value)}
            placeholder="Cast Name"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCastImage(e.target.files?.[0] || null)}
            className="border px-2 py-1 rounded"
          />
          <button type="button" className="btn btn-sm bg-blue-600 text-white px-3 rounded" onClick={addCast}>Add</button>
        </div>
      </div>

      {/* TAGS */}
      <div>
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2 my-2">
          {tags.map((t) => (
            <span key={t} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-sm">
              {t} <span className="cursor-pointer text-red-500 font-bold" onClick={() => removeTag(t)}>×</span>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
          />
          <button type="button" className="btn btn-sm bg-blue-600 text-white px-3 rounded" onClick={addTag}>Add</button>
        </div>
      </div>

    </div>
  )
}