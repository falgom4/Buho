import React, { useState } from 'react'
import { useTourStore } from '../../stores/tourStore'
import { useProjectStore } from '../../stores/projectStore'
import { Scene } from '../../types'
import SceneImageEditor from './SceneImageEditor'

interface SceneManagerProps {
  isOpen: boolean
  onClose: () => void
}

const SceneManager: React.FC<SceneManagerProps> = ({ isOpen, onClose }) => {
  const { currentTour, addScene, updateScene, deleteScene, reorderScenes } = useTourStore()
  const { currentProject } = useProjectStore()
  const [draggedScene, setDraggedScene] = useState<string | null>(null)
  const [isAddingScene, setIsAddingScene] = useState(false)
  const [newSceneName, setNewSceneName] = useState('')
  const [editingScene, setEditingScene] = useState<Scene | null>(null)

  if (!isOpen || !currentTour) return null

  const handleAddScene = () => {
    if (!newSceneName.trim()) return

    const newScene: Omit<Scene, 'id'> = {
      name: newSceneName.trim(),
      panoramaUrl: '',
      description: '',
      hotspots: [],
      routes: [],
      thumbnail: '',
      metadata: {
        capturedAt: new Date().toISOString(),
        location: currentProject?.location || '',
        weather: '',
        equipment: []
      }
    }

    addScene(newScene)
    setNewSceneName('')
    setIsAddingScene(false)
  }

  const handleDragStart = (e: React.DragEvent, sceneId: string) => {
    setDraggedScene(sceneId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (!draggedScene) return

    const draggedIndex = currentTour.scenes.findIndex(s => s.id === draggedScene)
    if (draggedIndex !== -1 && draggedIndex !== targetIndex) {
      reorderScenes(draggedIndex, targetIndex)
    }
    setDraggedScene(null)
  }

  const handleDeleteScene = (sceneId: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta escena? Esta acción no se puede deshacer.')) {
      deleteScene(sceneId)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Gestor de Escenas</h2>
              <p className="text-blue-100 text-sm">
                {currentTour.name} • {currentTour.scenes.length} escenas
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          {/* Add new scene */}
          <div className="mb-6">
            {isAddingScene ? (
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50">
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={newSceneName}
                    onChange={(e) => setNewSceneName(e.target.value)}
                    placeholder="Nombre de la nueva escena"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                    onKeyPress={(e) => e.key === 'Enter' && handleAddScene()}
                  />
                  <button
                    onClick={handleAddScene}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    disabled={!newSceneName.trim()}
                  >
                    Crear
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingScene(false)
                      setNewSceneName('')
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingScene(true)}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors group"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center text-2xl">
                    ➕
                  </div>
                  <p className="font-medium">Agregar nueva escena</p>
                  <p className="text-sm">Click para crear una nueva escena en el tour</p>
                </div>
              </button>
            )}
          </div>

          {/* Scenes list */}
          {currentTour.scenes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏔️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay escenas</h3>
              <p className="text-gray-600">Agrega la primera escena para comenzar tu tour virtual</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentTour.scenes.map((scene, index) => (
                <div
                  key={scene.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, scene.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`bg-white border-2 rounded-xl p-4 transition-all cursor-move ${
                    draggedScene === scene.id
                      ? 'border-blue-500 shadow-lg scale-105 opacity-50'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Drag handle */}
                    <div className="flex flex-col gap-1 text-gray-400 cursor-move">
                      <div className="w-1 h-1 bg-current rounded-full"></div>
                      <div className="w-1 h-1 bg-current rounded-full"></div>
                      <div className="w-1 h-1 bg-current rounded-full"></div>
                      <div className="w-1 h-1 bg-current rounded-full"></div>
                      <div className="w-1 h-1 bg-current rounded-full"></div>
                      <div className="w-1 h-1 bg-current rounded-full"></div>
                    </div>

                    {/* Order number */}
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>

                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      {scene.panoramaUrl ? (
                        <img
                          src={scene.thumbnail || scene.panoramaUrl}
                          alt={scene.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            target.nextElementSibling?.classList.remove('hidden')
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          📷
                        </div>
                      )}
                      <div className="hidden w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                        📷
                      </div>
                    </div>

                    {/* Scene info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {scene.name}
                        </h3>
                        {!scene.panoramaUrl && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            Sin imagen
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate mb-2">
                        {scene.description || 'Sin descripción'}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          🔗 {scene.hotspots.length} hotspots
                        </span>
                        <span className="flex items-center gap-1">
                          🧗 {scene.routes.length} rutas
                        </span>
                        {scene.metadata.location && (
                          <span className="flex items-center gap-1">
                            📍 {scene.metadata.location}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingScene(scene)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Editar imagen y detalles"
                      >
                        📷
                      </button>
                      <button
                        onClick={() => {
                          const newName = prompt('Nuevo nombre:', scene.name)
                          if (newName && newName.trim()) {
                            updateScene(scene.id, { name: newName.trim() })
                          }
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar nombre"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteScene(scene.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar escena"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Drop zone indicator */}
                  {draggedScene && draggedScene !== scene.id && (
                    <div
                      className="h-2 border-t-2 border-dashed border-blue-400 mt-2 opacity-50"
                      onDrop={(e) => handleDrop(e, index + 1)}
                      onDragOver={handleDragOver}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span>💡 Arrastra las escenas para reordenarlas</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Scene Image Editor Modal */}
      {editingScene && (
        <SceneImageEditor
          scene={editingScene}
          isOpen={!!editingScene}
          onClose={() => setEditingScene(null)}
        />
      )}
    </div>
  )
}

export default SceneManager