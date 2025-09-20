"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams, useRouter } from "next/navigation"
import type { RootState } from "@/redux/store"
import type { FeedbackData } from "@/redux/actions/feedbackActions"
import { fetchImageById } from "@/api/imageApi"
import { fetchFeedback, createFeedback, updateFeedback, deleteFeedback } from "@/api/feedbackApi"
import {
  fetchFeedbackRequest,
  fetchFeedbackSuccess,
  fetchFeedbackFailure,
  createFeedbackRequest,
  createFeedbackSuccess,
  createFeedbackFailure,
  updateFeedbackRequest,
  updateFeedbackSuccess,
  updateFeedbackFailure,
  deleteFeedbackRequest,
  deleteFeedbackSuccess,
  deleteFeedbackFailure,
} from "@/redux/actions/feedbackActions"
import AuthGuard from "@/components/auth/AuthGuard"
import FeedbackPin from "@/components/feedback/FeedbackPin"
import FeedbackPanel from "@/components/feedback/FeedbackPanel"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, MessageSquare, Plus, Loader2 } from "lucide-react"

export default function FeedbackPage() {
  const [imageData, setImageData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAddingFeedback, setIsAddingFeedback] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackData | null>(null)
  const [showPanel, setShowPanel] = useState(false)

  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const params = useParams()
  const router = useRouter()
  const dispatch = useDispatch()
  const imageId = params.id as string

  const { user } = useSelector((state: RootState) => state.auth)
  const { feedback, isLoading: feedbackLoading } = useSelector((state: RootState) => state.feedback)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load image data
        const image = await fetchImageById(imageId)
        setImageData(image)

        // Load feedback
        dispatch(fetchFeedbackRequest())
        const feedbackData = await fetchFeedback(imageId)
        dispatch(fetchFeedbackSuccess(feedbackData))
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to load data"
        setError(errorMessage)
        dispatch(fetchFeedbackFailure(errorMessage))
      } finally {
        setIsLoading(false)
      }
    }

    if (imageId) {
      loadData()
    }
  }, [imageId, dispatch])

  const handleImageClick = async (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isAddingFeedback || !imageRef.current || !user) return

    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    // Create new feedback
    const newFeedback = {
      imageId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content: "",
      position: { x, y },
    }

    setSelectedFeedback({
      ...newFeedback,
      id: "temp",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    setShowPanel(true)
    setIsAddingFeedback(false)
  }

  const handleSaveFeedback = async (content: string) => {
    if (!selectedFeedback || !user) return

    if (selectedFeedback.id === "temp") {
      // Create new feedback
      dispatch(createFeedbackRequest())
      try {
        const feedbackData = await createFeedback({
          imageId,
          userId: user.id,
          userName: user.name,
          userAvatar: user.avatar,
          content,
          position: selectedFeedback.position,
        })
        dispatch(createFeedbackSuccess(feedbackData))
        setSelectedFeedback(null)
        setShowPanel(false)
      } catch (error: any) {
        dispatch(createFeedbackFailure(error.response?.data?.message || "Failed to create feedback"))
      }
    } else {
      // Update existing feedback
      dispatch(updateFeedbackRequest())
      try {
        const updatedFeedback = await updateFeedback(selectedFeedback.id, content)
        dispatch(updateFeedbackSuccess(updatedFeedback))
        setSelectedFeedback(null)
        setShowPanel(false)
      } catch (error: any) {
        dispatch(updateFeedbackFailure(error.response?.data?.message || "Failed to update feedback"))
      }
    }
  }

  const handleDeleteFeedback = async (feedbackId: string) => {
    dispatch(deleteFeedbackRequest())
    try {
      await deleteFeedback(feedbackId)
      dispatch(deleteFeedbackSuccess(feedbackId))
      setSelectedFeedback(null)
      setShowPanel(false)
    } catch (error: any) {
      dispatch(deleteFeedbackFailure(error.response?.data?.message || "Failed to delete feedback"))
    }
  }

  const handleFeedbackClick = (feedbackItem: FeedbackData) => {
    setSelectedFeedback(feedbackItem)
    setShowPanel(true)
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading feedback...</span>
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
                  <h1 className="text-2xl font-bold">{imageData.title}</h1>
                  <p className="text-muted-foreground">
                    {feedback.length} {feedback.length === 1 ? "comment" : "comments"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={isAddingFeedback ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsAddingFeedback(!isAddingFeedback)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isAddingFeedback ? "Cancel" : "Add Feedback"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Image with Feedback Pins */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-0">
                  <div
                    ref={containerRef}
                    className="relative bg-muted rounded-lg overflow-hidden"
                    style={{ cursor: isAddingFeedback ? "crosshair" : "default" }}
                  >
                    <img
                      ref={imageRef}
                      src={imageData.url || "/placeholder.svg"}
                      alt={imageData.title}
                      className="w-full h-auto max-h-[70vh] object-contain"
                      onClick={handleImageClick}
                    />

                    {/* Feedback Pins */}
                    {feedback.map((feedbackItem) => (
                      <FeedbackPin
                        key={feedbackItem.id}
                        feedback={feedbackItem}
                        onClick={() => handleFeedbackClick(feedbackItem)}
                        isSelected={selectedFeedback?.id === feedbackItem.id}
                      />
                    ))}

                    {/* Temporary Pin for New Feedback */}
                    {selectedFeedback?.id === "temp" && (
                      <FeedbackPin
                        feedback={selectedFeedback}
                        onClick={() => {}}
                        isSelected={true}
                        isTemporary={true}
                      />
                    )}

                    {/* Instructions Overlay */}
                    {isAddingFeedback && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <div className="text-center space-y-2">
                          <MessageSquare className="h-12 w-12 mx-auto text-primary" />
                          <p className="text-lg font-medium">Click anywhere to add feedback</p>
                          <p className="text-muted-foreground">Click on the image where you want to leave a comment</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Feedback Panel */}
            <div className="lg:col-span-1">
              <FeedbackPanel
                feedback={feedback}
                selectedFeedback={selectedFeedback}
                onFeedbackClick={handleFeedbackClick}
                onSave={handleSaveFeedback}
                onDelete={handleDeleteFeedback}
                onClose={() => {
                  setSelectedFeedback(null)
                  setShowPanel(false)
                }}
                isVisible={showPanel}
                isLoading={feedbackLoading}
                currentUser={user}
              />
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
