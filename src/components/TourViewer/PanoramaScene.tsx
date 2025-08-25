import React, { useRef, useEffect } from 'react'
import { useLoader, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { usePanoramaControls } from '../../hooks/usePanoramaControls'

interface PanoramaSceneProps {
  imageUrl?: string
}

const PanoramaScene: React.FC<PanoramaSceneProps> = ({ 
  imageUrl = '/placeholder-panorama.svg' 
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  usePanoramaControls()

  // Cargar textura panorámica
  const texture = useLoader(THREE.TextureLoader, imageUrl).clone()
  
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
    <mesh ref={meshRef} scale={[-1, 1, 1]}>
      <sphereGeometry args={[10, 64, 32]} />
      <meshBasicMaterial 
        map={texture} 
        side={THREE.BackSide}
        transparent={false}
      />
    </mesh>
  )
}

export default PanoramaScene