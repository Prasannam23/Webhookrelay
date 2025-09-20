export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const supportedFormats = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]

  if (!supportedFormats.includes(file.type)) {
    return {
      isValid: false,
      error: "Unsupported file format. Please use JPG, PNG, GIF, or WebP.",
    }
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "File size too large. Maximum size is 10MB.",
    }
  }

  return { isValid: true }
}

export const validateProjectName = (name: string): boolean => {
  return name.trim().length >= 3 && name.trim().length <= 50
}
