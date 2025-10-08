"use client";

import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="fixed top-0 left-0 w-full flex justify-center items-center h-[150px] z-50">
      <nav className="h-[50px] w-full max-w-[900px] flex justify-between items-center px-10 rounded-[30px] bg-[rgba(255,255,255,0.2)] backdrop-blur-md">
        {/* LOGO */}
        <div className="flex items-center">
          <Image
            src="/logo-matbrew.png"
            alt="Matbrew Logo"
            width={245.8}
            height={20}
            className="h-[20px] w-auto object-contain"
            priority
          />
        </div>

        {/* MENU ITEMS */}
        <ul className="flex items-center justify-center gap-8 h-[27px]">
          <li>
            <Link
              href="#home"
              className="text-white text-[16px] font-poppins leading-[27px]"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="#about"
              className="text-white text-[16px] font-poppins leading-[27px]"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="#contact"
              className="text-white text-[16px] font-poppins leading-[27px]"
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* GITHUB LOGO */}
        <div className="flex items-center justify-center w-[37px]">
          <Link href="https://github.com/matinrusydan" target="_blank" aria-label="GitHub">
            <Image
              src="/github-logo.svg"
              alt="GitHub Logo"
              width={37}
              height={37}
              className="w-[37px] h-auto object-contain"
            />
          </Link>
        </div>
      </nav>
    </header>
  );
}
