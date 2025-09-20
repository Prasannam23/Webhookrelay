import axios from "axios"
import type { LoginCredentials, RegisterCredentials, User } from "@/redux/actions/authActions"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"

const authApi = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add token to requests if available
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const login = async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
  const response = await authApi.post("/login", credentials)
  return response.data
}

export const register = async (credentials: RegisterCredentials): Promise<{ user: User; token: string }> => {
  const response = await authApi.post("/register", credentials)
  return response.data
}

export const loadUser = async (): Promise<User> => {
  const response = await authApi.get("/me")
  return response.data
}

export const updateProfile = async (userData: Partial<User>): Promise<User> => {
  const response = await authApi.put("/profile", userData)
  return response.data
}

export default authApi
