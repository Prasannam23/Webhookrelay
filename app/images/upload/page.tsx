"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter, useSearchParams } from "next/navigation"
import type { RootState } from "@/redux/store"
import { uploadImage } from "@/api/imageApi"
import { uploadImageRequest, uploadImageSuccess, uploadImageFailure } from "@/redux/actions/imageActions"
import { validateImageFile } from "@/utils/validators"
import AuthGuard from "@/components/auth/AuthGuard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, X, Loader2 } from "lucide-react"

export default function ImageUploadPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [validationError, setValidationError] = useState("")

  const dispatch = useDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get("projectId")

  const { isLoading, error } = useSelector((state: RootState) => state.images)

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    const validFiles: File[] = []
    const newPreviews: string[] = []

    for (const file of fileArray) {
      const validation = validateImageFile(file)
      if (!validation.isValid) {
        setValidationError(validation.error || "Invalid file")
        return
      }

      validFiles.push(file)
      const preview = URL.createObjectURL(file)
      newPreviews.push(preview)
    }

    setSelectedFiles((prev) => [...prev, ...validFiles])
    setPreviews((prev) => [...prev, ...newPreviews])
    setValidationError("")
  }, [])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      handleFileSelect(e.dataTransfer.files)
    },
    [handleFileSelect],
  )

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index])
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedFiles.length === 0) {
      setValidationError("Please select at least one image")
      return
    }

    if (!title.trim()) {
      setValidationError("Please enter a title")
      return
    }

    dispatch(uploadImageRequest())

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        const formData = new FormData()
        formData.append("image", file)
        formData.append("title", title)
        formData.append("description", description)
        if (projectId) {
          formData.append("projectId", projectId)
        }

        const progress = ((i + 1) / selectedFiles.length) * 100
        setUploadProgress(progress)

        const imageData = await uploadImage(formData)
        dispatch(uploadImageSuccess(imageData))
      }

      // Clean up previews
      previews.forEach((preview) => URL.revokeObjectURL(preview))

      // Redirect to images or project page
      if (projectId) {
        router.push(`/projects/${projectId}`)
      } else {
        router.push("/dashboard")
      }
    } catch (error: any) {
      dispatch(uploadImageFailure(error.response?.data?.message || "Upload failed"))
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Upload Images</h1>
            <p className="text-muted-foreground mt-2">Share your designs and get feedback from your team</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {(error || validationError) && (
              <Alert variant="destructive">
                <AlertDescription>{error || validationError}</AlertDescription>
              </Alert>
            )}

            {/* File Upload Area */}
            <Card>
              <CardHeader>
                <CardTitle>Select Images</CardTitle>
                <CardDescription>Upload JPG, PNG, GIF, or WebP files up to 10MB each</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">
                      Drop your images here, or{" "}
                      <label className="text-primary cursor-pointer hover:underline">
                        browse
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileSelect(e.target.files)}
                          disabled={isLoading}
                        />
                      </label>
                    </p>
                    <p className="text-sm text-muted-foreground">Supports JPG, PNG, GIF, WebP up to 10MB</p>
                  </div>
                </div>

                {/* File Previews */}
                {selectedFiles.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h3 className="font-medium">Selected Files ({selectedFiles.length})</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                            <img
                              src={previews[index] || "/placeholder.svg"}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <p className="text-xs text-muted-foreground mt-1 truncate">{file.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Image Details */}
            <Card>
              <CardHeader>
                <CardTitle>Image Details</CardTitle>
                <CardDescription>Add a title and description for your images</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a title for your images"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a description or context for your images"
                    rows={3}
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Upload Progress */}
            {isLoading && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Uploading...</span>
                      <span className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || selectedFiles.length === 0}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Images
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AuthGuard>
  )
}
