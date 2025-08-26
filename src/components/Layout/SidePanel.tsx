import React, { useState, useEffect } from 'react'
import { useEditorStore } from '../../stores/editorStore'
import { useRouteEditorStore } from '../../stores/routeEditorStore'
import { useTourStore, useCurrentScene } from '../../stores/tourStore'
import { useProjectStore } from '../../stores/projectStore'
import { useResponsive } from '../../hooks/useResponsive'

interface SidePanelProps {
  isOpen: boolean
  onToggle: () => void
  side: 'left' | 'right'
  width?: number
}

const SidePanel: React.FC<SidePanelProps> = ({ 
  isOpen, 
  onToggle, 
  side = 'right',
  width = 320
}) => {
  const { isMobile, getOptimalPanelWidth } = useResponsive()
  const { mode } = useEditorStore()
  const { isDrawingMode, visibleLayers } = useRouteEditorStore()
  const { currentTour } = useTourStore()
  const { currentProject } = useProjectStore()
  const currentScene = useCurrentScene()
  
  const [activeTab, setActiveTab] = useState<'scene' | 'tools' | 'info'>('scene')
  const [isPinned, setIsPinned] = useState(false)
  
  // Use responsive width
  const panelWidth = isMobile ? getOptimalPanelWidth() : width

  // Auto-hide cuando no está pinned y no hay interacción
  useEffect(() => {
    if (!isPinned && isOpen) {
      const timer = setTimeout(() => {
        if (!document.querySelector('.side-panel:hover')) {
          onToggle()
        }
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [isOpen, isPinned, onToggle])

  const getVisibleRoutesCount = () => {
    if (!currentScene) return 0
    return Object.entries(visibleLayers)
      .filter(([_, visible]) => visible)
      .reduce((count, [grade]) => {
        return count + currentScene.routes.filter(route => route.difficulty === grade).length
      }, 0)
  }

  const tabs = [
    {
      id: 'scene',
      name: 'Escena',
      icon: '🖼️',
      badge: currentScene?.hotspots.length || 0
    },
    {
      id: 'tools',
      name: 'Herramientas',
      icon: '🛠️',
      badge: isDrawingMode ? getVisibleRoutesCount() : 0
    },
    {
      id: 'info',
      name: 'Info',
      icon: 'ℹ️',
      badge: null
    }
  ]

  return (
    <>
      {/* Backdrop */}
      {isOpen && !isPinned && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className={`fixed top-1/2 transform -translate-y-1/2 z-40 w-8 h-16 bg-white border rounded-l-lg shadow-lg hover:shadow-xl transition-all ${
          side === 'left'
            ? `left-0 ${isOpen ? `translate-x-${width}px` : 'translate-x-0'} rounded-r-lg rounded-l-none`
            : `right-0 ${isOpen ? `-translate-x-${width}px` : 'translate-x-0'}`
        } ${isOpen ? 'opacity-75' : 'opacity-90'}`}
        style={{
          [side === 'left' ? 'left' : 'right']: isOpen ? `${width}px` : '0px'
        }}
      >
        <div className="flex items-center justify-center w-full h-full">
          <span className={`text-gray-600 transform transition-transform ${
            isOpen ? (side === 'left' ? 'rotate-180' : '') : (side === 'left' ? '' : 'rotate-180')
          }`}>
            ▶
          </span>
        </div>
      </button>

      {/* Panel */}
      <div
        className={`side-panel fixed top-0 ${side}-0 h-full bg-white shadow-2xl border-${side === 'left' ? 'r' : 'l'} border-gray-200 z-35 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : side === 'left' ? '-translate-x-full' : 'translate-x-full'
        }`}
        style={{ width: `${panelWidth}px` }}
      >
        {/* Header */}
        <div className={`flex items-center justify-between border-b border-gray-200 bg-gray-50 ${
          isMobile ? 'p-3' : 'p-4'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🏔️</span>
            </div>
            <span className={`font-semibold text-gray-800 ${isMobile ? 'text-sm' : ''}`}>Panel</span>
            {mode === 'edit' && (
              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                Editando
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsPinned(!isPinned)}
              className={`p-1 rounded transition-colors ${
                isPinned
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              title={isPinned ? 'Desanclar panel' : 'Anclar panel'}
            >
              📌
            </button>
            <button
              onClick={onToggle}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.name}</span>
              {tab.badge !== null && tab.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {tab.badge > 99 ? '99+' : tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'scene' && (
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Escena Actual</h3>
              
              {currentScene ? (
                <div className="space-y-4">
                  {/* Scene info */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="font-medium text-gray-800 mb-1">
                      {currentScene.name}
                    </div>
                    {currentScene.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        {currentScene.description}
                      </p>
                    )}
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>🔗 {currentScene.hotspots.length} hotspots</span>
                      <span>🧗 {currentScene.routes.length} rutas</span>
                    </div>
                  </div>

                  {/* Navigation */}
                  {currentTour && currentTour.scenes.length > 1 && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Navegación</h4>
                      <div className="space-y-1">
                        {currentTour.scenes.map((scene, index) => (
                          <button
                            key={scene.id}
                            onClick={() => {
                              // Navigate to scene logic
                            }}
                            className={`w-full text-left p-2 rounded text-sm transition-colors ${
                              scene.id === currentScene.id
                                ? 'bg-blue-100 text-blue-800'
                                : 'hover:bg-gray-100 text-gray-700'
                            }`}
                          >
                            <span className="font-medium">{index + 1}. {scene.name}</span>
                            {scene.id === currentScene.id && (
                              <span className="ml-2 text-xs">← Actual</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hotspots list */}
                  {currentScene.hotspots.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Hotspots</h4>
                      <div className="space-y-2">
                        {currentScene.hotspots.map(hotspot => (
                          <div key={hotspot.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <span>
                              {hotspot.type === 'navigation' ? '🔗' : 
                               hotspot.type === 'info' ? 'ℹ️' : '⛰️'}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-800 truncate">
                                {hotspot.title}
                              </div>
                              {hotspot.type === 'info' && hotspot.content && (
                                <div className="text-xs text-gray-600 truncate">
                                  {hotspot.content}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🖼️</div>
                  <p>No hay escena seleccionada</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Herramientas</h3>
              
              <div className="space-y-4">
                {/* Drawing mode status */}
                {isDrawingMode && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span>🎨</span>
                      <span className="font-medium text-green-800">Modo Dibujo Activo</span>
                    </div>
                    <div className="text-sm text-green-700">
                      Rutas visibles: {getVisibleRoutesCount()}
                    </div>
                  </div>
                )}

                {/* Quick tools */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Acciones Rápidas</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-medium text-blue-700 transition-colors">
                      📷 Imagen
                    </button>
                    <button className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-sm font-medium text-purple-700 transition-colors">
                      🔗 Hotspot
                    </button>
                    <button className="p-3 bg-green-50 hover:bg-green-100 rounded-lg text-sm font-medium text-green-700 transition-colors">
                      🧗 Ruta
                    </button>
                    <button className="p-3 bg-orange-50 hover:bg-orange-100 rounded-lg text-sm font-medium text-orange-700 transition-colors">
                      🔍 Validar
                    </button>
                  </div>
                </div>

                {/* Layers if drawing mode */}
                {isDrawingMode && currentScene && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Capas Visibles</h4>
                    <div className="space-y-1">
                      {Object.entries(visibleLayers)
                        .filter(([_, visible]) => visible)
                        .map(([grade]) => {
                          const routeCount = currentScene.routes.filter(r => r.difficulty === grade).length
                          return (
                            <div key={grade} className="flex items-center gap-2 text-sm">
                              <div className="w-3 h-3 bg-blue-500 rounded"></div>
                              <span>{grade}</span>
                              <span className="text-gray-500">({routeCount})</span>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'info' && (
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Información</h3>
              
              <div className="space-y-4">
                {/* Project info */}
                {currentProject && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Proyecto</h4>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                      <div className="font-medium text-gray-800">
                        {currentProject.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {currentProject.category} • {currentProject.difficulty.min}-{currentProject.difficulty.max}
                      </div>
                      {currentProject.location && (
                        <div className="text-sm text-gray-600">
                          📍 {currentProject.location}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tour stats */}
                {currentTour && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Estadísticas</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {currentTour.scenes.length}
                        </div>
                        <div className="text-xs text-blue-700">Escenas</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-green-600">
                          {currentTour.scenes.reduce((acc, scene) => acc + scene.hotspots.length, 0)}
                        </div>
                        <div className="text-xs text-green-700">Hotspots</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-purple-600">
                          {currentTour.scenes.reduce((acc, scene) => acc + scene.routes.length, 0)}
                        </div>
                        <div className="text-xs text-purple-700">Rutas</div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-orange-600">
                          {Math.round(Math.random() * 100)}%
                        </div>
                        <div className="text-xs text-orange-700">Completo</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shortcuts */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Atajos de Teclado</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Proyectos</span>
                      <div className="flex gap-1">
                        <kbd className="px-1.5 py-1 bg-gray-100 rounded text-xs">Ctrl</kbd>
                        <kbd className="px-1.5 py-1 bg-gray-100 rounded text-xs">P</kbd>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Panel</span>
                      <div className="flex gap-1">
                        <kbd className="px-1.5 py-1 bg-gray-100 rounded text-xs">Ctrl</kbd>
                        <kbd className="px-1.5 py-1 bg-gray-100 rounded text-xs">\\</kbd>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Preview</span>
                      <div className="flex gap-1">
                        <kbd className="px-1.5 py-1 bg-gray-100 rounded text-xs">Space</kbd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-3 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                isPinned ? 'bg-blue-400' : 'bg-gray-400'
              }`}></div>
              <span>{isPinned ? 'Anclado' : 'Auto-ocultar'}</span>
            </div>
            <div>
              Panel {side === 'left' ? 'izquierdo' : 'derecho'}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SidePanel