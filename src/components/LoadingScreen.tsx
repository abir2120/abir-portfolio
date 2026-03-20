/**
 * Loading Screen
 * Displayed while the 3D scene initializes
 * 
 * ✅ Now reads from portfolioData store
 */

import { motion } from 'framer-motion'
import { usePortfolioStore } from '../lib/usePortfolioStore'

export default function LoadingScreen() {
  const profile = usePortfolioStore((s) => s.data.profile)

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-dark"
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      {/* Animated architectural lines */}
      <div className="relative w-32 h-32 mb-8">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 border border-accent/30"
            style={{ width: `${60 + i * 15}%` }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: `${30 + i * 18}%`, opacity: 1 }}
            transition={{ duration: 0.8, delay: i * 0.15, ease: 'easeOut' }}
          />
        ))}
        <motion.div
          className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-accent rounded-full"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        />
      </div>

      {/* Logo text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <h1 className="text-2xl font-light tracking-[0.5em] text-accent mb-2">{profile.initials}</h1>
        <p className="text-[10px] font-mono tracking-[0.4em] text-text-muted uppercase">{profile.title}</p>
      </motion.div>

      {/* Loading bar */}
      <motion.div
        className="mt-12 w-48 h-px bg-glass-border overflow-hidden rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <motion.div
          className="h-full bg-accent"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, delay: 0.8, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  )
}
