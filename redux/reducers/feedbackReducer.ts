import {
  FEEDBACK_CREATE_REQUEST,
  FEEDBACK_CREATE_SUCCESS,
  FEEDBACK_CREATE_FAILURE,
  FEEDBACK_FETCH_REQUEST,
  FEEDBACK_FETCH_SUCCESS,
  FEEDBACK_FETCH_FAILURE,
  FEEDBACK_UPDATE_REQUEST,
  FEEDBACK_UPDATE_SUCCESS,
  FEEDBACK_UPDATE_FAILURE,
  FEEDBACK_DELETE_REQUEST,
  FEEDBACK_DELETE_SUCCESS,
  FEEDBACK_DELETE_FAILURE,
  type FeedbackData,
} from "../actions/feedbackActions"

interface FeedbackState {
  feedback: FeedbackData[]
  isLoading: boolean
  error: string | null
}

const initialState: FeedbackState = {
  feedback: [],
  isLoading: false,
  error: null,
}

const feedbackReducer = (state = initialState, action: any): FeedbackState => {
  switch (action.type) {
    case FEEDBACK_CREATE_REQUEST:
    case FEEDBACK_FETCH_REQUEST:
    case FEEDBACK_UPDATE_REQUEST:
    case FEEDBACK_DELETE_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }

    case FEEDBACK_CREATE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        feedback: [action.payload, ...state.feedback],
        error: null,
      }

    case FEEDBACK_FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        feedback: action.payload,
        error: null,
      }

    case FEEDBACK_UPDATE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        feedback: state.feedback.map((item) => (item.id === action.payload.id ? action.payload : item)),
        error: null,
      }

    case FEEDBACK_DELETE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        feedback: state.feedback.filter((item) => item.id !== action.payload),
        error: null,
      }

    case FEEDBACK_CREATE_FAILURE:
    case FEEDBACK_FETCH_FAILURE:
    case FEEDBACK_UPDATE_FAILURE:
    case FEEDBACK_DELETE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      }

    default:
      return state
  }
}

export default feedbackReducer
