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
  casts: string[]
  addCast: () => void
  removeCast: (c: string) => void
  castInput: string
  setCastInput: (v: string) => void
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
  casts, addCast, removeCast, castInput, setCastInput,
  tags, addTag, removeTag, tagInput, setTagInput
}: BasicInfoProps) {

  return (
    <div className="space-y-6">

      <div>
        <Label>Title</Label>
        <Input value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          className="min-h-[120px]"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Input
          placeholder="Release Year"
          value={releaseYear}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReleaseYear(e.target.value)}
        />
        <Input
          placeholder="Duration (min)"
          value={duration}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDuration(e.target.value)}
        />
        <Input
          placeholder="Language"
          value={language}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLanguage(e.target.value)}
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
            <span key={c} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-sm">
              {c} <span className="cursor-pointer" onClick={() => removeCast(c)}>×</span>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={castInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCastInput(e.target.value)}
          />
          <button type="button" className="btn btn-sm" onClick={addCast}>Add</button>
        </div>
      </div>

      {/* TAGS */}
      <div>
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2 my-2">
          {tags.map((t) => (
            <span key={t} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-sm">
              {t} <span className="cursor-pointer" onClick={() => removeTag(t)}>×</span>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value)}
          />
          <button type="button" className="btn btn-sm" onClick={addTag}>Add</button>
        </div>
      </div>

    </div>
  )
}
