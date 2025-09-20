"use client"

import { useState, useEffect } from "react"
import type { AIAnalysis } from "@/redux/actions/aiVisionActions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Brain, Sparkles, TrendingUp, AlertTriangle } from "lucide-react"

interface AIInsightsBadgeProps {
  analysis?: AIAnalysis | null
  compact?: boolean
}

export default function AIInsightsBadge({ analysis, compact = false }: AIInsightsBadgeProps) {
  const [insights, setInsights] = useState<{
    score: number
    level: "excellent" | "good" | "needs-improvement"
    highlights: string[]
  } | null>(null)

  useEffect(() => {
    if (!analysis) {
      setInsights(null)
      return
    }

    // Calculate design score based on confidence and suggestions
    const baseScore = analysis.confidence * 100
    const suggestionPenalty = Math.min(analysis.suggestions.length * 5, 30)
    const score = Math.max(baseScore - suggestionPenalty, 0)

    let level: "excellent" | "good" | "needs-improvement"
    if (score >= 80) level = "excellent"
    else if (score >= 60) level = "good"
    else level = "needs-improvement"

    // Extract key highlights from analysis
    const highlights = analysis.analysis
      .split(".")
      .filter((sentence) => sentence.trim().length > 10)
      .slice(0, 3)
      .map((sentence) => sentence.trim())

    setInsights({ score: Math.round(score), level, highlights })
  }, [analysis])

  if (!insights) {
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <Brain className="h-3 w-3" />
        No AI Analysis
      </Badge>
    )
  }

  const getScoreColor = (level: string) => {
    switch (level) {
      case "excellent":
        return "text-green-600 bg-green-50 border-green-200"
      case "good":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "needs-improvement":
        return "text-orange-600 bg-orange-50 border-orange-200"
      default:
        return "text-muted-foreground bg-muted border-border"
    }
  }

  const getScoreIcon = (level: string) => {
    switch (level) {
      case "excellent":
        return <Sparkles className="h-3 w-3" />
      case "good":
        return <TrendingUp className="h-3 w-3" />
      case "needs-improvement":
        return <AlertTriangle className="h-3 w-3" />
      default:
        return <Brain className="h-3 w-3" />
    }
  }

  if (compact) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className={`h-6 px-2 ${getScoreColor(insights.level)}`}>
            {getScoreIcon(insights.level)}
            <span className="ml-1 text-xs font-medium">{insights.score}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span className="font-medium">AI Design Score</span>
              <Badge variant="secondary">{insights.score}/100</Badge>
            </div>
            <div className="space-y-2">
              {insights.highlights.map((highlight, index) => (
                <p key={index} className="text-sm text-muted-foreground">
                  • {highlight}
                </p>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5" />
          AI Insights
        </CardTitle>
        <CardDescription>Automated design analysis and scoring</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Design Score</span>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getScoreColor(insights.level)}`}>
            {getScoreIcon(insights.level)}
            <span className="font-bold">{insights.score}/100</span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Key Insights</h4>
          <div className="space-y-1">
            {insights.highlights.map((highlight, index) => (
              <p key={index} className="text-sm text-muted-foreground">
                • {highlight}
              </p>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Based on composition, color theory, typography, and usability principles
        </div>
      </CardContent>
    </Card>
  )
}
