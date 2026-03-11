"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="mx-auto max-w-[960px] rounded-2xl border border-border bg-background/80 shadow-sm backdrop-blur-sm">
        <div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="/images/logo.png" 
              alt="PathTwoFI" 
              className="h-7 w-7 sm:h-8 sm:w-8 object-contain"
            />
            <span className="text-base sm:text-lg font-semibold">PathTwoFI</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/blog"
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              Blog
            </Link>
            <Link
              href="/wealthboard"
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              Wealthboard
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              About
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-border">
            <div className="flex flex-col space-y-1 px-4 py-3">
              <Link
                href="/blog"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground py-2 px-2 rounded-lg hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/wealthboard"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground py-2 px-2 rounded-lg hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                Wealthboard
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground py-2 px-2 rounded-lg hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
