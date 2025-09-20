"use client"

import type React from "react"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/redux/store"
import { createFeedback } from "@/api/feedbackApi"
import { createFeedbackRequest, createFeedbackSuccess, createFeedbackFailure } from "@/redux/actions/feedbackActions"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Send, Loader2 } from "lucide-react"

interface FeedbackFormProps {
  imageId: string
  position?: { x: number; y: number }
  onSuccess?: () => void
  onCancel?: () => void
}

export default function FeedbackForm({ imageId, position, onSuccess, onCancel }: FeedbackFormProps) {
  const [content, setContent] = useState("")
  const [error, setError] = useState("")

  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { isLoading } = useSelector((state: RootState) => state.feedback)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      setError("Please enter your feedback")
      return
    }

    if (!user) {
      setError("You must be logged in to leave feedback")
      return
    }

    dispatch(createFeedbackRequest())
    setError("")

    try {
      const feedbackData = await createFeedback({
        imageId,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        content: content.trim(),
        position,
      })

      dispatch(createFeedbackSuccess(feedbackData))
      setContent("")
      onSuccess?.()
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to create feedback"
      dispatch(createFeedbackFailure(errorMessage))
      setError(errorMessage)
    }
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertDescription>Please log in to leave feedback</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Add Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-sm mb-2">{user.name}</p>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts on this design..."
                rows={4}
                disabled={isLoading}
              />
            </div>
          </div>

          {position && (
            <div className="text-xs text-muted-foreground">
              This feedback will be pinned at position {position.x.toFixed(0)}%, {position.y.toFixed(0)}%
            </div>
          )}

          <div className="flex gap-2 justify-end">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading || !content.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Post Feedback
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
