export const AI_VISION_ANALYZE_REQUEST = "AI_VISION_ANALYZE_REQUEST"
export const AI_VISION_ANALYZE_SUCCESS = "AI_VISION_ANALYZE_SUCCESS"
export const AI_VISION_ANALYZE_FAILURE = "AI_VISION_ANALYZE_FAILURE"
export const AI_VISION_CLEAR_ANALYSIS = "AI_VISION_CLEAR_ANALYSIS"

export interface AIAnalysis {
  id: string
  imageId: string
  analysis: string
  suggestions: string[]
  confidence: number
  createdAt: string
}

export const analyzeImageRequest = () => ({ type: AI_VISION_ANALYZE_REQUEST })
export const analyzeImageSuccess = (analysis: AIAnalysis) => ({
  type: AI_VISION_ANALYZE_SUCCESS,
  payload: analysis,
})
export const analyzeImageFailure = (error: string) => ({
  type: AI_VISION_ANALYZE_FAILURE,
  payload: error,
})
export const clearAnalysis = () => ({ type: AI_VISION_CLEAR_ANALYSIS })
