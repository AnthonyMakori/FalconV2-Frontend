'use client'
import { useState } from "react"
import { Upload } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function MediaUpload({
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
