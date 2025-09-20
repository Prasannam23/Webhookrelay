import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ReduxProvider } from "@/redux/provider"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "DesignSync - Design Feedback Platform",
  description: "Collaborate on designs with AI-powered feedback and team collaboration",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ReduxProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </ReduxProvider>
        <Analytics />
      </body>
    </html>
  )
}
