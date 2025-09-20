"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/redux/store"
import type { AIAnalysis } from "@/redux/actions/aiVisionActions"
import { analyzeImage } from "@/api/aiVisionApi"
import { analyzeImageRequest, analyzeImageSuccess, analyzeImageFailure } from "@/redux/actions/aiVisionActions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, Sparkles, CheckCircle, AlertCircle, Loader2, Zap } from "lucide-react"

interface AIAnalysisCardProps {
  imageId: string
  imageUrl: string
  onAnalysisComplete?: (analysis: AIAnalysis) => void
}

export default function AIAnalysisCard({ imageId, imageUrl, onAnalysisComplete }: AIAnalysisCardProps) {
  const [analysisProgress, setAnalysisProgress] = useState(0)

  const dispatch = useDispatch()
  const { currentAnalysis, isAnalyzing, error } = useSelector((state: RootState) => state.aiVision)

  const handleAnalyze = async () => {
    dispatch(analyzeImageRequest())
    setAnalysisProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 15
      })
    }, 300)

    try {
      const analysis = await analyzeImage(imageId, imageUrl)
      dispatch(analyzeImageSuccess(analysis))
      setAnalysisProgress(100)
      onAnalysisComplete?.(analysis)
    } catch (error: any) {
      dispatch(analyzeImageFailure(error.response?.data?.message || "Analysis failed"))
    } finally {
      clearInterval(progressInterval)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Analysis
        </CardTitle>
        <CardDescription>Get intelligent feedback on this design</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!currentAnalysis && !isAnalyzing && (
          <div className="text-center py-6">
            <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No analysis yet</p>
            <Button onClick={handleAnalyze} className="w-full">
              <Zap className="mr-2 h-4 w-4" />
              Analyze with AI
            </Button>
          </div>
        )}

        {isAnalyzing && (
          <div className="space-y-4">
            <div className="text-center">
              <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary mb-2" />
              <p className="font-medium">Analyzing design...</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} className="w-full" />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              AI is examining composition, colors, typography, and usability
            </p>
          </div>
        )}

        {currentAnalysis && (
          <div className="space-y-4">
            {/* Confidence Score */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Analysis Confidence</span>
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                {Math.round(currentAnalysis.confidence * 100)}%
              </Badge>
            </div>

            {/* Analysis Summary */}
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Analysis
              </h4>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm">{currentAnalysis.analysis}</p>
              </div>
            </div>

            {/* Top Suggestions */}
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Key Suggestions
              </h4>
              <div className="space-y-2">
                {currentAnalysis.suggestions.slice(0, 3).map((suggestion, index) => (
                  <div key={index} className="flex gap-2 text-sm">
                    <div className="flex-shrink-0 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">{index + 1}</span>
                    </div>
                    <p className="text-muted-foreground">{suggestion}</p>
                  </div>
                ))}
              </div>
              {currentAnalysis.suggestions.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  +{currentAnalysis.suggestions.length - 3} more suggestions available
                </p>
              )}
            </div>

            {/* Timestamp */}
            <div className="text-xs text-muted-foreground">
              Analyzed{" "}
              {new Date(currentAnalysis.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>

            {/* Re-analyze Button */}
            <Button variant="outline" onClick={handleAnalyze} className="w-full bg-transparent" disabled={isAnalyzing}>
              <Brain className="mr-2 h-4 w-4" />
              Re-analyze
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
