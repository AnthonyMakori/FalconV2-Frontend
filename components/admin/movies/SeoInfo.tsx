'use client'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import React from "react"

interface SeoInfoProps {
  seoTitle: string
  setSeoTitle: (value: string) => void
  seoDescription: string
  setSeoDescription: (value: string) => void
  seoKeywords: string
  setSeoKeywords: (value: string) => void
}

export default function SeoInfo({
  seoTitle, setSeoTitle,
  seoDescription, setSeoDescription,
  seoKeywords, setSeoKeywords
}: SeoInfoProps) {
  return (
    <div className="space-y-4">
      <Input
        placeholder="SEO title"
        value={seoTitle}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSeoTitle(e.target.value)}
      />
      <Textarea
        placeholder="SEO description"
        value={seoDescription}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSeoDescription(e.target.value)}
      />
      <Input
        placeholder="SEO keywords"
        value={seoKeywords}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSeoKeywords(e.target.value)}
      />
    </div>
  )
}
