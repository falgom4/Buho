import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Html } from '@react-three/drei'
import * as THREE from 'three'
import { Hotspot as HotspotType } from '../../types'
import { useTourStore } from '../../stores/tourStore'

interface HotspotProps {
  hotspot: HotspotType
}

const Hotspot: React.FC<HotspotProps> = ({ hotspot }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const navigateToScene = useTourStore(state => state.navigateToScene)

  // Animación de pulsación
  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      meshRef.current.scale.setScalar(hovered ? scale * 1.2 : scale)
    }
  })

  const handleClick = () => {
    if (hotspot.type === 'navigation' && hotspot.target) {
      navigateToScene(hotspot.target)
    } else if (hotspot.type === 'info') {
      setShowInfo(!showInfo)
    }
  }

  const getHotspotColor = () => {
    switch (hotspot.type) {
      case 'navigation': return '#4CAF50'
      case 'info': return '#2196F3'
      case 'route': return '#FF9800'
      default: return '#9E9E9E'
    }
  }

  const getHotspotIcon = () => {
    switch (hotspot.type) {
      case 'navigation': return '→'
      case 'info': return 'ℹ'
      case 'route': return '⛰'
      default: return '●'
    }
  }

  return (
    <group position={[hotspot.position.x * 8, hotspot.position.y * 8, hotspot.position.z * 8]}>
      {/* Hotspot sphere */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial 
          color={getHotspotColor()} 
          transparent 
          opacity={hovered ? 0.9 : 0.7}
        />
      </mesh>

      {/* Hotspot icon */}
      <Text
        position={[0, 0, 0.11]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {getHotspotIcon()}
      </Text>

      {/* Tooltip/Info panel */}
      {(hovered || showInfo) && (
        <Html
          position={[0, 0.3, 0]}
          transform
          sprite
        >
          <div className="bg-black bg-opacity-80 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap max-w-xs">
            <div className="font-semibold">{hotspot.title}</div>
            {hotspot.content && (
              <div className="text-gray-300 text-xs mt-1">{hotspot.content}</div>
            )}
            {hotspot.type === 'navigation' && (
              <div className="text-green-400 text-xs mt-1">Click para navegar</div>
            )}
          </div>
        </Html>
      )}

      {/* Ring indicator for better visibility */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.12, 0.15, 16]} />
        <meshBasicMaterial 
          color={getHotspotColor()} 
          transparent 
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

export default Hotspot