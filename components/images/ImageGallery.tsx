"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import Link from "next/link"
import type { RootState } from "@/redux/store"
import type { ImageData } from "@/redux/actions/imageActions"
import { fetchImages } from "@/api/imageApi"
import { fetchImagesRequest, fetchImagesSuccess, fetchImagesFailure } from "@/redux/actions/imageActions"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Grid, List, Search, Upload, Eye, MessageSquare } from "lucide-react"

interface ImageGalleryProps {
  projectId?: string
  showUploadButton?: boolean
}

export default function ImageGallery({ projectId, showUploadButton = true }: ImageGalleryProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [filteredImages, setFilteredImages] = useState<ImageData[]>([])

  const dispatch = useDispatch()
  const { images, isLoading, error } = useSelector((state: RootState) => state.images)

  useEffect(() => {
    const loadImages = async () => {
      dispatch(fetchImagesRequest())
      try {
        const imageData = await fetchImages(projectId)
        dispatch(fetchImagesSuccess(imageData))
      } catch (error: any) {
        dispatch(fetchImagesFailure(error.response?.data?.message || "Failed to load images"))
      }
    }

    loadImages()
  }, [dispatch, projectId])

  useEffect(() => {
    const filtered = images.filter(
      (image) =>
        image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (image.description && image.description.toLowerCase().includes(searchTerm.toLowerCase())),
    )

    // Sort images
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    setFilteredImages(filtered)
  }, [images, searchTerm, sortBy])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-0">
                <div className="aspect-square bg-muted rounded-t-lg" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Images</h2>
          <p className="text-muted-foreground">
            {filteredImages.length} {filteredImages.length === 1 ? "image" : "images"}
          </p>
        </div>

        {showUploadButton && (
          <Button asChild>
            <Link href={`/images/upload${projectId ? `?projectId=${projectId}` : ""}`}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Images
            </Link>
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="title">Title A-Z</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Images */}
      {filteredImages.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Eye className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No images found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? "Try adjusting your search terms" : "Upload your first image to get started"}
          </p>
          {showUploadButton && !searchTerm && (
            <Button asChild>
              <Link href={`/images/upload${projectId ? `?projectId=${projectId}` : ""}`}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Images
              </Link>
            </Button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredImages.map((image) => (
            <Link key={image.id} href={`/images/${image.id}`}>
              <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
                <CardContent className="p-0">
                  <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium truncate mb-1">{image.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{formatDate(image.createdAt)}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>0</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>0</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredImages.map((image) => (
            <Link key={image.id} href={`/images/${image.id}`}>
              <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={image.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate mb-1">{image.title}</h3>
                      {image.description && (
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{image.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{formatDate(image.createdAt)}</span>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>0 views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>0 comments</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
