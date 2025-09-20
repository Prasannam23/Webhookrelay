"use client"

import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import type { RootState } from "@/redux/store"
import { logout } from "@/redux/actions/authActions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { LogOut, Settings, User } from "lucide-react"

export default function ProfileCard() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { user } = useSelector((state: RootState) => state.auth)

  const handleLogout = () => {
    localStorage.removeItem("token")
    dispatch(logout())
    router.push("/login")
  }

  if (!user) return null

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{user.name}</h3>
            <p className="text-muted-foreground">{user.email}</p>
            <Badge variant="secondary">Active</Badge>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
