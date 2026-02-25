'use client'

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import React from "react"

export interface CastMember {
  name: string
  image?: File | null
}

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

  casts: CastMember[]
  castInput: string
  setCastInput: (v: string) => void
  setCastImage: (file: File | null) => void
  addCast: () => void
  removeCast: (name: string) => void

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
  casts, castInput, setCastInput,
  setCastImage, addCast, removeCast,
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
        <Input placeholder="Release Year" value={releaseYear} onChange={(e)=>setReleaseYear(e.target.value)} />
        <Input placeholder="Duration (min)" value={duration} onChange={(e)=>setDuration(e.target.value)} />
        <Input placeholder="Language" value={language} onChange={(e)=>setLanguage(e.target.value)} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label>Genre</Label>
          <Input placeholder="Enter genre" value={genre} onChange={(e)=>setGenre(e.target.value)} />
        </div>

        <div>
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ---------------- CASTS ---------------- */}
      <div>
        <Label>Cast</Label>

        <div className="flex flex-wrap gap-4 my-3">
          {casts.map((c) => (
            <div key={c.name} className="flex flex-col items-center bg-muted p-3 rounded-xl relative w-[110px]">
              {c.image && (
                <img
                  src={URL.createObjectURL(c.image)}
                  alt={c.name}
                  className="w-16 h-16 rounded-full object-cover mb-2"
                />
              )}
              <span className="text-sm text-center">{c.name}</span>
              <span
                className="absolute top-1 right-2 cursor-pointer text-red-500"
                onClick={() => removeCast(c.name)}
              >
                ×
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 items-center">
          <Input
            placeholder="Cast name"
            value={castInput}
            onChange={(e)=>setCastInput(e.target.value)}
          />

          <Input
            type="file"
            accept="image/*"
            onChange={(e)=>{
              const file = e.target.files?.[0] || null
              setCastImage(file)
            }}
            className="w-[180px]"
          />

          <button type="button" className="btn btn-sm" onClick={addCast}>
            Add
          </button>
        </div>
      </div>

      {/* ---------------- TAGS ---------------- */}
      <div>
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2 my-2">
          {tags.map((t) => (
            <span key={t} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-sm">
              {t}
              <span className="cursor-pointer" onClick={()=>removeTag(t)}>×</span>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input value={tagInput} onChange={(e)=>setTagInput(e.target.value)} />
          <button type="button" className="btn btn-sm" onClick={addTag}>Add</button>
        </div>
      </div>

    </div>
  )
}