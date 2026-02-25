'use client'

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import BasicInfo, { CastMember } from "@/components/admin/movies/BasicInfo"
import MediaUploadSection from "@/components/admin/movies/MediaUploadSection"
import PricingInfo from "@/components/admin/movies/PricingInfo"
import SeoInfo from "@/components/admin/movies/SeoInfo"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

export default function NewMoviePage() {

  const [loading,setLoading] = useState(false)

  /* ---------------- BASIC ---------------- */
  const [title,setTitle]=useState("")
  const [description,setDescription]=useState("")
  const [releaseYear,setReleaseYear]=useState("")
  const [duration,setDuration]=useState("")
  const [language,setLanguage]=useState("")
  const [genre,setGenre]=useState("")
  const [status,setStatus]=useState("draft")

  const [casts,setCasts]=useState<CastMember[]>([])
  const [castInput,setCastInput]=useState("")
  const [castImage,setCastImage]=useState<File|null>(null)

  const [tags,setTags]=useState<string[]>([])
  const [tagInput,setTagInput]=useState("")

  const addCast = () => {
    if(!castInput.trim()) return
    setCasts([...casts,{ name: castInput.trim(), image: castImage }])
    setCastInput("")
    setCastImage(null)
  }

  const removeCast=(name:string)=>
    setCasts(casts.filter(c=>c.name!==name))

  const addTag=()=>{
    if(!tagInput.trim()) return
    setTags([...tags,tagInput.trim()])
    setTagInput("")
  }

  const removeTag=(t:string)=>
    setTags(tags.filter(x=>x!==t))

  /* ---------------- MEDIA ---------------- */
  const [poster,setPoster]=useState<File|null>(null)
  const [trailer,setTrailer]=useState<File|null>(null)
  const [movie,setMovie]=useState<File|null>(null)
  const [subtitles,setSubtitles]=useState<File[]>([])

  /* ---------------- PRICING ---------------- */
  const [rentalPrice,setRentalPrice]=useState("")
  const [purchasePrice,setPurchasePrice]=useState("")
  const [rentalPeriod,setRentalPeriod]=useState("")
  const [freePreview,setFreePreview]=useState(false)
  const [previewDuration,setPreviewDuration]=useState("")

  /* ---------------- SEO ---------------- */
  const [seoTitle,setSeoTitle]=useState("")
  const [seoDescription,setSeoDescription]=useState("")
  const [seoKeywords,setSeoKeywords]=useState("")

  const submitMovie = async(publish=false)=>{
    setLoading(true)
    try{
      const token = localStorage.getItem("token")
      const formData = new FormData()

      formData.append("title",title)
      formData.append("description",description)
      formData.append("release_year",releaseYear)
      formData.append("duration",duration)
      formData.append("language",language)
      formData.append("genre",genre)
      formData.append("status",publish?"published":status)

      formData.append("rental_price",rentalPrice)
      formData.append("purchase_price",purchasePrice)
      formData.append("rental_period",rentalPeriod)
      formData.append("free_preview",freePreview?"1":"0")
      formData.append("preview_duration",previewDuration)

      formData.append("seo_title",seoTitle)
      formData.append("seo_description",seoDescription)
      formData.append("seo_keywords",seoKeywords)

      /* ---- CASTS ---- */
      casts.forEach((c,index)=>{
        formData.append(`casts[${index}][name]`,c.name)
        if(c.image){
          formData.append(`casts[${index}][image]`,c.image)
        }
      })

      tags.forEach(t=>formData.append("tags[]",t))

      if(poster) formData.append("poster",poster)
      if(trailer) formData.append("trailer",trailer)
      subtitles.forEach(s=>formData.append("subtitles[]",s))

      const res = await fetch(`${API_URL}/movies`,{
        method:"POST",
        headers:{Authorization:`Bearer ${token}`},
        body: formData
      })

      if(!res.ok) throw await res.json()
      alert("Movie saved successfully 🎉")

    }catch(err){
      console.error(err)
      alert("Failed")
    }
    finally{setLoading(false)}
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center gap-4">
        <Link href="/admin/movies">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4"/>
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

        <TabsContent value="basic">
          <BasicInfo
            {...{
              title,setTitle,
              description,setDescription,
              releaseYear,setReleaseYear,
              duration,setDuration,
              language,setLanguage,
              genre,setGenre,
              status,setStatus,
              casts,castInput,setCastInput,
              setCastImage,addCast,removeCast,
              tags,addTag,removeTag,
              tagInput,setTagInput
            }}
          />
        </TabsContent>

        <TabsContent value="media">
          <MediaUploadSection
            {...{poster,setPoster,trailer,setTrailer,movie,setMovie,subtitles,setSubtitles}}
          />
        </TabsContent>

        <TabsContent value="pricing">
          <PricingInfo
            {...{rentalPrice,setRentalPrice,purchasePrice,setPurchasePrice,
            rentalPeriod,setRentalPeriod,freePreview,setFreePreview,
            previewDuration,setPreviewDuration}}
          />
        </TabsContent>

        <TabsContent value="seo">
          <SeoInfo
            {...{seoTitle,setSeoTitle,seoDescription,setSeoDescription,
            seoKeywords,setSeoKeywords}}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button variant="outline" disabled={loading} onClick={()=>submitMovie(false)}>
          Save as Draft
        </Button>
        <Button disabled={loading} onClick={()=>submitMovie(true)}>
          Publish Movie
        </Button>
      </div>

    </div>
  )
}