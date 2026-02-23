'use client'

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"
import { X } from "lucide-react"
import { Dispatch, SetStateAction, useState } from "react"
import type { CastType } from "@/types/movie"

export interface BasicInfoProps {
  title: string
  setTitle: Dispatch<SetStateAction<string>>

  description: string
  setDescription: Dispatch<SetStateAction<string>>

  releaseYear: string
  setReleaseYear: Dispatch<SetStateAction<string>>

  duration: string
  setDuration: Dispatch<SetStateAction<string>>

  language: string
  setLanguage: Dispatch<SetStateAction<string>>

  genre: string
  setGenre: Dispatch<SetStateAction<string>>

  status: string
  setStatus: Dispatch<SetStateAction<string>>

  casts: CastType[]
  setCasts: Dispatch<SetStateAction<CastType[]>>

  tags: string[]
  setTags: Dispatch<SetStateAction<string[]>>
}

export default function BasicInfo({
  title, setTitle,
  description, setDescription,
  releaseYear, setReleaseYear,
  duration, setDuration,
  language, setLanguage,
  genre, setGenre,
  status, setStatus,
  casts, setCasts,
  tags, setTags,
}: BasicInfoProps) {

  const [newCastName, setNewCastName] = useState("")
  const [newCastImage, setNewCastImage] = useState<File | null>(null)
  const [newTag, setNewTag] = useState("")

  /* ---------- ADD CAST ---------- */

  const addCast = () => {
    if (!newCastName.trim()) return

    setCasts(prev => [
      ...prev,
      {
        name: newCastName.trim(),
        image: newCastImage,
      }
    ])

    setNewCastName("")
    setNewCastImage(null)
  }

  const removeCast = (index: number) => {
    setCasts(prev => prev.filter((_, i) => i !== index))
  }

  /* ---------- TAGS ---------- */

  const addTag = () => {
    if (!newTag.trim()) return
    setTags(prev => [...prev, newTag.trim()])
    setNewTag("")
  }

  const removeTag = (index: number) => {
    setTags(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">

      <div>
        <Label>Movie Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="Release Year" value={releaseYear} onChange={(e) => setReleaseYear(e.target.value)} />
        <Input placeholder="Duration" value={duration} onChange={(e) => setDuration(e.target.value)} />
        <Input placeholder="Language" value={language} onChange={(e) => setLanguage(e.target.value)} />
        <Input placeholder="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} />
      </div>

      <div>
        <Label>Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* CASTS */}
      <div className="space-y-3">
        <Label>Add Cast</Label>

        <div className="flex gap-2">
          <Input
            placeholder="Cast name"
            value={newCastName}
            onChange={(e) => setNewCastName(e.target.value)}
          />

          <Input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNewCastImage(e.target.files?.[0] || null)
            }
          />

          {/* IMPORTANT FIX: REMOVE type="button" */}
          <Button onClick={addCast}>
            Add
          </Button>
        </div>

        <div className="space-y-2">
          {casts.map((cast, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-muted px-3 py-2 rounded"
            >
              <div className="flex items-center gap-3">
                {cast.image && (
                  <img
                    src={URL.createObjectURL(cast.image)}
                    alt={cast.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                )}
                <span>{cast.name}</span>
              </div>

              <X
                size={16}
                className="cursor-pointer"
                onClick={() => removeCast(index)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* TAGS */}
      <div>
        <Label>Tags</Label>

        <div className="flex gap-2">
          <Input
            placeholder="Add tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />
          <Button onClick={addTag}>Add</Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full"
            >
              {tag}
              <X
                size={14}
                className="cursor-pointer"
                onClick={() => removeTag(index)}
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}