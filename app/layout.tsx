import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import LightRays from "@/components/LightRays"
import CardNav from "@/components/CardNav"

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
  // Definisikan item menu sesuai dengan struktur CardNav
  const navItems = [
    {
      label: "Home",
      bgColor: "#170D27", // Warna gelap untuk kontras
      textColor: "#FFFFFF",
      links: [
        { label: "Go to Home", href: "#home", ariaLabel: "Navigate to Home section" },
      ]
    },
    {
      label: "About",
      bgColor: "#271E37",
      textColor: "#FFFFFF",
      links: [
        { label: "About Me", href: "#about", ariaLabel: "Navigate to About section" },
      ]
    },
    {
      label: "Contact",
      bgColor: "#0D0716",
      textColor: "#FFFFFF",
      links: [
        { label: "Contact Me", href: "#contact", ariaLabel: "Navigate to Contact section" },
      ]
    }
  ];

  return (
    <html lang="en" className="dark">
      <body className={`relative bg-black overflow-visible font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <div className="fixed inset-0 -z-10 pointer-events-none translate-y-0 sm:translate-y-8 md:translate-y-0">
          <LightRays />
        </div>
        <div className="fixed top-0 left-0 w-full z-[100] flex justify-center">
          <CardNav
            logo="/logo-matbrew.png"
            logoAlt="Matbrew Logo"
            items={navItems}
            githubUrl="https://github.com/matinrusydan"
            githubLogo="/github-logo.svg"
            baseColor="transparent"
            menuColor="#FFFFFF"
          />
        </div>
        <Suspense fallback={null}>
          {children}
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
