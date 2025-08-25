import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Html } from '@react-three/drei'
import * as THREE from 'three'
import { Hotspot as HotspotType } from '../../types'
import { useTourStore } from '../../stores/tourStore'
import { useEditorStore } from '../../stores/editorStore'

interface HotspotProps {
  hotspot: HotspotType
}

const Hotspot: React.FC<HotspotProps> = ({ hotspot }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  
  const navigateToScene = useTourStore(state => state.navigateToScene)
  const { mode, selectedHotspotId, setSelectedHotspot } = useEditorStore()
  
  const isSelected = selectedHotspotId === hotspot.id
  const isEditMode = mode === 'edit'

  // Animación de pulsación
  useFrame((state) => {
    if (meshRef.current) {
      const baseScale = isSelected ? 1.3 : 1
      const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      meshRef.current.scale.setScalar((hovered ? baseScale * 1.2 : baseScale) * pulseScale)
    }
  })

  const handleClick = (event: any) => {
    event.stopPropagation()
    
    if (isEditMode) {
      // En modo edición, seleccionar para editar propiedades
      setSelectedHotspot(isSelected ? null : hotspot.id)
    } else {
      // En modo preview, ejecutar acción del hotspot
      if (hotspot.type === 'navigation' && hotspot.target) {
        navigateToScene(hotspot.target)
      } else if (hotspot.type === 'info') {
        setShowInfo(!showInfo)
      } else if (hotspot.type === 'route') {
        setShowInfo(!showInfo)
      }
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
      case 'route': return '🧗'
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
          color={isSelected ? '#FF5722' : getHotspotColor()} 
          transparent 
          opacity={hovered ? 0.9 : (isSelected ? 0.8 : 0.7)}
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
      {(hovered || showInfo || isSelected) && (
        <Html
          position={[0, 0.3, 0]}
          transform
          sprite
        >
          <div className={`text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap max-w-xs ${
            isSelected ? 'bg-orange-600 bg-opacity-90' : 'bg-black bg-opacity-80'
          }`}>
            <div className="font-semibold">{hotspot.title}</div>
            {hotspot.content && (
              <div className="text-gray-300 text-xs mt-1">{hotspot.content}</div>
            )}
            {hotspot.type === 'route' && hotspot.difficulty && (
              <div className="text-orange-400 text-xs mt-1">
                Grado: {hotspot.difficulty}
              </div>
            )}
            {isEditMode ? (
              <div className="text-yellow-400 text-xs mt-1">
                {isSelected ? 'Seleccionado - Ver panel propiedades' : 'Click para editar'}
              </div>
            ) : (
              <div className="text-green-400 text-xs mt-1">
                {hotspot.type === 'navigation' ? 'Click para navegar' : 
                 hotspot.type === 'route' ? 'Click para ver ruta' :
                 'Click para más información'}
              </div>
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