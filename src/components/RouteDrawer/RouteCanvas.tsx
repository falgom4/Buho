import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useCurrentScene, useTourStore } from '../../stores/tourStore'
import { useRouteEditorStore } from '../../stores/routeEditorStore'
import { Position2D, Route } from '../../types'

interface RouteCanvasProps {
  className?: string
}

const RouteCanvas: React.FC<RouteCanvasProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [imageLoaded, setImageLoaded] = useState(false)
  
  const currentScene = useCurrentScene()
  const { updateScene } = useTourStore()
  
  const {
    isDrawingMode,
    selectedDrawTool,
    selectedEditTool,
    strokeColor,
    strokeWidth,
    fillColor,
    currentPoints,
    isDrawing,
    selectedRouteId,
    visibleLayers,
    startDrawing,
    addPoint,
    finishDrawing,
    cancelDrawing,
    selectRoute
  } = useRouteEditorStore()

  // Redimensionar canvas cuando cambia el contenedor
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const container = canvas.parentElement
    if (!container) return

    const rect = container.getBoundingClientRect()
    setCanvasSize({ width: rect.width, height: rect.height })
    
    // Ajustar resolución del canvas para pantallas de alta densidad
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(dpr, dpr)
    }
    
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`
  }, [])

  // Configurar canvas al montar y al cambiar tamaño
  useEffect(() => {
    updateCanvasSize()
    
    const handleResize = () => updateCanvasSize()
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [updateCanvasSize])

  // Dibujar rutas en el canvas
  const drawRoutes = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !currentScene) return

    // Limpiar canvas
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height)

    // Dibujar rutas existentes
    currentScene.routes.forEach(route => {
      if (!visibleLayers[route.difficulty]) return

      ctx.strokeStyle = route.color
      ctx.lineWidth = route.strokeWidth
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      // Highlight si está seleccionada
      if (selectedRouteId === route.id) {
        ctx.shadowColor = '#FFF'
        ctx.shadowBlur = 10
        ctx.lineWidth = route.strokeWidth + 2
      } else {
        ctx.shadowBlur = 0
      }

      // Dibujar línea
      if (route.points.length >= 2) {
        ctx.beginPath()
        route.points.forEach((point, index) => {
          const x = (point.x / 100) * canvasSize.width
          const y = (point.y / 100) * canvasSize.height
          
          if (index === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        })
        ctx.stroke()

        // Dibujar puntos de control si está seleccionada
        if (selectedRouteId === route.id) {
          ctx.fillStyle = '#FFF'
          ctx.shadowBlur = 0
          route.points.forEach(point => {
            const x = (point.x / 100) * canvasSize.width
            const y = (point.y / 100) * canvasSize.height
            
            ctx.beginPath()
            ctx.arc(x, y, 4, 0, 2 * Math.PI)
            ctx.fill()
          })
        }

        // Dibujar flecha al final si es tipo arrow
        if (selectedDrawTool === 'arrow' && route.points.length >= 2) {
          drawArrowhead(ctx, route.points[route.points.length - 2], route.points[route.points.length - 1])
        }
      }
    })

    // Dibujar ruta en progreso
    if (isDrawing && currentPoints.length > 0) {
      ctx.strokeStyle = strokeColor
      ctx.lineWidth = strokeWidth
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.shadowBlur = 0

      ctx.beginPath()
      currentPoints.forEach((point, index) => {
        const x = (point.x / 100) * canvasSize.width
        const y = (point.y / 100) * canvasSize.height
        
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()

      // Dibujar puntos de la ruta en progreso
      ctx.fillStyle = strokeColor
      currentPoints.forEach(point => {
        const x = (point.x / 100) * canvasSize.width
        const y = (point.y / 100) * canvasSize.height
        
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, 2 * Math.PI)
        ctx.fill()
      })
    }
  }, [currentScene, canvasSize, isDrawing, currentPoints, strokeColor, strokeWidth, selectedRouteId, visibleLayers, selectedDrawTool])

  // Dibujar flecha
  const drawArrowhead = (ctx: CanvasRenderingContext2D, from: Position2D, to: Position2D) => {
    const fromX = (from.x / 100) * canvasSize.width
    const fromY = (from.y / 100) * canvasSize.height
    const toX = (to.x / 100) * canvasSize.width
    const toY = (to.y / 100) * canvasSize.height
    
    const angle = Math.atan2(toY - fromY, toX - fromX)
    const arrowLength = 15
    const arrowAngle = Math.PI / 6

    ctx.beginPath()
    ctx.moveTo(toX, toY)
    ctx.lineTo(
      toX - arrowLength * Math.cos(angle - arrowAngle),
      toY - arrowLength * Math.sin(angle - arrowAngle)
    )
    ctx.moveTo(toX, toY)
    ctx.lineTo(
      toX - arrowLength * Math.cos(angle + arrowAngle),
      toY - arrowLength * Math.sin(angle + arrowAngle)
    )
    ctx.stroke()
  }

  // Redibujar cuando cambian las dependencias
  useEffect(() => {
    if (imageLoaded) {
      drawRoutes()
    }
  }, [drawRoutes, imageLoaded])

  // Manejar clicks en el canvas
  const handleCanvasClick = (event: React.MouseEvent) => {
    if (!isDrawingMode) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    if (selectedDrawTool && (selectedDrawTool === 'line' || selectedDrawTool === 'arrow')) {
      if (!isDrawing) {
        startDrawing()
        addPoint({ x, y })
      } else {
        addPoint({ x, y })
      }
    } else if (selectedDrawTool === 'point') {
      // Agregar punto individual
      const newRoute: Route = {
        id: `point-${Date.now()}`,
        name: `Punto ${Date.now()}`,
        difficulty: 'V3',
        color: strokeColor,
        strokeWidth: strokeWidth,
        points: [{ x, y }],
        type: 'boulder'
      }
      
      if (currentScene) {
        updateScene(currentScene.id, {
          routes: [...currentScene.routes, newRoute]
        })
      }
    }
  }

  // Manejar doble click para terminar línea
  const handleCanvasDoubleClick = () => {
    if (isDrawing && currentPoints.length >= 2) {
      const newRoute: Route = {
        id: `route-${Date.now()}`,
        name: `Ruta ${Date.now()}`,
        difficulty: 'V3',
        color: strokeColor,
        strokeWidth: strokeWidth,
        points: [...currentPoints],
        type: selectedDrawTool === 'arrow' ? 'route' : 'boulder'
      }
      
      if (currentScene) {
        updateScene(currentScene.id, {
          routes: [...currentScene.routes, newRoute]
        })
      }
      
      finishDrawing()
    }
  }

  // Manejar selección de rutas
  const handleRouteSelection = (event: React.MouseEvent) => {
    if (!selectedEditTool || selectedEditTool !== 'select') return

    const canvas = canvasRef.current
    if (!canvas || !currentScene) return

    const rect = canvas.getBoundingClientRect()
    const clickX = ((event.clientX - rect.left) / rect.width) * 100
    const clickY = ((event.clientY - rect.top) / rect.height) * 100

    // Buscar ruta cerca del click
    let closestRoute: Route | null = null
    let minDistance = 10 // Tolerancia en píxeles convertidos a porcentaje

    currentScene.routes.forEach(route => {
      route.points.forEach(point => {
        const distance = Math.sqrt(
          Math.pow(point.x - clickX, 2) + Math.pow(point.y - clickY, 2)
        )
        if (distance < minDistance) {
          minDistance = distance
          closestRoute = route
        }
      })
    })

    selectRoute(closestRoute?.id || null)
  }

  useEffect(() => {
    setImageLoaded(true)
  }, [currentScene?.panoramaUrl])

  if (!isDrawingMode) return null

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-auto cursor-crosshair z-10 ${className}`}
      onClick={selectedEditTool === 'select' ? handleRouteSelection : handleCanvasClick}
      onDoubleClick={handleCanvasDoubleClick}
      style={{ 
        mixBlendMode: 'normal',
        backgroundColor: 'transparent' 
      }}
    />
  )
}

export default RouteCanvas