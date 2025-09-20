import axios from "axios"
import type { FeedbackData } from "@/redux/actions/feedbackActions"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"

const feedbackApi = axios.create({
  baseURL: `${API_BASE_URL}/feedback`,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add token to requests if available
feedbackApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const createFeedback = async (
  feedbackData: Omit<FeedbackData, "id" | "createdAt" | "updatedAt">,
): Promise<FeedbackData> => {
  const response = await feedbackApi.post("/", feedbackData)
  return response.data
}

export const fetchFeedback = async (imageId: string): Promise<FeedbackData[]> => {
  const response = await feedbackApi.get(`/image/${imageId}`)
  return response.data
}

export const updateFeedback = async (feedbackId: string, content: string): Promise<FeedbackData> => {
  const response = await feedbackApi.put(`/${feedbackId}`, { content })
  return response.data
}

export const deleteFeedback = async (feedbackId: string): Promise<void> => {
  await feedbackApi.delete(`/${feedbackId}`)
}

export default feedbackApi
