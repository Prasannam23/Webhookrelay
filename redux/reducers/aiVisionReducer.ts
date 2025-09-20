import {
  AI_VISION_ANALYZE_REQUEST,
  AI_VISION_ANALYZE_SUCCESS,
  AI_VISION_ANALYZE_FAILURE,
  AI_VISION_CLEAR_ANALYSIS,
  type AIAnalysis,
} from "../actions/aiVisionActions"

interface AIVisionState {
  currentAnalysis: AIAnalysis | null
  isAnalyzing: boolean
  error: string | null
}

const initialState: AIVisionState = {
  currentAnalysis: null,
  isAnalyzing: false,
  error: null,
}

const aiVisionReducer = (state = initialState, action: any): AIVisionState => {
  switch (action.type) {
    case AI_VISION_ANALYZE_REQUEST:
      return {
        ...state,
        isAnalyzing: true,
        error: null,
      }

    case AI_VISION_ANALYZE_SUCCESS:
      return {
        ...state,
        isAnalyzing: false,
        currentAnalysis: action.payload,
        error: null,
      }

    case AI_VISION_ANALYZE_FAILURE:
      return {
        ...state,
        isAnalyzing: false,
        error: action.payload,
      }

    case AI_VISION_CLEAR_ANALYSIS:
      return {
        ...state,
        currentAnalysis: null,
        error: null,
      }

    default:
      return state
  }
}

export default aiVisionReducer
