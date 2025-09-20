import axios from "axios"
import type { ImageData } from "@/redux/actions/imageActions"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"

const imageApi = axios.create({
  baseURL: `${API_BASE_URL}/images`,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add token to requests if available
imageApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const uploadImage = async (formData: FormData): Promise<ImageData> => {
  const response = await imageApi.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
}

export const fetchImages = async (projectId?: string): Promise<ImageData[]> => {
  const url = projectId ? `?projectId=${projectId}` : ""
  const response = await imageApi.get(`/${url}`)
  return response.data
}

export const fetchImageById = async (imageId: string): Promise<ImageData> => {
  const response = await imageApi.get(`/${imageId}`)
  return response.data
}

export const deleteImage = async (imageId: string): Promise<void> => {
  await imageApi.delete(`/${imageId}`)
}

export const updateImageMetadata = async (imageId: string, metadata: Partial<ImageData>): Promise<ImageData> => {
  const response = await imageApi.put(`/${imageId}`, metadata)
  return response.data
}

export default imageApi
