"use client"

import { useState, useEffect } from "react"
import type { FeedbackData } from "@/redux/actions/feedbackActions"
import type { User } from "@/redux/actions/authActions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, Send, Edit, Trash2, X, Loader2 } from "lucide-react"

interface FeedbackPanelProps {
  feedback: FeedbackData[]
  selectedFeedback: FeedbackData | null
  onFeedbackClick: (feedback: FeedbackData) => void
  onSave: (content: string) => Promise<void>
  onDelete: (feedbackId: string) => Promise<void>
  onClose: () => void
  isVisible: boolean
  isLoading: boolean
  currentUser: User | null
}

export default function FeedbackPanel({
  feedback,
  selectedFeedback,
  onFeedbackClick,
  onSave,
  onDelete,
  onClose,
  isVisible,
  isLoading,
  currentUser,
}: FeedbackPanelProps) {
  const [editingContent, setEditingContent] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (selectedFeedback) {
      setEditingContent(selectedFeedback.content)
      setIsEditing(selectedFeedback.id === "temp" || selectedFeedback.content === "")
    }
  }, [selectedFeedback])

  const handleSave = async () => {
    if (!editingContent.trim()) return

    try {
      await onSave(editingContent.trim())
      setIsEditing(false)
      setEditingContent("")
    } catch (error) {
      console.error("Failed to save feedback:", error)
    }
  }

  const handleDelete = async () => {
    if (!selectedFeedback || selectedFeedback.id === "temp") return

    try {
      await onDelete(selectedFeedback.id)
    } catch (error) {
      console.error("Failed to delete feedback:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const sortedFeedback = [...feedback].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="space-y-6">
      {/* Feedback List */}
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
              <p className="text-sm text-muted-foreground mt-1">Click on the image to add the first comment</p>
            </div>
          ) : (
            <ScrollArea className="h-64">
              <div className="space-y-4">
                {sortedFeedback.map((feedbackItem, index) => {
                  const initials = feedbackItem.userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()

                  const isSelected = selectedFeedback?.id === feedbackItem.id

                  return (
                    <div key={feedbackItem.id}>
                      <div
                        className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          isSelected ? "bg-accent" : "hover:bg-accent/50"
                        }`}
                        onClick={() => onFeedbackClick(feedbackItem)}
                      >
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage
                            src={feedbackItem.userAvatar || "/placeholder.svg"}
                            alt={feedbackItem.userName}
                          />
                          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{feedbackItem.userName}</span>
                            {feedbackItem.userId === currentUser?.id && (
                              <Badge variant="secondary" className="text-xs">
                                You
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{feedbackItem.content}</p>
                          <p className="text-xs text-muted-foreground mt-1">{formatDate(feedbackItem.createdAt)}</p>
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

      {/* Selected Feedback Detail */}
      {selectedFeedback && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {selectedFeedback.id === "temp" ? "New Comment" : "Comment Details"}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedFeedback.id !== "temp" && (
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={selectedFeedback.userAvatar || "/placeholder.svg"}
                    alt={selectedFeedback.userName}
                  />
                  <AvatarFallback>
                    {selectedFeedback.userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedFeedback.userName}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(selectedFeedback.createdAt)}</p>
                </div>
              </div>
            )}

            {isEditing ? (
              <div className="space-y-3">
                <Textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  placeholder="Enter your feedback..."
                  rows={4}
                  disabled={isLoading}
                />
                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={isLoading || !editingContent.trim()}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        {selectedFeedback.id === "temp" ? "Post" : "Save"}
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm">{selectedFeedback.content}</p>
                </div>

                {selectedFeedback.userId === currentUser?.id && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDelete} disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="mr-2 h-4 w-4" />
                      )}
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            )}

            {selectedFeedback.position && (
              <div className="text-xs text-muted-foreground">
                Position: {selectedFeedback.position.x.toFixed(1)}%, {selectedFeedback.position.y.toFixed(1)}%
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
