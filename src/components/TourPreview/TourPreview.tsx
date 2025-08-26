import React, { useState, useEffect } from 'react'
import { useTourStore } from '../../stores/tourStore'
import { useProjectStore } from '../../stores/projectStore'
import { Scene } from '../../types'

interface TourPreviewProps {
  isOpen: boolean
  onClose: () => void
  onEdit?: () => void
}

const TourPreview: React.FC<TourPreviewProps> = ({ isOpen, onClose, onEdit }) => {
  const { currentTour, currentSceneId, navigateToScene } = useTourStore()
  const { currentProject } = useProjectStore()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showInfo, setShowInfo] = useState(true)
  const [showRoutes, setShowRoutes] = useState(true)

  const currentScene = currentTour?.scenes.find(s => s.id === currentSceneId)

  useEffect(() => {
    if (isOpen && currentTour && currentTour.scenes.length > 0 && !currentSceneId) {
      navigateToScene(currentTour.scenes[0].id)
    }
  }, [isOpen, currentTour, currentSceneId, navigateToScene])

  if (!isOpen || !currentTour || !currentScene) return null

  const getSceneIndex = () => {
    return currentTour.scenes.findIndex(s => s.id === currentSceneId) + 1
  }

  const canNavigateNext = () => {
    const currentIndex = currentTour.scenes.findIndex(s => s.id === currentSceneId)
    return currentIndex < currentTour.scenes.length - 1
  }

  const canNavigatePrev = () => {
    const currentIndex = currentTour.scenes.findIndex(s => s.id === currentSceneId)
    return currentIndex > 0
  }

  const navigateNext = () => {
    const currentIndex = currentTour.scenes.findIndex(s => s.id === currentSceneId)
    if (currentIndex < currentTour.scenes.length - 1) {
      navigateToScene(currentTour.scenes[currentIndex + 1].id)
    }
  }

  const navigatePrev = () => {
    const currentIndex = currentTour.scenes.findIndex(s => s.id === currentSceneId)
    if (currentIndex > 0) {
      navigateToScene(currentTour.scenes[currentIndex - 1].id)
    }
  }

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
    setIsFullscreen(!isFullscreen)
  }

  const getDifficultyColor = (difficulty: string) => {
    // Mapeo básico de colores por dificultad
    const colorMap: { [key: string]: string } = {
      'V0': '#4CAF50', 'V1': '#8BC34A', 'V2': '#CDDC39', 'V3': '#FFEB3B',
      'V4': '#FFC107', 'V5': '#FF9800', 'V6': '#FF5722', 'V7': '#F44336',
      'V8': '#E91E63', 'V9': '#9C27B0', 'V10': '#673AB7'
    }
    return colorMap[difficulty] || '#666666'
  }

  return (
    <div className={`fixed inset-0 z-50 bg-black ${isFullscreen ? '' : 'bg-opacity-95'}`}>
      {/* Header */}
      {!isFullscreen && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black to-transparent p-6">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                ← Cerrar Preview
              </button>
              
              <div className="border-l border-white border-opacity-30 pl-4">
                <h1 className="text-xl font-bold">{currentTour.title}</h1>
                <p className="text-sm text-gray-300">
                  {currentProject?.name} • Escena {getSceneIndex()} de {currentTour.scenes.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className={`p-2 rounded-lg transition-colors ${
                  showInfo ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-20'
                }`}
                title="Toggle info"
              >
                ℹ️
              </button>
              
              <button
                onClick={() => setShowRoutes(!showRoutes)}
                className={`p-2 rounded-lg transition-colors ${
                  showRoutes ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-20'
                }`}
                title="Toggle routes"
              >
                🧗
              </button>
              
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title="Fullscreen"
              >
                ⛶
              </button>
              
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  ✏️ Editar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Scene image */}
        <div className="relative w-full h-full">
          {currentScene.panoramaUrl ? (
            <img
              src={currentScene.panoramaUrl}
              alt={currentScene.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-8xl mb-4">🏔️</div>
                <h3 className="text-2xl font-bold mb-2">{currentScene.name}</h3>
                <p className="text-gray-400">Sin imagen panorámica</p>
              </div>
            </div>
          )}

          {/* Route overlay */}
          {showRoutes && currentScene.routes.length > 0 && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {currentScene.routes.map(route => (
                <g key={route.id}>
                  <polyline
                    points={route.points.map(p => `${(p.x / window.innerWidth) * 100},${(p.y / window.innerHeight) * 100}`).join(' ')}
                    fill="none"
                    stroke={route.color || getDifficultyColor(route.difficulty)}
                    strokeWidth="0.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Route start marker */}
                  {route.points.length > 0 && (
                    <circle
                      cx={(route.points[0].x / window.innerWidth) * 100}
                      cy={(route.points[0].y / window.innerHeight) * 100}
                      r="0.8"
                      fill={route.color || getDifficultyColor(route.difficulty)}
                    />
                  )}
                  {/* Route end marker */}
                  {route.points.length > 1 && (
                    <circle
                      cx={(route.points[route.points.length - 1].x / window.innerWidth) * 100}
                      cy={(route.points[route.points.length - 1].y / window.innerHeight) * 100}
                      r="0.8"
                      fill={route.color || getDifficultyColor(route.difficulty)}
                      stroke="white"
                      strokeWidth="0.1"
                    />
                  )}
                </g>
              ))}
            </svg>
          )}

          {/* Hotspots overlay */}
          <div className="absolute inset-0">
            {currentScene.hotspots.map(hotspot => (
              <button
                key={hotspot.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{
                  left: `${50 + (hotspot.position.x * 25)}%`,
                  top: `${50 + (hotspot.position.y * 25)}%`
                }}
                onClick={() => {
                  if (hotspot.type === 'navigation' && hotspot.target) {
                    navigateToScene(hotspot.target)
                  }
                }}
              >
                <div className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center text-lg shadow-lg transition-transform group-hover:scale-110">
                  {hotspot.type === 'navigation' ? '🔗' : hotspot.type === 'info' ? 'ℹ️' : '⛰️'}
                </div>
                
                {/* Hotspot tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black bg-opacity-75 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {hotspot.title}
                  {hotspot.type === 'info' && hotspot.content && (
                    <div className="text-xs text-gray-300 mt-1">{hotspot.content}</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation arrows */}
        {canNavigatePrev() && (
          <button
            onClick={navigatePrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all"
          >
            ←
          </button>
        )}

        {canNavigateNext() && (
          <button
            onClick={navigateNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all"
          >
            →
          </button>
        )}
      </div>

      {/* Bottom panel */}
      {!isFullscreen && (
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black to-transparent p-6">
          <div className="flex items-end justify-between">
            {/* Scene info */}
            {showInfo && (
              <div className="text-white max-w-md">
                <h2 className="text-lg font-bold mb-2">{currentScene.name}</h2>
                {currentScene.description && (
                  <p className="text-sm text-gray-300 mb-2">{currentScene.description}</p>
                )}
                
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>🔗 {currentScene.hotspots.length} hotspots</span>
                  <span>🧗 {currentScene.routes.length} rutas</span>
                  {currentScene.metadata.location && (
                    <span>📍 {currentScene.metadata.location}</span>
                  )}
                </div>
              </div>
            )}

            {/* Scene navigation */}
            <div className="flex items-center gap-2">
              {currentTour.scenes.map((scene, index) => (
                <button
                  key={scene.id}
                  onClick={() => navigateToScene(scene.id)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    scene.id === currentSceneId
                      ? 'bg-white'
                      : 'bg-white bg-opacity-40 hover:bg-opacity-60'
                  }`}
                  title={scene.name}
                />
              ))}
            </div>
          </div>

          {/* Routes legend */}
          {showRoutes && currentScene.routes.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white border-opacity-20">
              <div className="flex flex-wrap gap-3">
                {currentScene.routes.map(route => (
                  <div
                    key={route.id}
                    className="flex items-center gap-2 text-sm text-white"
                  >
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: route.color || getDifficultyColor(route.difficulty) }}
                    />
                    <span>
                      {route.name} ({route.difficulty})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Minimal fullscreen controls */}
      {isFullscreen && (
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={toggleFullscreen}
            className="w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}

export default TourPreview