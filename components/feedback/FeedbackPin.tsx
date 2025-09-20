"use client"

import type { FeedbackData } from "@/redux/actions/feedbackActions"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare } from "lucide-react"

interface FeedbackPinProps {
  feedback: FeedbackData
  onClick: () => void
  isSelected?: boolean
  isTemporary?: boolean
}

export default function FeedbackPin({ feedback, onClick, isSelected = false, isTemporary = false }: FeedbackPinProps) {
  if (!feedback.position) return null

  const initials = feedback.userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
      style={{
        left: `${feedback.position.x}%`,
        top: `${feedback.position.y}%`,
      }}
    >
      <Button
        variant={isSelected ? "default" : "secondary"}
        size="sm"
        className={`h-8 w-8 rounded-full p-0 shadow-lg transition-all duration-200 ${
          isSelected ? "ring-2 ring-primary ring-offset-2" : "hover:scale-110"
        } ${isTemporary ? "animate-pulse" : ""}`}
        onClick={onClick}
      >
        {isTemporary ? (
          <MessageSquare className="h-4 w-4" />
        ) : (
          <Avatar className="h-6 w-6">
            <AvatarImage src={feedback.userAvatar || "/placeholder.svg"} alt={feedback.userName} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
        )}
      </Button>

      {/* Tooltip */}
      {!isSelected && !isTemporary && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-popover text-popover-foreground px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg">
            {feedback.userName}
          </div>
        </div>
      )}
    </div>
  )
}
