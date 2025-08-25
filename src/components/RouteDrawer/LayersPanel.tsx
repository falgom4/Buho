import React, { useState } from 'react'
import { useRouteEditorStore } from '../../stores/routeEditorStore'
import { useCurrentScene } from '../../stores/tourStore'

const LayersPanel: React.FC = () => {
  const { 
    isDrawingMode, 
    visibleLayers, 
    setLayerVisible, 
    toggleLayerVisible 
  } = useRouteEditorStore()
  
  const currentScene = useCurrentScene()
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Información sobre los grados de escalada
  const difficultyInfo = [
    { 
      grade: 'V0', 
      color: '#4CAF50', 
      description: 'Principiante', 
      difficulty: 'Muy fácil',
      icon: '🟢'
    },
    { 
      grade: 'V1', 
      color: '#8BC34A', 
      description: 'Fácil', 
      difficulty: 'Fácil',
      icon: '🟢'
    },
    { 
      grade: 'V2', 
      color: '#CDDC39', 
      description: 'Básico', 
      difficulty: 'Fácil+',
      icon: '🟡'
    },
    { 
      grade: 'V3', 
      color: '#FFEB3B', 
      description: 'Intermedio', 
      difficulty: 'Moderado',
      icon: '🟡'
    },
    { 
      grade: 'V4', 
      color: '#FFC107', 
      description: 'Intermedio+', 
      difficulty: 'Moderado+',
      icon: '🟠'
    },
    { 
      grade: 'V5', 
      color: '#FF9800', 
      description: 'Avanzado', 
      difficulty: 'Difícil',
      icon: '🟠'
    },
    { 
      grade: 'V6', 
      color: '#FF5722', 
      description: 'Avanzado+', 
      difficulty: 'Difícil+',
      icon: '🔴'
    },
    { 
      grade: 'V7', 
      color: '#F44336', 
      description: 'Experto', 
      difficulty: 'Muy difícil',
      icon: '🔴'
    },
    { 
      grade: 'V8', 
      color: '#E91E63', 
      description: 'Experto+', 
      difficulty: 'Extremo',
      icon: '🟣'
    },
    { 
      grade: 'V9', 
      color: '#9C27B0', 
      description: 'Elite', 
      difficulty: 'Elite',
      icon: '🟣'
    },
    { 
      grade: 'V10', 
      color: '#673AB7', 
      description: 'Elite+', 
      difficulty: 'Elite+',
      icon: '⚫'
    }
  ]

  if (!isDrawingMode) return null

  // Contar rutas por dificultad
  const getRouteCount = (grade: string) => {
    if (!currentScene) return 0
    return currentScene.routes.filter(route => route.difficulty === grade).length
  }

  const toggleAllLayers = (visible: boolean) => {
    difficultyInfo.forEach(info => {
      setLayerVisible(info.grade, visible)
    })
  }

  const visibleCount = Object.values(visibleLayers).filter(Boolean).length
  const totalLayers = difficultyInfo.length

  return (
    <div className="absolute top-20 right-4 z-20">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">📋</span>
              <div>
                <h3 className="font-semibold">Capas por Grado</h3>
                <p className="text-xs opacity-90">
                  {visibleCount}/{totalLayers} visibles
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              <span className={`transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
          </div>
          
          {/* Quick actions */}
          {!isCollapsed && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => toggleAllLayers(true)}
                className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded py-1 px-2 text-xs transition-colors"
              >
                Mostrar Todo
              </button>
              <button
                onClick={() => toggleAllLayers(false)}
                className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded py-1 px-2 text-xs transition-colors"
              >
                Ocultar Todo
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {!isCollapsed && (
          <div className="max-h-96 overflow-y-auto">
            <div className="p-2">
              {difficultyInfo.map((info) => {
                const isVisible = visibleLayers[info.grade]
                const routeCount = getRouteCount(info.grade)

                return (
                  <div
                    key={info.grade}
                    className={`group flex items-center gap-3 p-3 rounded-lg mb-2 transition-all cursor-pointer ${
                      isVisible 
                        ? 'bg-gray-50 border-2 border-gray-200' 
                        : 'bg-gray-25 border-2 border-gray-100 opacity-60'
                    } hover:shadow-sm`}
                    onClick={() => toggleLayerVisible(info.grade)}
                  >
                    {/* Visibility toggle */}
                    <div className="flex-shrink-0">
                      <div
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                          isVisible
                            ? 'bg-blue-500 border-blue-500 text-white'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {isVisible && <span className="text-xs">✓</span>}
                      </div>
                    </div>

                    {/* Color indicator */}
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: info.color }}
                      />
                      <span className="text-lg">{info.icon}</span>
                    </div>

                    {/* Grade info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-gray-800">
                          {info.grade}
                        </div>
                        {routeCount > 0 && (
                          <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {routeCount} ruta{routeCount !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {info.description}
                      </div>
                      <div className="text-xs text-gray-500">
                        {info.difficulty}
                      </div>
                    </div>

                    {/* Visibility indicator */}
                    <div className="flex-shrink-0">
                      <span className={`text-lg transition-opacity ${
                        isVisible ? 'opacity-100' : 'opacity-30'
                      }`}>
                        👁️
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Stats footer */}
            <div className="border-t border-gray-200 p-3 bg-gray-50">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Total rutas: {currentScene?.routes.length || 0}</span>
                <span>Capas activas: {visibleCount}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LayersPanel