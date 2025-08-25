import { useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

export const usePanoramaControls = () => {
  const { camera, gl } = useThree()
  const isMouseDown = useRef(false)
  const mousePosition = useRef({ x: 0, y: 0 })
  const phi = useRef(0)
  const theta = useRef(0)

  useEffect(() => {
    const canvas = gl.domElement

    const handleMouseDown = (event: MouseEvent) => {
      isMouseDown.current = true
      mousePosition.current = { x: event.clientX, y: event.clientY }
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!isMouseDown.current) return

      const deltaX = event.clientX - mousePosition.current.x
      const deltaY = event.clientY - mousePosition.current.y

      phi.current -= deltaX * 0.01
      theta.current = Math.max(
        -Math.PI / 2 + 0.1,
        Math.min(Math.PI / 2 - 0.1, theta.current + deltaY * 0.01)
      )

      const spherical = new THREE.Spherical(1, theta.current + Math.PI / 2, phi.current)
      const position = new THREE.Vector3().setFromSpherical(spherical)
      
      camera.lookAt(position)

      mousePosition.current = { x: event.clientX, y: event.clientY }
    }

    const handleMouseUp = () => {
      isMouseDown.current = false
    }

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
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

      const spherical = new THREE.Spherical(1, theta.current + Math.PI / 2, phi.current)
      const position = new THREE.Vector3().setFromSpherical(spherical)
      
      camera.lookAt(position)

      mousePosition.current = { 
        x: event.touches[0].clientX, 
        y: event.touches[0].clientY 
      }
    }

    const handleTouchEnd = () => {
      isMouseDown.current = false
    }

    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('mouseleave', handleMouseUp)
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('touchend', handleTouchEnd)

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('mouseleave', handleMouseUp)
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
    }
  }, [camera, gl])

  return { phi: phi.current, theta: theta.current }
}