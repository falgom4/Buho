import { useRef, useEffect, useCallback } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

export const usePanoramaControls = () => {
  const { camera, gl } = useThree()
  const isMouseDown = useRef(false)
  const mousePosition = useRef({ x: 0, y: 0 })
  const phi = useRef(0)
  const theta = useRef(0)
  const zoom = useRef(75) // FOV inicial

  const updateCamera = useCallback(() => {
    const spherical = new THREE.Spherical(1, theta.current + Math.PI / 2, phi.current)
    const position = new THREE.Vector3().setFromSpherical(spherical)
    
    camera.lookAt(position)
    
    // Aplicar zoom cambiando el FOV
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = zoom.current
      camera.updateProjectionMatrix()
    }
  }, [camera])

  useEffect(() => {
    const canvas = gl.domElement

    const handleMouseDown = (event: MouseEvent) => {
      event.preventDefault()
      isMouseDown.current = true
      mousePosition.current = { x: event.clientX, y: event.clientY }
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!isMouseDown.current) return

      const deltaX = event.clientX - mousePosition.current.x
      const deltaY = event.clientY - mousePosition.current.y

      // Pan horizontal y vertical
      phi.current -= deltaX * 0.01
      theta.current = Math.max(
        -Math.PI / 2 + 0.1,
        Math.min(Math.PI / 2 - 0.1, theta.current + deltaY * 0.01)
      )

      updateCamera()
      mousePosition.current = { x: event.clientX, y: event.clientY }
    }

    const handleMouseUp = () => {
      isMouseDown.current = false
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      
      // Zoom con rueda del mouse
      const zoomSpeed = 0.1
      zoom.current += event.deltaY * zoomSpeed
      zoom.current = Math.max(30, Math.min(120, zoom.current)) // Limitar zoom
      
      updateCamera()
    }

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        event.preventDefault()
        isMouseDown.current = true
        mousePosition.current = { 
          x: event.touches[0].clientX, 
          y: event.touches[0].clientY 
        }
      }
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (!isMouseDown.current || event.touches.length !== 1) return
      event.preventDefault()

      const deltaX = event.touches[0].clientX - mousePosition.current.x
      const deltaY = event.touches[0].clientY - mousePosition.current.y

      phi.current -= deltaX * 0.01
      theta.current = Math.max(
        -Math.PI / 2 + 0.1,
        Math.min(Math.PI / 2 - 0.1, theta.current + deltaY * 0.01)
      )

      updateCamera()
      mousePosition.current = { 
        x: event.touches[0].clientX, 
        y: event.touches[0].clientY 
      }
    }

    const handleTouchEnd = () => {
      isMouseDown.current = false
    }

    // Agregar eventos
    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('mouseleave', handleMouseUp)
    canvas.addEventListener('wheel', handleWheel, { passive: false })
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('touchend', handleTouchEnd)

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('mouseleave', handleMouseUp)
      canvas.removeEventListener('wheel', handleWheel)
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
    }
  }, [camera, gl, updateCamera])

  return { 
    phi: phi.current, 
    theta: theta.current, 
    zoom: zoom.current,
    updateCamera 
  }
}