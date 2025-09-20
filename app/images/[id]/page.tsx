"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams, useRouter } from "next/navigation"
import type { RootState } from "@/redux/store"
import { fetchImageById, deleteImage } from "@/api/imageApi"
import { deleteImageRequest, deleteImageSuccess, deleteImageFailure } from "@/redux/actions/imageActions"
import AuthGuard from "@/components/auth/AuthGuard"
import AIAnalysisCard from "@/components/ai/AIAnalysisCard"
import AIInsightsBadge from "@/components/ai/AIInsightsBadge"
import FeedbackList from "@/components/feedback/FeedbackList"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, Download, Share2, Trash2, MessageSquare, Eye, Calendar, User, Loader2, Brain } from "lucide-react"

export default function ImageDetailPage() {
  const [imageData, setImageData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const params = useParams()
  const router = useRouter()
  const dispatch = useDispatch()
  const imageId = params.id as string

  const { user } = useSelector((state: RootState) => state.auth)
  const { isLoading: deleteLoading } = useSelector((state: RootState) => state.images)
  const { currentAnalysis } = useSelector((state: RootState) => state.aiVision)

  useEffect(() => {
    const loadImage = async () => {
      try {
        const data = await fetchImageById(imageId)
        setImageData(data)
      } catch (error: any) {
        setError(error.response?.data?.message || "Failed to load image")
      } finally {
        setIsLoading(false)
      }
    }

    if (imageId) {
      loadImage()
    }
  }, [imageId])

  const handleDelete = async () => {
    dispatch(deleteImageRequest())
    try {
      await deleteImage(imageId)
      dispatch(deleteImageSuccess(imageId))
      setDeleteDialogOpen(false)
      router.push("/dashboard")
    } catch (error: any) {
      dispatch(deleteImageFailure(error.response?.data?.message || "Failed to delete image"))
    }
  }

  const handleDownload = () => {
    if (imageData?.url) {
      const link = document.createElement("a")
      link.href = imageData.url
      link.download = imageData.title || "image"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: imageData?.title,
          text: imageData?.description,
          url: window.location.href,
        })
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading image...</span>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (error || !imageData) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background p-6">
          <div className="max-w-4xl mx-auto">
            <Alert variant="destructive">
              <AlertDescription>{error || "Image not found"}</AlertDescription>
            </Alert>
            <Button onClick={() => router.back()} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </AuthGuard>
    )
  }

  const isOwner = user?.id === imageData.uploadedBy
  const formattedDate = new Date(imageData.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-card">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold">{imageData.title}</h1>
                    <AIInsightsBadge analysis={currentAnalysis} compact />
                  </div>
                  <p className="text-muted-foreground">Uploaded {formattedDate}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={`/feedback/${imageId}`}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Feedback
                  </a>
                </Button>
                {isOwner && (
                  <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Image</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this image? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
                          {deleteLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            "Delete"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Image */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-0">
                  <div className="relative bg-muted rounded-lg overflow-hidden">
                    <img
                      src={imageData.url || "/placeholder.svg"}
                      alt={imageData.title}
                      className="w-full h-auto max-h-[70vh] object-contain"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <AIAnalysisCard imageId={imageId} imageUrl={imageData.url} />

              {/* Image Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Image Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {imageData.description && (
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-muted-foreground">{imageData.description}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Format</span>
                      <p className="font-medium">{imageData.metadata?.format?.toUpperCase() || "Unknown"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Size</span>
                      <p className="font-medium">
                        {imageData.metadata?.size
                          ? `${(imageData.metadata.size / 1024 / 1024).toFixed(1)} MB`
                          : "Unknown"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Dimensions</span>
                      <p className="font-medium">
                        {imageData.metadata?.width && imageData.metadata?.height
                          ? `${imageData.metadata.width} × ${imageData.metadata.height}`
                          : "Unknown"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Uploaded</span>
                      <p className="font-medium">{formattedDate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                    <a href={`/feedback/${imageId}`}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Add Feedback
                    </a>
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                    <a href="/ai-analysis">
                      <Brain className="mr-2 h-4 w-4" />
                      AI Analysis
                    </a>
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <User className="mr-2 h-4 w-4" />
                    Share with Team
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Review
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Feedback */}
              <FeedbackList imageId={imageId} maxHeight="300px" />

              {/* Project Info */}
              {imageData.projectId && (
                <Card>
                  <CardHeader>
                    <CardTitle>Project</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary">Project #{imageData.projectId}</Badge>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
