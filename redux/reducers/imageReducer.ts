import {
  IMAGE_UPLOAD_REQUEST,
  IMAGE_UPLOAD_SUCCESS,
  IMAGE_UPLOAD_FAILURE,
  IMAGE_FETCH_REQUEST,
  IMAGE_FETCH_SUCCESS,
  IMAGE_FETCH_FAILURE,
  IMAGE_DELETE_REQUEST,
  IMAGE_DELETE_SUCCESS,
  IMAGE_DELETE_FAILURE,
  type ImageData,
} from "../actions/imageActions"

interface ImageState {
  images: ImageData[]
  currentImage: ImageData | null
  isLoading: boolean
  error: string | null
}

const initialState: ImageState = {
  images: [],
  currentImage: null,
  isLoading: false,
  error: null,
}

const imageReducer = (state = initialState, action: any): ImageState => {
  switch (action.type) {
    case IMAGE_UPLOAD_REQUEST:
    case IMAGE_FETCH_REQUEST:
    case IMAGE_DELETE_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }

    case IMAGE_UPLOAD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        images: [action.payload, ...state.images],
        error: null,
      }

    case IMAGE_FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        images: action.payload,
        error: null,
      }

    case IMAGE_DELETE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        images: state.images.filter((img) => img.id !== action.payload),
        error: null,
      }

    case IMAGE_UPLOAD_FAILURE:
    case IMAGE_FETCH_FAILURE:
    case IMAGE_DELETE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      }

    default:
      return state
  }
}

export default imageReducer
