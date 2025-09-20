"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/redux/store"
import { analyzeScreenshot } from "@/api/aiVisionApi"
import {
  analyzeImageRequest,
  analyzeImageSuccess,
  analyzeImageFailure,
  clearAnalysis,
} from "@/redux/actions/aiVisionActions"
import { validateImageFile } from "@/utils/validators"
import AuthGuard from "@/components/auth/AuthGuard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Camera, Brain, Sparkles, CheckCircle, AlertCircle, Loader2, Download } from "lucide-react"

export default function AIAnalysisPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [dragActive, setDragActive] = useState(false)
  const [validationError, setValidationError] = useState("")
  const [analysisProgress, setAnalysisProgress] = useState(0)

  const dispatch = useDispatch()
  const { currentAnalysis, isAnalyzing, error } = useSelector((state: RootState) => state.aiVision)

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    const validation = validateImageFile(file)

    if (!validation.isValid) {
      setValidationError(validation.error || "Invalid file")
      return
    }

    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
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

  const handleScreenshot = async () => {
    try {
      // Request screen capture
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" },
      })

      // Create video element to capture frame
      const video = document.createElement("video")
      video.srcObject = stream
      video.play()

      video.addEventListener("loadedmetadata", () => {
        // Create canvas to capture frame
        const canvas = document.createElement("canvas")
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext("2d")

        if (ctx) {
          ctx.drawImage(video, 0, 0)

          // Convert to blob
          canvas.toBlob((blob) => {
            if (blob) {
              const file = new File([blob], "screenshot.png", { type: "image/png" })
              setSelectedFile(file)
              setPreview(URL.createObjectURL(file))
              setValidationError("")
            }
          }, "image/png")
        }

        // Stop the stream
        stream.getTracks().forEach((track) => track.stop())
      })
    } catch (error) {
      setValidationError("Failed to capture screenshot. Please try uploading an image instead.")
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return

    dispatch(analyzeImageRequest())
    setAnalysisProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const analysis = await analyzeScreenshot(selectedFile)
      dispatch(analyzeImageSuccess(analysis))
      setAnalysisProgress(100)
    } catch (error: any) {
      dispatch(analyzeImageFailure(error.response?.data?.message || "Analysis failed"))
    } finally {
      clearInterval(progressInterval)
    }
  }

  const handleClear = () => {
    dispatch(clearAnalysis())
    setSelectedFile(null)
    setPreview("")
    setValidationError("")
    setAnalysisProgress(0)
    if (preview) {
      URL.revokeObjectURL(preview)
    }
  }

  const downloadReport = () => {
    if (!currentAnalysis) return

    const report = {
      analysis: currentAnalysis.analysis,
      suggestions: currentAnalysis.suggestions,
      confidence: currentAnalysis.confidence,
      timestamp: currentAnalysis.createdAt,
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `ai-analysis-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Brain className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">AI Design Analysis</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Get intelligent feedback on your designs with AI-powered analysis. Upload an image or capture a screenshot
              to receive detailed insights and suggestions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload or Capture
                  </CardTitle>
                  <CardDescription>Choose an image to analyze or capture a screenshot</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(error || validationError) && (
                    <Alert variant="destructive">
                      <AlertDescription>{error || validationError}</AlertDescription>
                    </Alert>
                  )}

                  <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upload">Upload Image</TabsTrigger>
                      <TabsTrigger value="screenshot">Screenshot</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="space-y-4">
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
                            Drop your design here, or{" "}
                            <label className="text-primary cursor-pointer hover:underline">
                              browse
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileSelect(e.target.files)}
                                disabled={isAnalyzing}
                              />
                            </label>
                          </p>
                          <p className="text-sm text-muted-foreground">Supports JPG, PNG, GIF, WebP up to 10MB</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="screenshot" className="space-y-4">
                      <div className="text-center p-8 border-2 border-dashed rounded-lg">
                        <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <div className="space-y-4">
                          <p className="text-lg font-medium">Capture a screenshot</p>
                          <p className="text-sm text-muted-foreground">
                            Click the button below to capture your screen and analyze any design
                          </p>
                          <Button onClick={handleScreenshot} disabled={isAnalyzing}>
                            <Camera className="mr-2 h-4 w-4" />
                            Capture Screenshot
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Preview */}
                  {preview && (
                    <div className="space-y-4">
                      <div className="relative">
                        <img
                          src={preview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-64 object-contain bg-muted rounded-lg"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleAnalyze} disabled={isAnalyzing} className="flex-1">
                          {isAnalyzing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Brain className="mr-2 h-4 w-4" />
                              Analyze Design
                            </>
                          )}
                        </Button>
                        <Button variant="outline" onClick={handleClear} disabled={isAnalyzing}>
                          Clear
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Analysis Progress */}
                  {isAnalyzing && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Analyzing design...</span>
                        <span className="text-sm text-muted-foreground">{analysisProgress}%</span>
                      </div>
                      <Progress value={analysisProgress} className="w-full" />
                      <p className="text-xs text-muted-foreground">
                        AI is examining your design for composition, color theory, typography, and usability
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {currentAnalysis ? (
                <>
                  {/* Analysis Overview */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5" />
                          Analysis Results
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            {Math.round(currentAnalysis.confidence * 100)}% Confidence
                          </Badge>
                          <Button variant="outline" size="sm" onClick={downloadReport}>
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-foreground">{currentAnalysis.analysis}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Suggestions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Suggestions ({currentAnalysis.suggestions.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {currentAnalysis.suggestions.map((suggestion, index) => (
                          <div key={index} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                            <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-primary">{index + 1}</span>
                            </div>
                            <p className="text-sm text-foreground">{suggestion}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Analysis Metadata */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Analysis Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Analyzed</span>
                          <p className="font-medium">
                            {new Date(currentAnalysis.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Confidence</span>
                          <p className="font-medium">{Math.round(currentAnalysis.confidence * 100)}%</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Analysis ID</span>
                          <p className="font-medium font-mono text-xs">{currentAnalysis.id}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Suggestions</span>
                          <p className="font-medium">{currentAnalysis.suggestions.length} items</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <Brain className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Ready for AI Analysis</h3>
                      <p className="text-muted-foreground">
                        Upload an image or capture a screenshot to get started with AI-powered design feedback
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5" />
                  Smart Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Advanced AI examines composition, color theory, typography, and visual hierarchy
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle className="h-5 w-5" />
                  Actionable Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get specific, actionable suggestions to improve your design's effectiveness
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Download className="h-5 w-5" />
                  Export Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Download analysis reports to share with your team or reference later
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
