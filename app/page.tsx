"use client"

import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { RootState } from "@/redux/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Eye, MessageSquare, Zap, Users, Palette, Brain } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const features = [
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Visual Feedback",
      description: "Add contextual feedback directly on designs with precise positioning",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Real-time Collaboration",
      description: "Collaborate with your team in real-time with instant notifications",
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI-Powered Analysis",
      description: "Get intelligent design suggestions and automated feedback",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Team Management",
      description: "Organize projects and manage team access with role-based permissions",
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Design Systems",
      description: "Maintain consistency across projects with shared design systems",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Fast Iterations",
      description: "Speed up your design process with streamlined feedback loops",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-8">
            <Badge variant="secondary" className="px-4 py-2">
              The complete platform for design feedback
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold text-balance">
              Collaborate on designs with <span className="text-primary">AI-powered feedback</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Your team's toolkit to stop configuring and start innovating. Securely build, deploy, and scale the best
              design experiences with DesignSync.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/register">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Make teamwork seamless</h2>
          <p className="text-xl text-muted-foreground">
            Tools for your team and stakeholders to share feedback and iterate faster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 hover:border-border transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">{feature.icon}</div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-card border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-8">
            <h2 className="text-4xl font-bold text-balance">Faster iteration. More innovation.</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              The platform for rapid progress. Let your team focus on shipping features instead of managing
              infrastructure with automated CI/CD, built-in testing, and integrated collaboration.
            </p>
            <Button size="lg" asChild>
              <Link href="/register">
                Start Building Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
