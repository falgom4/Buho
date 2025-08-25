import React, { useRef, useEffect } from 'react'
import { useLoader, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePanoramaControls } from '../../hooks/usePanoramaControls'
import { useCurrentScene } from '../../stores/tourStore'
import Hotspot from './Hotspot'

interface PanoramaSceneProps {
  imageUrl?: string
}

const PanoramaScene: React.FC<PanoramaSceneProps> = ({ imageUrl }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const currentScene = useCurrentScene()
  
  usePanoramaControls()

  // Usar imagen de la escena actual o fallback
  const panoramaUrl = imageUrl || currentScene?.panoramaUrl || '/placeholder-panorama.svg'
  
  // Cargar textura panorámica
  const texture = useLoader(THREE.TextureLoader, panoramaUrl).clone()
  
  useEffect(() => {
    if (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.ClampToEdgeWrapping
    }
  }, [texture])

  // Rotar la geometría para que se vea correctamente
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001 // Rotación muy lenta para efecto visual
    }
  })

  return (
    <>
      {/* Esfera panorámica */}
      <mesh ref={meshRef} scale={[-1, 1, 1]}>
        <sphereGeometry args={[10, 64, 32]} />
        <meshBasicMaterial 
          map={texture} 
          side={THREE.BackSide}
          transparent={false}
        />
      </mesh>

      {/* Hotspots de la escena actual */}
      {currentScene?.hotspots.map((hotspot) => (
        <Hotspot key={hotspot.id} hotspot={hotspot} />
      ))}
    </>
  )
}

export default PanoramaScene