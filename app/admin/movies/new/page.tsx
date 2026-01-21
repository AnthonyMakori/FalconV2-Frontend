"use client";

import { useState } from "react";

export default function NewMoviePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [duration, setDuration] = useState("");
  const [language, setLanguage] = useState("");
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState("draft");

  const [rentalPrice, setRentalPrice] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [rentalPeriod, setRentalPeriod] = useState("");

  const [freePreview, setFreePreview] = useState(false);
  const [previewDuration, setPreviewDuration] = useState("");

  const [poster, setPoster] = useState<File | null>(null);
  const [trailer, setTrailer] = useState<File | null>(null);
  const [subtitles, setSubtitles] = useState<File[]>([]);

  const [casts, setCasts] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  const [bunnyVideoId, setBunnyVideoId] = useState("");
  const [uploading, setUploading] = useState(false);

  const BUNNY_LIBRARY_ID = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID!;
  const BUNNY_ACCESS_KEY = process.env.NEXT_PUBLIC_BUNNY_STREAM_API_KEY!;
  const API_URL = process.env.NEXT_PUBLIC_API_URL!;

  // -----------------------------
  // Upload video to Bunny CDN
  // -----------------------------
  const uploadVideoToBunny = async (file: File) => {
    const url = `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos`;
    const formData = new FormData();
    formData.append("title", file.name);
    formData.append("file", file);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        AccessKey: BUNNY_ACCESS_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload video to Bunny CDN");
    }

    const data = await response.json();
    return data.guid; // Return Bunny video ID
  };

  // -----------------------------
  // Handle Form Submission
  // -----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Upload trailer to Bunny if exists
      let videoGuid = bunnyVideoId;
      if (trailer) {
        videoGuid = await uploadVideoToBunny(trailer);
        setBunnyVideoId(videoGuid);
      }

      // Prepare FormData for Laravel
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("release_year", releaseYear);
      formData.append("duration", duration);
      formData.append("language", language);
      formData.append("genre", genre);
      formData.append("status", status);

      formData.append("rental_price", rentalPrice);
      formData.append("purchase_price", purchasePrice);
      formData.append("rental_period", rentalPeriod);

      formData.append("free_preview", freePreview ? "1" : "0");
      formData.append("preview_duration", previewDuration);

      if (poster) formData.append("poster", poster);
      if (trailer) formData.append("trailer", trailer);
      subtitles.forEach((sub) => formData.append("subtitles[]", sub));

      casts.forEach((cast) => formData.append("casts[]", cast));
      tags.forEach((tag) => formData.append("tags[]", tag));

      formData.append("seo_title", seoTitle);
      formData.append("seo_description", seoDescription);
      formData.append("seo_keywords", seoKeywords);

      formData.append("bunny_video_id", videoGuid);

      // Send to Laravel API
      const response = await fetch(`${API_URL}/movies`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create movie");
      }

      const result = await response.json();
      alert("Movie created successfully!");
      console.log(result);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "An error occurred while creating the movie");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Add New Movie</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border p-2 w-full"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="border p-2 w-full"
        />

        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Release Year"
            value={releaseYear}
            onChange={(e) => setReleaseYear(e.target.value)}
            required
            className="border p-2 w-1/3"
          />
          <input
            type="number"
            placeholder="Duration (min)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            className="border p-2 w-1/3"
          />
          <input
            type="text"
            placeholder="Language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            required
            className="border p-2 w-1/3"
          />
        </div>

        <input
          type="text"
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          required
          className="border p-2 w-full"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>

        {/* Pricing */}
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Rental Price"
            value={rentalPrice}
            onChange={(e) => setRentalPrice(e.target.value)}
            className="border p-2 w-1/3"
          />
          <input
            type="number"
            placeholder="Purchase Price"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            className="border p-2 w-1/3"
          />
          <input
            type="number"
            placeholder="Rental Period (days)"
            value={rentalPeriod}
            onChange={(e) => setRentalPeriod(e.target.value)}
            className="border p-2 w-1/3"
          />
        </div>

        {/* Free preview */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={freePreview}
            onChange={(e) => setFreePreview(e.target.checked)}
          />
          <span>Enable Free Preview</span>
          {freePreview && (
            <input
              type="number"
              placeholder="Preview Duration (min)"
              value={previewDuration}
              onChange={(e) => setPreviewDuration(e.target.value)}
              className="border p-2 w-1/4"
            />
          )}
        </div>

        {/* Poster */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPoster(e.target.files?.[0] || null)}
        />

        {/* Trailer */}
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setTrailer(e.target.files?.[0] || null)}
        />

        {/* Subtitles */}
        <input
          type="file"
          multiple
          accept=".srt,.vtt"
          onChange={(e) =>
            setSubtitles(e.target.files ? Array.from(e.target.files) : [])
          }
        />

        {/* Casts & Tags */}
        <input
          type="text"
          placeholder="Casts (comma separated)"
          onChange={(e) =>
            setCasts(e.target.value.split(",").map((c) => c.trim()))
          }
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          onChange={(e) =>
            setTags(e.target.value.split(",").map((t) => t.trim()))
          }
        />

        {/* SEO */}
        <input
          type="text"
          placeholder="SEO Title"
          value={seoTitle}
          onChange={(e) => setSeoTitle(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="SEO Description"
          value={seoDescription}
          onChange={(e) => setSeoDescription(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="SEO Keywords"
          value={seoKeywords}
          onChange={(e) => setSeoKeywords(e.target.value)}
          className="border p-2 w-full"
        />

        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {uploading ? "Uploading..." : "Create Movie"}
        </button>
      </form>
    </div>
  );
}
