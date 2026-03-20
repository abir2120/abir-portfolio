/**
 * Popup Panel Component
 * Glassmorphism modal that slides in from the right
 * Contains section content with close button
 */

import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface PopupPanelProps {
  title: string
  icon: string
  onClose: () => void
  children: ReactNode
}

export default function PopupPanel({ title, icon, onClose, children }: PopupPanelProps) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        className="fixed z-40 top-4 bottom-4 right-4 w-[calc(100%-2rem)] sm:w-[480px] lg:w-[560px] glass rounded-2xl glow-accent overflow-hidden flex flex-col"
        initial={{ opacity: 0, x: 80, scale: 0.97 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 80, scale: 0.97 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-glass-border">
          <div className="flex items-center gap-3">
            <span className="text-xl">{icon}</span>
            <div>
              <h2 className="text-lg font-semibold tracking-wider text-text-primary">
                {title}
              </h2>
              <div className="w-8 h-0.5 bg-accent mt-1 rounded-full" />
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-glass-hover flex items-center justify-center hover:bg-accent/20 transition-colors cursor-pointer group"
          >
            <X size={16} className="text-text-secondary group-hover:text-accent transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>

        {/* Footer accent line */}
        <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      </motion.div>
    </>
  )
}
