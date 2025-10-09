"use client";

import CardNav from './CardNav';

export function Header() {
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
    <header className="absolute top-0 left-0 w-full z-10 bg-transparent backdrop-blur-sm overflow-visible">
      <CardNav
        logo="/logo-matbrew.png"
        logoAlt="Matbrew Logo"
        items={navItems}
        githubUrl="https://github.com/matinrusydan"
        githubLogo="/github-logo.svg"
        baseColor="rgba(20, 20, 20, 0.5)" // Warna dasar semi-transparan
        menuColor="#FFFFFF"
      />
    </header>
  );
}
