"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/redux/store"
import type { FeedbackData } from "@/redux/actions/feedbackActions"
import { fetchFeedback } from "@/api/feedbackApi"
import { fetchFeedbackRequest, fetchFeedbackSuccess, fetchFeedbackFailure } from "@/redux/actions/feedbackActions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, Clock } from "lucide-react"

interface FeedbackListProps {
  imageId: string
  onFeedbackClick?: (feedback: FeedbackData) => void
  maxHeight?: string
}

export default function FeedbackList({ imageId, onFeedbackClick, maxHeight = "400px" }: FeedbackListProps) {
  const dispatch = useDispatch()
  const { feedback, isLoading, error } = useSelector((state: RootState) => state.feedback)
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    const loadFeedback = async () => {
      dispatch(fetchFeedbackRequest())
      try {
        const feedbackData = await fetchFeedback(imageId)
        dispatch(fetchFeedbackSuccess(feedbackData))
      } catch (error: any) {
        dispatch(fetchFeedbackFailure(error.response?.data?.message || "Failed to load feedback"))
      }
    }

    if (imageId) {
      loadFeedback()
    }
  }, [imageId, dispatch])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    }
  }

  const sortedFeedback = [...feedback].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="h-8 w-8 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-3 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments ({feedback.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {feedback.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No comments yet</p>
            <p className="text-sm text-muted-foreground mt-1">Be the first to leave feedback</p>
          </div>
        ) : (
          <ScrollArea style={{ height: maxHeight }}>
            <div className="space-y-4">
              {sortedFeedback.map((feedbackItem, index) => {
                const initials = feedbackItem.userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()

                return (
                  <div key={feedbackItem.id}>
                    <div
                      className={`flex gap-3 p-3 rounded-lg transition-colors ${
                        onFeedbackClick ? "cursor-pointer hover:bg-accent/50" : ""
                      }`}
                      onClick={() => onFeedbackClick?.(feedbackItem)}
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={feedbackItem.userAvatar || "/placeholder.svg"} alt={feedbackItem.userName} />
                        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{feedbackItem.userName}</span>
                          {feedbackItem.userId === user?.id && (
                            <Badge variant="secondary" className="text-xs">
                              You
                            </Badge>
                          )}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDate(feedbackItem.createdAt)}
                          </div>
                        </div>
                        <p className="text-sm text-foreground">{feedbackItem.content}</p>
                        {feedbackItem.position && (
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                            <span className="text-xs text-muted-foreground">
                              Pinned at {feedbackItem.position.x.toFixed(0)}%, {feedbackItem.position.y.toFixed(0)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {index < sortedFeedback.length - 1 && <Separator className="my-2" />}
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
