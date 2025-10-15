import type React from "react"
import CardNav from "../../components/CardNav"

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const navItems = [
    {
      label: "Home",
      bgColor: "#170D27",
      textColor: "#FFFFFF",
      links: [{ label: "Go to Home", href: "#home", ariaLabel: "Navigate to Home section" }],
    },
    {
      label: "About",
      bgColor: "#271E37",
      textColor: "#FFFFFF",
      links: [{ label: "About Me", href: "#about", ariaLabel: "Navigate to About section" }],
    },
    {
      label: "Projects",
      bgColor: "#1A1A2E",
      textColor: "#FFFFFF",
      links: [{ label: "View Projects", href: "/projects", ariaLabel: "Navigate to Projects page" }],
    },
    {
      label: "Card Demo",
      bgColor: "#16213E",
      textColor: "#FFFFFF",
      links: [{ label: "Card Swap Demo", href: "/card-swap-demo", ariaLabel: "Navigate to Card Swap Demo page" }],
    },
    {
      label: "Contact",
      bgColor: "#0D0716",
      textColor: "#FFFFFF",
      links: [{ label: "Contact Me", href: "#contact", ariaLabel: "Navigate to Contact section" }],
    },
  ]

  return (
    <>
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
      {children}
    </>
  )
}