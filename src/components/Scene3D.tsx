/**
 * 3D Scene Component
 * Renders the interactive building using Three.js via React Three Fiber
 * 
 * Features:
 * - Procedural multi-floor building model
 * - Interactive floor hover/click
 * - Ambient particles and lighting
 * - Auto-rotation with orbit controls
 * - Ground plane with grid
 */

import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Environment, Float } from '@react-three/drei'
import * as THREE from 'three'
import { FLOORS } from '../App'
import type { FloorId } from '../App'

interface Scene3DProps {
  onFloorHover: (floorIndex: number | null, event?: { clientX: number; clientY: number }) => void
  onFloorClick: (floorIndex: number) => void
  hoveredFloor: number | null
  activeSection: FloorId | null
  onLoaded: () => void
}

/* ==========================================
   BUILDING FLOOR COMPONENT
   Each floor is an interactive 3D mesh
   ========================================== */

interface FloorMeshProps {
  index: number
  totalFloors: number
  hovered: boolean
  active: boolean
  onHover: (index: number | null, event?: { clientX: number; clientY: number }) => void
  onClick: (index: number) => void
}

function FloorMesh({ index, totalFloors, hovered, active, onHover, onClick }: FloorMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const [animProgress, setAnimProgress] = useState(0)

  // Floor dimensions - slightly different widths for visual interest
  const floorHeight = 0.8
  const gap = 0.12
  const baseWidth = 2.4
  const baseDepth = 2.0
  // Taper slightly toward top
  const widthScale = 1 - (index / totalFloors) * 0.12
  const width = baseWidth * widthScale
  const depth = baseDepth * widthScale
  const y = index * (floorHeight + gap) - ((totalFloors - 1) * (floorHeight + gap)) / 2

  // Colors based on floor section
  const floorData = FLOORS.find(f => f.floor === index)
  const baseColor = useMemo(() => {
    const colors = ['#1a2744', '#1d2b4a', '#1f2f50', '#222f4d', '#253354']
    return new THREE.Color(colors[index % colors.length])
  }, [index])

  const accentColor = useMemo(() => new THREE.Color('#c9a96e'), [])

  useFrame((_, delta) => {
    if (!meshRef.current) return

    // Hover animation
    const targetProgress = hovered || active ? 1 : 0
    setAnimProgress(prev => THREE.MathUtils.lerp(prev, targetProgress, delta * 8))

    // Scale on hover
    const scale = 1 + animProgress * 0.06
    meshRef.current.scale.set(scale, 1, scale)

    // Slight glow offset
    if (glowRef.current) {
      glowRef.current.scale.set(1 + animProgress * 0.15, 1 + animProgress * 0.05, 1 + animProgress * 0.15)
      const mat = glowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = animProgress * 0.3
    }

    // Color interpolation
    const mat = meshRef.current.material as THREE.MeshStandardMaterial
    mat.color.copy(baseColor).lerp(accentColor, animProgress * 0.4)
    mat.emissive.copy(accentColor)
    mat.emissiveIntensity = animProgress * 0.3
  })

  return (
    <group position={[0, y, 0]}>
      {/* Main floor mesh */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
          onHover(index, { clientX: e.clientX, clientY: e.clientY })
        }}
        onPointerMove={(e: ThreeEvent<PointerEvent>) => {
          onHover(index, { clientX: e.clientX, clientY: e.clientY })
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default'
          onHover(null)
        }}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation()
          onClick(index)
        }}
      >
        <boxGeometry args={[width, floorHeight, depth]} />
        <meshStandardMaterial
          color={baseColor}
          roughness={0.3}
          metalness={0.6}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Glow outline */}
      <mesh ref={glowRef}>
        <boxGeometry args={[width + 0.02, floorHeight + 0.02, depth + 0.02]} />
        <meshBasicMaterial
          color="#c9a96e"
          transparent
          opacity={0}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Window lines - horizontal */}
      {[...Array(3)].map((_, i) => (
        <mesh key={`wh-${i}`} position={[0, -0.15 + i * 0.15, depth / 2 + 0.005]}>
          <planeGeometry args={[width * 0.85, 0.02]} />
          <meshBasicMaterial color="#c9a96e" transparent opacity={0.15 + animProgress * 0.2} />
        </mesh>
      ))}

      {/* Window lines - vertical */}
      {[...Array(5)].map((_, i) => (
        <mesh key={`wv-${i}`} position={[-width * 0.35 + i * (width * 0.7 / 4), 0, depth / 2 + 0.005]}>
          <planeGeometry args={[0.02, floorHeight * 0.7]} />
          <meshBasicMaterial color="#c9a96e" transparent opacity={0.1 + animProgress * 0.15} />
        </mesh>
      ))}

      {/* Side window lines */}
      {[...Array(3)].map((_, i) => (
        <mesh key={`sw-${i}`} position={[width / 2 + 0.005, -0.15 + i * 0.15, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[depth * 0.85, 0.02]} />
          <meshBasicMaterial color="#c9a96e" transparent opacity={0.12 + animProgress * 0.15} />
        </mesh>
      ))}

      {/* Floor label indicator (small glowing dot) */}
      {floorData && (
        <mesh position={[width / 2 + 0.15, 0, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#c9a96e" transparent opacity={0.4 + animProgress * 0.6} />
        </mesh>
      )}

      {/* Edge highlight lines */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(width, floorHeight, depth)]} />
        <lineBasicMaterial color="#c9a96e" transparent opacity={0.08 + animProgress * 0.25} />
      </lineSegments>
    </group>
  )
}

