import { cn } from "@/lib/utils"

interface CynthiaMoviesLogoProps {
  className?: string
}

export function CynthiaMoviesLogo({ className }: CynthiaMoviesLogoProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("text-primary", className)}>
      {/* Film reel outer circle */}
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" fill="none" />

      {/* Film reel holes */}
      <circle cx="20" cy="20" r="3" fill="currentColor" />
      <circle cx="20" cy="8" r="2" fill="currentColor" />
      <circle cx="32" cy="20" r="2" fill="currentColor" />
      <circle cx="20" cy="32" r="2" fill="currentColor" />
      <circle cx="8" cy="20" r="2" fill="currentColor" />
      <circle cx="28.28" cy="11.72" r="1.5" fill="currentColor" />
      <circle cx="28.28" cy="28.28" r="1.5" fill="currentColor" />
      <circle cx="11.72" cy="28.28" r="1.5" fill="currentColor" />
      <circle cx="11.72" cy="11.72" r="1.5" fill="currentColor" />

      {/* Letter C overlay */}
      <path
        d="M25 14C23.5 12.5 21.5 12 20 12C16.5 12 14 14.5 14 18V22C14 25.5 16.5 28 20 28C21.5 28 23.5 27.5 25 26"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
