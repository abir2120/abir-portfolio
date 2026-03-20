/**
 * Mobile Navigation Component
 * Bottom tab bar for mobile devices
 * Shows floor sections as tappable icons
 */

import { FLOORS } from '../App'
import type { FloorId } from '../App'

interface MobileNavProps {
  activeSection: FloorId | null
  onSectionClick: (id: FloorId) => void
  onClose: () => void
}

export default function MobileNav({ activeSection, onSectionClick }: MobileNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 lg:hidden">
      <div className="glass rounded-t-2xl px-2 py-3 mx-2 mb-0">
        <div className="flex items-center justify-around">
          {[...FLOORS].reverse().map((floor) => (
            <button
              key={floor.id}
              onClick={() => onSectionClick(floor.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeSection === floor.id
                  ? 'bg-accent/15 text-accent'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <span className="text-lg">{floor.icon}</span>
              <span className="text-[8px] font-mono tracking-wider uppercase">
                {floor.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