/* ==========================================
   BUILDING ANTENNA / SPIRE
   ========================================== */

function BuildingSpire({ totalFloors }: { totalFloors: number }) {
  const floorHeight = 0.8
  const gap = 0.12
  const topY = (totalFloors - 1) * (floorHeight + gap) - ((totalFloors - 1) * (floorHeight + gap)) / 2 + floorHeight / 2

  return (
    <group position={[0, topY, 0]}>
      {/* Spire */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.02, 0.08, 1.4, 8]} />
        <meshStandardMaterial color="#c9a96e" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Beacon light */}
      <mesh position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#c9a96e" />
      </mesh>
      <pointLight position={[0, 1.55, 0]} color="#c9a96e" intensity={2} distance={4} />
    </group>
  )
}

/* ==========================================
   GROUND PLANE
   ========================================== */

function GroundPlane() {
  return (
    <group position={[0, -2.8, 0]}>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color="#0a0e17"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Grid lines */}
      <gridHelper
        args={[30, 30, '#c9a96e', '#1a2744']}
        position={[0, 0.01, 0]}
        material-transparent
        material-opacity={0.15}
      />
    </group>
  )
}

/* ==========================================
   FLOATING PARTICLES
   ========================================== */

function Particles() {
  const particlesRef = useRef<THREE.Points>(null)
  const count = 200

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return pos
  }, [])

  useFrame((state) => {
    if (!particlesRef.current) return
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02
    const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      posArray[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.001
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#c9a96e"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  )
}

/* ==========================================
   SCENE SETUP & CAMERA
   ========================================== */

function SceneSetup({ onLoaded }: { onLoaded: () => void }) {
  const { scene } = useThree()
  
  useEffect(() => {
    scene.fog = new THREE.FogExp2('#0a0e17', 0.04)
    // Signal loaded after a brief delay for scene to render
    const timer = setTimeout(onLoaded, 1500)
    return () => clearTimeout(timer)
  }, [scene, onLoaded])

  return null
}

/* ==========================================
   MAIN SCENE EXPORT
   ========================================== */

export default function Scene3D({ onFloorHover, onFloorClick, hoveredFloor, activeSection, onLoaded }: Scene3DProps) {
  const totalFloors = FLOORS.length

  return (
    <Canvas
      camera={{ position: [5, 2, 5], fov: 45 }}
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <SceneSetup onLoaded={onLoaded} />

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={20}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <directionalLight position={[-3, 4, -3]} intensity={0.3} color="#4a6fa5" />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#c9a96e" distance={12} />

      {/* Building */}
      <Float speed={0.8} rotationIntensity={0.02} floatIntensity={0.1}>
        <group>
          {FLOORS.map((floor) => (
            <FloorMesh
              key={floor.id}
              index={floor.floor}
              totalFloors={totalFloors}
              hovered={hoveredFloor === floor.floor}
              active={activeSection === floor.id}
              onHover={onFloorHover}
              onClick={onFloorClick}
            />
          ))}
          <BuildingSpire totalFloors={totalFloors} />
        </group>
      </Float>

      {/* Ground */}
      <GroundPlane />

      {/* Particles */}
      <Particles />

      {/* Controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={4}
        maxDistance={12}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.45}
        autoRotate
        autoRotateSpeed={0.3}
        target={[0, 0.5, 0]}
      />

      {/* Environment for reflections */}
      <Environment preset="night" />
    </Canvas>
  )
}
