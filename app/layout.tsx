import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { Background } from "../components/Background"
import { Toaster } from 'react-hot-toast'
import { resolveBaseUrl } from "../lib/resolve-base-url"

// Log BASE_URL on app start
console.log("🌐 Active BASE_URL:", resolveBaseUrl());

export const metadata: Metadata = {
  title: "Matin Rusydan",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`relative bg-black overflow-visible font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Background />
        <Suspense fallback={null}>
          {children}
          <Analytics />
          <Toaster />
        </Suspense>
      </body>
    </html>
  )
}
