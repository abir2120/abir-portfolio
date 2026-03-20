/**
 * Main App Component
 * Interactive 3D Architectural Portfolio for Building Engineer "M A"
 * 
 * Architecture:
 * - Three.js 3D building scene with interactive floors
 * - Glassmorphism popup panels for each section
 * - Responsive design with mobile fallback
 */

import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import Scene3D from './components/Scene3D'
import Header from './components/Header'
import Tooltip from './components/Tooltip'
import PopupPanel from './components/PopupPanel'
import HomeContent from './sections/HomeContent'
import AboutContent from './sections/AboutContent'
import ProjectsContent from './sections/ProjectsContent'
import LearnContent from './sections/LearnContent'
import ContactContent from './sections/ContactContent'
import MobileNav from './components/MobileNav'
import LoadingScreen from './components/LoadingScreen'
import DataEditor from './components/DataEditor'

// Floor configuration - maps floor index to section data
export const FLOORS = [
  { id: 'contact', label: 'Contact', floor: 0, icon: '✉' },
  { id: 'learn', label: 'Learn', floor: 1, icon: '📄' },
  { id: 'projects', label: 'Projects', floor: 2, icon: '🏗' },
  { id: 'about', label: 'About', floor: 3, icon: '👤' },
  { id: 'home', label: 'Home', floor: 4, icon: '⌂' },
] as const

export type FloorId = typeof FLOORS[number]['id']

function App() {
  const [hoveredFloor, setHoveredFloor] = useState<number | null>(null)
  const [activeSection, setActiveSection] = useState<FloorId | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  const handleFloorHover = useCallback((floorIndex: number | null, event?: { clientX: number; clientY: number }) => {
    setHoveredFloor(floorIndex)
    if (event) {
      setTooltipPos({ x: event.clientX, y: event.clientY })
    }
  }, [])

  const handleFloorClick = useCallback((floorIndex: number) => {
    const floor = FLOORS.find(f => f.floor === floorIndex)
    if (floor) {
      setActiveSection(floor.id)
      setHoveredFloor(null)
    }
  }, [])

  const handleClose = useCallback(() => {
    setActiveSection(null)
  }, [])

  const renderContent = () => {
    switch (activeSection) {
      case 'home': return <HomeContent />
      case 'about': return <AboutContent />
      case 'projects': return <ProjectsContent />
      case 'learn': return <LearnContent />
      case 'contact': return <ContactContent />
      default: return null
    }
  }

  const activeSectionData = FLOORS.find(f => f.id === activeSection)

  return (
    <div className="relative w-full h-full overflow-hidden bg-bg-dark">
      {/* Loading Screen */}
      <AnimatePresence>
        {!isLoaded && <LoadingScreen />}
      </AnimatePresence>

      {/* Background gradient overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e17] via-[#0d1525] to-[#0a0e17]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#c9a96e]/5 to-transparent" />
      </div>

      {/* 3D Scene */}
      <div className="absolute inset-0 z-[1]">
        <Scene3D
          onFloorHover={handleFloorHover}
          onFloorClick={handleFloorClick}
          hoveredFloor={hoveredFloor}
          activeSection={activeSection}
          onLoaded={() => setIsLoaded(true)}
        />
      </div>

      {/* Header with Logo */}
      <Header />

      {/* Floor Navigation Labels (right side) */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 hidden lg:flex flex-col gap-3">
        {[...FLOORS].reverse().map((floor) => (
          <button
            key={floor.id}
            onClick={() => handleFloorClick(floor.floor)}
            className={`group flex items-center gap-3 transition-all duration-300 cursor-pointer ${
              activeSection === floor.id ? 'opacity-100' : 'opacity-50 hover:opacity-100'
            }`}
          >
            <span className="text-xs font-mono text-text-secondary group-hover:text-accent tracking-widest uppercase transition-colors">
              {floor.label}
            </span>
            <div className={`relative w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              activeSection === floor.id
                ? 'bg-accent scale-125 pulse-ring'
                : hoveredFloor === floor.floor
                  ? 'bg-accent-light scale-110'
                  : 'bg-text-muted group-hover:bg-accent/60'
            }`} />
          </button>
        ))}
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredFloor !== null && (
          <Tooltip
            floorIndex={hoveredFloor}
            position={tooltipPos}
          />
        )}
      </AnimatePresence>

      {/* Popup Panel */}
      <AnimatePresence>
        {activeSection && (
          <PopupPanel
            title={activeSectionData?.label || ''}
            icon={activeSectionData?.icon || ''}
            onClose={handleClose}
          >
            {renderContent()}
          </PopupPanel>
        )}
      </AnimatePresence>

      {/* Mobile Navigation */}
      <MobileNav
        activeSection={activeSection}
        onSectionClick={(id) => setActiveSection(id)}
        onClose={handleClose}
      />

      {/* Data Editor Panel (⚙ button bottom-left) */}
      <DataEditor />

      {/* Instruction hint */}
      {isLoaded && !activeSection && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden lg:block">
          <p className="text-text-muted text-xs font-mono tracking-[0.3em] uppercase animate-pulse">
            Click a floor to explore
          </p>
        </div>
      )}
    </div>
  )
}

export default App
