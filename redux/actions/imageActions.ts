export const IMAGE_UPLOAD_REQUEST = "IMAGE_UPLOAD_REQUEST"
export const IMAGE_UPLOAD_SUCCESS = "IMAGE_UPLOAD_SUCCESS"
export const IMAGE_UPLOAD_FAILURE = "IMAGE_UPLOAD_FAILURE"
export const IMAGE_FETCH_REQUEST = "IMAGE_FETCH_REQUEST"
export const IMAGE_FETCH_SUCCESS = "IMAGE_FETCH_SUCCESS"
export const IMAGE_FETCH_FAILURE = "IMAGE_FETCH_FAILURE"
export const IMAGE_DELETE_REQUEST = "IMAGE_DELETE_REQUEST"
export const IMAGE_DELETE_SUCCESS = "IMAGE_DELETE_SUCCESS"
export const IMAGE_DELETE_FAILURE = "IMAGE_DELETE_FAILURE"

export interface ImageData {
  id: string
  url: string
  title: string
  description?: string
  projectId: string
  uploadedBy: string
  createdAt: string
  metadata?: {
    width: number
    height: number
    size: number
    format: string
  }
}

export const uploadImageRequest = () => ({ type: IMAGE_UPLOAD_REQUEST })
export const uploadImageSuccess = (image: ImageData) => ({
  type: IMAGE_UPLOAD_SUCCESS,
  payload: image,
})
export const uploadImageFailure = (error: string) => ({
  type: IMAGE_UPLOAD_FAILURE,
  payload: error,
})

export const fetchImagesRequest = () => ({ type: IMAGE_FETCH_REQUEST })
export const fetchImagesSuccess = (images: ImageData[]) => ({
  type: IMAGE_FETCH_SUCCESS,
  payload: images,
})
export const fetchImagesFailure = (error: string) => ({
  type: IMAGE_FETCH_FAILURE,
  payload: error,
})

export const deleteImageRequest = () => ({ type: IMAGE_DELETE_REQUEST })
export const deleteImageSuccess = (imageId: string) => ({
  type: IMAGE_DELETE_SUCCESS,
  payload: imageId,
})
export const deleteImageFailure = (error: string) => ({
  type: IMAGE_DELETE_FAILURE,
  payload: error,
})
