"use client"

import type React from "react"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import type { RootState } from "@/redux/store"
import { loadUser } from "@/api/authApi"
import { loadUserRequest, loadUserSuccess, loadUserFailure } from "@/redux/actions/authActions"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const dispatch = useDispatch()
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token && !user) {
      // Try to load user from token
      dispatch(loadUserRequest())
      loadUser()
        .then((userData) => {
          dispatch(loadUserSuccess(userData))
        })
        .catch(() => {
          dispatch(loadUserFailure("Failed to load user"))
          localStorage.removeItem("token")
          if (requireAuth) {
            router.push("/login")
          }
        })
    } else if (!token && requireAuth) {
      router.push("/login")
    }
  }, [dispatch, router, user, requireAuth])

  if (requireAuth && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) {
    return null // Will redirect to login
  }

  return <>{children}</>
}
