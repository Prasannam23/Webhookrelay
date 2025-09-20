import axios from "axios"
import type { AIAnalysis } from "@/redux/actions/aiVisionActions"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"

const aiVisionApi = axios.create({
  baseURL: `${API_BASE_URL}/ai-vision`,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add token to requests if available
aiVisionApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const analyzeImage = async (imageId: string, imageUrl: string): Promise<AIAnalysis> => {
  const response = await aiVisionApi.post("/analyze", { imageId, imageUrl })
  return response.data
}

export const analyzeScreenshot = async (imageFile: File): Promise<AIAnalysis> => {
  const formData = new FormData()
  formData.append("image", imageFile)

  const response = await aiVisionApi.post("/analyze-screenshot", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
}

export default aiVisionApi
