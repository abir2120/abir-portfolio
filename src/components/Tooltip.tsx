/**
 * Tooltip Component
 * Appears on floor hover, follows cursor position
 * Features gradient background and section name
 */

import { motion } from 'framer-motion'
import { FLOORS } from '../App'

interface TooltipProps {
  floorIndex: number
  position: { x: number; y: number }
}

export default function Tooltip({ floorIndex, position }: TooltipProps) {
  const floor = FLOORS.find(f => f.floor === floorIndex)
  if (!floor) return null

  return (
    <motion.div
      className="fixed z-30 pointer-events-none"
      style={{ left: position.x + 20, top: position.y - 20 }}
      initial={{ opacity: 0, x: 10, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 10, scale: 0.95 }}
      transition={{ duration: 0.15 }}
    >
      <div className="relative">
        {/* Gradient background tooltip */}
        <div className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#c9a96e] via-[#d4b87a] to-[#8b7340] shadow-lg shadow-accent/20">
          <div className="flex items-center gap-2.5">
            <span className="text-base">{floor.icon}</span>
            <div>
              <p className="text-sm font-semibold text-bg-dark tracking-wide">
                {floor.label}
              </p>
              <p className="text-[9px] font-mono text-bg-dark/60 tracking-wider uppercase">
                Floor {floor.floor + 1}
              </p>
            </div>
          </div>
        </div>
        {/* Arrow */}
        <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#c9a96e]" />
      </div>
    </motion.div>
  )
}
