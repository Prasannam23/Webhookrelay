import axios from "axios"
import type { ProjectData } from "@/redux/actions/projectActions"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"

const projectApi = axios.create({
  baseURL: `${API_BASE_URL}/projects`,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add token to requests if available
projectApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const createProject = async (
  projectData: Omit<ProjectData, "id" | "createdAt" | "updatedAt" | "imageCount">,
): Promise<ProjectData> => {
  const response = await projectApi.post("/", projectData)
  return response.data
}

export const fetchProjects = async (): Promise<ProjectData[]> => {
  const response = await projectApi.get("/")
  return response.data
}

export const fetchProjectById = async (projectId: string): Promise<ProjectData> => {
  const response = await projectApi.get(`/${projectId}`)
  return response.data
}

export const updateProject = async (projectId: string, projectData: Partial<ProjectData>): Promise<ProjectData> => {
  const response = await projectApi.put(`/${projectId}`, projectData)
  return response.data
}

export const deleteProject = async (projectId: string): Promise<void> => {
  await projectApi.delete(`/${projectId}`)
}

export const addProjectMember = async (projectId: string, userId: string): Promise<ProjectData> => {
  const response = await projectApi.post(`/${projectId}/members`, { userId })
  return response.data
}

export const removeProjectMember = async (projectId: string, userId: string): Promise<ProjectData> => {
  const response = await projectApi.delete(`/${projectId}/members/${userId}`)
  return response.data
}

export default projectApi
