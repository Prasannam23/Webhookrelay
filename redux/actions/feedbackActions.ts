export const FEEDBACK_CREATE_REQUEST = "FEEDBACK_CREATE_REQUEST"
export const FEEDBACK_CREATE_SUCCESS = "FEEDBACK_CREATE_SUCCESS"
export const FEEDBACK_CREATE_FAILURE = "FEEDBACK_CREATE_FAILURE"
export const FEEDBACK_FETCH_REQUEST = "FEEDBACK_FETCH_REQUEST"
export const FEEDBACK_FETCH_SUCCESS = "FEEDBACK_FETCH_SUCCESS"
export const FEEDBACK_FETCH_FAILURE = "FEEDBACK_FETCH_FAILURE"
export const FEEDBACK_UPDATE_REQUEST = "FEEDBACK_UPDATE_REQUEST"
export const FEEDBACK_UPDATE_SUCCESS = "FEEDBACK_UPDATE_SUCCESS"
export const FEEDBACK_UPDATE_FAILURE = "FEEDBACK_UPDATE_FAILURE"
export const FEEDBACK_DELETE_REQUEST = "FEEDBACK_DELETE_REQUEST"
export const FEEDBACK_DELETE_SUCCESS = "FEEDBACK_DELETE_SUCCESS"
export const FEEDBACK_DELETE_FAILURE = "FEEDBACK_DELETE_FAILURE"

export interface FeedbackData {
  id: string
  imageId: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  position?: {
    x: number
    y: number
  }
  createdAt: string
  updatedAt: string
}

export const createFeedbackRequest = () => ({ type: FEEDBACK_CREATE_REQUEST })
export const createFeedbackSuccess = (feedback: FeedbackData) => ({
  type: FEEDBACK_CREATE_SUCCESS,
  payload: feedback,
})
export const createFeedbackFailure = (error: string) => ({
  type: FEEDBACK_CREATE_FAILURE,
  payload: error,
})

export const fetchFeedbackRequest = () => ({ type: FEEDBACK_FETCH_REQUEST })
export const fetchFeedbackSuccess = (feedback: FeedbackData[]) => ({
  type: FEEDBACK_FETCH_SUCCESS,
  payload: feedback,
})
export const fetchFeedbackFailure = (error: string) => ({
  type: FEEDBACK_FETCH_FAILURE,
  payload: error,
})

export const updateFeedbackRequest = () => ({ type: FEEDBACK_UPDATE_REQUEST })
export const updateFeedbackSuccess = (feedback: FeedbackData) => ({
  type: FEEDBACK_UPDATE_SUCCESS,
  payload: feedback,
})
export const updateFeedbackFailure = (error: string) => ({
  type: FEEDBACK_UPDATE_FAILURE,
  payload: error,
})

export const deleteFeedbackRequest = () => ({ type: FEEDBACK_DELETE_REQUEST })
export const deleteFeedbackSuccess = (feedbackId: string) => ({
  type: FEEDBACK_DELETE_SUCCESS,
  payload: feedbackId,
})
export const deleteFeedbackFailure = (error: string) => ({
  type: FEEDBACK_DELETE_FAILURE,
  payload: error,
})
