"use client"

import type React from "react"

import { useState } from "react"
import { useSelector } from "react-redux"
import Link from "next/link"
import type { RootState } from "@/redux/store"
import type { ImageData } from "@/redux/actions/imageActions"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eye, MessageSquare, MoreHorizontal, Share2, Download, Trash2 } from "lucide-react"

interface ImageCardProps {
  image: ImageData
  onDelete?: (imageId: string) => void
  showActions?: boolean
}

export default function ImageCard({ image, onDelete, showActions = true }: ImageCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useSelector((state: RootState) => state.auth)

  const isOwner = user?.id === image.uploadedBy

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const response = await fetch(image.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = image.title || "image"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (navigator.share) {
      try {
        await navigator.share({
          title: image.title,
          text: image.description,
          url: `/images/${image.id}`,
        })
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(`${window.location.origin}/images/${image.id}`)
      }
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/images/${image.id}`)
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onDelete) {
      onDelete(image.id)
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
      <Link href={`/images/${image.id}`}>
        <CardContent className="p-0">
          <div className="relative">
            <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
              <img
                src={image.url || "/placeholder.svg"}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                loading="lazy"
              />
            </div>

            {/* Actions Dropdown */}
            {showActions && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleShare}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDownload}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    {isOwner && (
                      <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="font-medium truncate mb-1">{image.title}</h3>
            {image.description && (
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{image.description}</p>
            )}

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{formatDate(image.createdAt)}</p>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
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

            {/* Metadata */}
            {image.metadata && (
              <div className="flex items-center gap-2 mt-2">
                {image.metadata.format && (
                  <Badge variant="outline" className="text-xs">
                    {image.metadata.format.toUpperCase()}
                  </Badge>
                )}
                {image.metadata.width && image.metadata.height && (
                  <Badge variant="outline" className="text-xs">
                    {image.metadata.width}×{image.metadata.height}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
