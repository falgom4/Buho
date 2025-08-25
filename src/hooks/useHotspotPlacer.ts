import { useCallback, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useEditorStore } from '../stores/editorStore'
import { useTourStore } from '../stores/tourStore'
import { Hotspot } from '../types'

export const useHotspotPlacer = () => {
  const { camera, raycaster, gl } = useThree()
  const { 
    isPlacingHotspot, 
    selectedTool, 
    cancelPlacingHotspot 
  } = useEditorStore()
  
  const { 
    currentSceneId, 
    addHotspotToScene 
  } = useTourStore()
  
  const mouse = useRef(new THREE.Vector2())

  const handleCanvasClick = useCallback((event: MouseEvent) => {
    if (!isPlacingHotspot || !selectedTool || !currentSceneId) return

    // Prevenir que el click interfiera con los controles de cámara
    event.stopPropagation()

    const canvas = gl.domElement
    const rect = canvas.getBoundingClientRect()
    
    // Calcular coordenadas del mouse en el canvas
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    // Usar raycaster para obtener posición en 3D
    raycaster.setFromCamera(mouse.current, camera)
    
    // Crear una esfera invisible grande para interceptar el raycast
    const sphereGeometry = new THREE.SphereGeometry(8, 32, 32)
    const invisibleSphere = new THREE.Mesh(sphereGeometry)
    invisibleSphere.position.set(0, 0, 0)

    const intersects = raycaster.intersectObject(invisibleSphere)
    
    if (intersects.length > 0) {
      const intersectionPoint = intersects[0].point
      
      // Normalizar la posición para que esté en la superficie de la esfera
      const normalizedPosition = intersectionPoint.normalize()
      
      // Crear nuevo hotspot
      const newHotspot: Hotspot = {
        id: `hotspot-${Date.now()}`,
        type: selectedTool,
        position: {
          x: normalizedPosition.x,
          y: normalizedPosition.y,
          z: normalizedPosition.z
        },
        title: getDefaultTitle(selectedTool),
        icon: getDefaultIcon(selectedTool)
      }

      // Agregar contenido por defecto según el tipo
      if (selectedTool === 'info') {
        newHotspot.content = 'Información del hotspot'
      } else if (selectedTool === 'navigation') {
        // El target se configurará en el panel de propiedades
      }

      addHotspotToScene(currentSceneId, newHotspot)
      cancelPlacingHotspot()
    }

    // Limpiar geometría temporal
    sphereGeometry.dispose()
  }, [isPlacingHotspot, selectedTool, currentSceneId, camera, raycaster, gl, addHotspotToScene, cancelPlacingHotspot])

  return { handleCanvasClick, isPlacingHotspot }
}

function getDefaultTitle(tool: string): string {
  switch (tool) {
    case 'navigation': return 'Navegar a...'
    case 'info': return 'Información'
    case 'route': return 'Ruta de Escalada'
    default: return 'Hotspot'
  }
}

function getDefaultIcon(tool: string): string {
  switch (tool) {
    case 'navigation': return 'arrow'
    case 'info': return 'info'
    case 'route': return 'route'
    default: return 'point'
  }
}