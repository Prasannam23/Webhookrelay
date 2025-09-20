export const API_ENDPOINTS = {
  AUTH: "/auth",
  IMAGES: "/images",
  FEEDBACK: "/feedback",
  PROJECTS: "/projects",
  AI_VISION: "/ai-vision",
} as const

export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
} as const

export const IMAGE_FORMATS = {
  SUPPORTED: ["jpg", "jpeg", "png", "gif", "webp"],
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
} as const

export const PROJECT_STATUS = {
  ACTIVE: "active",
  ARCHIVED: "archived",
  COMPLETED: "completed",
} as const

export const FEEDBACK_TYPES = {
  GENERAL: "general",
  DESIGN: "design",
  TECHNICAL: "technical",
  CONTENT: "content",
} as const
