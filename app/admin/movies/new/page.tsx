'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Upload, Plus, X } from "lucide-react"

export default function NewMoviePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/movies">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Add New Movie</h1>
      </div>

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic details of the movie</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Enter movie title" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter movie description" className="min-h-[120px]" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="year">Release Year</Label>
                  <Input id="year" type="number" placeholder="2023" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input id="duration" type="number" placeholder="120" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Input id="language" placeholder="English" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Select>
                    <SelectTrigger id="genre">
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="action">Action</SelectItem>
                      <SelectItem value="comedy">Comedy</SelectItem>
                      <SelectItem value="drama">Drama</SelectItem>
                      <SelectItem value="horror">Horror</SelectItem>
                      <SelectItem value="romance">Romance</SelectItem>
                      <SelectItem value="thriller">Thriller</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cast</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-sm">
                    Actor Name
                    <button className="text-muted-foreground hover:text-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-sm">
                    Another Actor
                    <button className="text-muted-foreground hover:text-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Add cast member" />
                  <Button type="button" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-sm">
                    African
                    <button className="text-muted-foreground hover:text-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-sm">
                    Kenyan
                    <button className="text-muted-foreground hover:text-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Add tag" />
                  <Button type="button" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>Media Files</CardTitle>
              <CardDescription>Upload movie poster, trailer, and video files</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                <Label>Trailer Video</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Drag and drop or click to upload</p>
                  <p className="text-xs text-muted-foreground">Supported formats: MP4, MOV, MKV</p>
                  <Input type="file" className="hidden" id="trailer-upload" />
                  <Button type="button" variant="outline" size="sm" className="mt-4">
                    <Label htmlFor="trailer-upload" className="cursor-pointer">
                      Select File
                    </Label>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Full Movie</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Drag and drop or click to upload</p>
                  <p className="text-xs text-muted-foreground">Supported formats: MP4, MOV, MKV</p>
                  <Input type="file" className="hidden" id="movie-upload" />
                  <Button type="button" variant="outline" size="sm" className="mt-4">
                    <Label htmlFor="movie-upload" className="cursor-pointer">
                      Select File
                    </Label>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Subtitle Files</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Drag and drop or click to upload</p>
                  <p className="text-xs text-muted-foreground">Supported formats: SRT, VTT</p>
                  <Input type="file" className="hidden" id="subtitle-upload" multiple />
                  <Button type="button" variant="outline" size="sm" className="mt-4">
                    <Label htmlFor="subtitle-upload" className="cursor-pointer">
                      Select Files
                    </Label>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Information</CardTitle>
              <CardDescription>Set up pricing for the movie</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="price">Rental Price (KES)</Label>
                <Input id="price" type="number" placeholder="200" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchase-price">Purchase Price (KES)</Label>
                <Input id="purchase-price" type="number" placeholder="500" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rental-period">Rental Period (hours)</Label>
                <Input id="rental-period" type="number" placeholder="48" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="free-preview" className="rounded border-gray-300" />
                  <Label htmlFor="free-preview">Allow free preview</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preview-duration">Preview Duration (minutes)</Label>
                <Input id="preview-duration" type="number" placeholder="5" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO Information</CardTitle>
              <CardDescription>Optimize for search engines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="seo-title">SEO Title</Label>
                <Input id="seo-title" placeholder="Enter SEO title" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo-description">Meta Description</Label>
                <Textarea id="seo-description" placeholder="Enter meta description" className="min-h-[100px]" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo-keywords">Meta Keywords</Label>
                <Input id="seo-keywords" placeholder="Enter keywords separated by commas" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Save as Draft</Button>
        <Button>Publish Movie</Button>
      </div>
    </div>
  )
}
