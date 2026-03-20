/**
 * Header Component
 * Displays the M A logo and navigation branding
 * Fixed position at top of viewport
 * 
 * ✅ Now reads from portfolioData store
 */

import { motion } from 'framer-motion'
import { usePortfolioStore } from '../lib/usePortfolioStore'

export default function Header() {
  const profile = usePortfolioStore((s) => s.data.profile)

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 lg:px-10 lg:py-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg overflow-hidden border border-glass-border bg-glass flex items-center justify-center">
          <img
            src={profile.logoUrl}
            alt={`${profile.initials} Logo`}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              target.parentElement!.innerHTML = `<span class="text-accent font-semibold text-sm tracking-widest">${profile.initials}</span>`
            }}
          />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-sm font-semibold tracking-[0.35em] text-text-primary uppercase leading-none">
            {profile.fullName}
          </h1>
          <p className="text-[9px] font-mono tracking-[0.25em] text-text-muted uppercase mt-1">
            {profile.title}
          </p>
        </div>
      </div>

      {/* Right side - minimal info */}
      <div className="hidden md:flex items-center gap-6">
        <span className="text-[10px] font-mono tracking-[0.3em] text-text-muted uppercase">
          {profile.headerTagline1}
        </span>
        <div className="w-px h-4 bg-glass-border" />
        <span className="text-[10px] font-mono tracking-[0.3em] text-text-muted uppercase">
          {profile.headerTagline2}
        </span>
      </div>
    </motion.header>
  )
}
