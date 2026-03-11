"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Gradient Background with Mountain Motif */}
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.97_0.02_155)] via-[oklch(0.95_0.015_165)] to-[oklch(0.92_0.025_145)]">
        {/* Subtle Mountain/Path SVG Pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.08]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M0,400 Q200,300 400,350 T800,300 L1200,250 L1200,800 L0,800 Z"
            fill="currentColor"
            className="text-primary"
          />
          <path
            d="M0,500 Q300,400 600,450 T1200,400 L1200,800 L0,800 Z"
            fill="currentColor"
            className="text-primary/50"
          />
        </svg>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 text-center">
        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight text-foreground mb-4 sm:mb-6 text-balance leading-tight">
          Charting Our Path to <span className="font-normal text-primary">Financial Independence</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground font-light leading-relaxed max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12 text-pretty px-2">
          A personal blog documenting our journey to freedom — tracking, learning, and building wealth together.
        </p>

        {/* CTA Button */}
        <Button
          size="lg"
          className="group bg-primary hover:bg-primary/90 text-primary-foreground font-normal text-sm sm:text-base md:text-lg px-6 py-5 sm:px-8 sm:py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Follow along
          <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

      {/* Subtle Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
