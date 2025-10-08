"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

export function Header() {
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 rounded-full mx-36 flex-row leading-3 tracking-normal bg-muted-foreground opacity-75 text-background",
        "px-4 md:px-9 h-10",
        "flex items-center justify-between",
        // translucent top bar for subtle separation
        "backdrop-blur-[2px]",
      )}
      aria-label="Primary"
    >
      {/* Branding */}
      <Link
        href="#"
        className="font-semibold tracking-wide text-sm md:text-base text-primary/90 hover:text-primary transition-colors"
        aria-label="Matbrewdev Home"
      >
        {/* Choose either label freely */}
        <span className="sr-only">MATBREWDEV</span>
        <span aria-hidden className="select-none text-primary">
          MATBREW
        </span>
      </Link>

      {/* Navigation */}
      <nav>
        <ul className="flex items-center gap-5 md:gap-8 text-sm text-muted-foreground">
          <li>
            <Link href="#" className="hover:text-foreground transition-colors text-primary">
              Home
            </Link>
          </li>
          <li>
            <Link href="#projects" className="hover:text-foreground transition-colors text-primary">
              Projects
            </Link>
          </li>
          <li>
            <Link href="#certificates" className="hover:text-foreground transition-colors text-primary">
              Certificates
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
