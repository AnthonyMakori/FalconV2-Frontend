'use client'

import { ContentUploadForm } from "@/components/admin/content-upload-form"

export default function ContentUploadPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Content Management</h1>
      <ContentUploadForm />
    </div>
  )
}
