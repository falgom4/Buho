import React, { useState } from 'react'
import { useProjectStore, Project } from '../../stores/projectStore'
import { useTourStore } from '../../stores/tourStore'
import { useEditorStore } from '../../stores/editorStore'
import ProjectList from './ProjectList'
import SceneManager from '../SceneManager/SceneManager'
import QuickPresetSelector from '../PresetsManager/QuickPresetSelector'
import { Tour } from '../../types'

interface ProjectManagerProps {
  isOpen: boolean
  onClose: () => void
}

const ProjectManager: React.FC<ProjectManagerProps> = ({ isOpen, onClose }) => {
  const { currentProject, setCurrentProject, updateProject } = useProjectStore()
  const { setCurrentTour } = useTourStore()
  const { setMode } = useEditorStore()
  const [showSceneManager, setShowSceneManager] = useState(false)
  const [activeTab, setActiveTab] = useState<'projects' | 'scenes'>('projects')

  if (!isOpen) return null

  const handleProjectSelect = (project: Project) => {
    setCurrentProject(project)
    
    // Si el proyecto tiene tours, seleccionar el primero
    if (project.tours.length > 0) {
      setCurrentTour(project.tours[0])
      setActiveTab('scenes')
    } else {
      // Crear un tour por defecto
      const defaultTour: Tour = {
        id: `tour-${Date.now()}`,
        title: `Tour - ${project.name}`,
        description: project.description,
        scenes: [],
        created: new Date().toISOString(),
        version: '1.0'
      }
      
      // Actualizar proyecto con el nuevo tour
      const updatedProject = {
        ...project,
        tours: [defaultTour]
      }
      
      updateProject(project.id, updatedProject)
      setCurrentTour(defaultTour)
      setActiveTab('scenes')
    }
    
    setMode('preview')
  }

  const handleCloseManager = () => {
    onClose()
    setActiveTab('projects')
    setShowSceneManager(false)
  }

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">🏔️ Buho Editor</h1>
            
            {/* Navigation Tabs */}
            <div className="flex bg-white bg-opacity-20 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'projects'
                    ? 'bg-white text-blue-600'
                    : 'text-white hover:bg-white hover:bg-opacity-20'
                }`}
              >
                Proyectos
              </button>
              <button
                onClick={() => setActiveTab('scenes')}
                disabled={!currentProject}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'scenes'
                    ? 'bg-white text-blue-600'
                    : currentProject 
                      ? 'text-white hover:bg-white hover:bg-opacity-20'
                      : 'text-white opacity-50 cursor-not-allowed'
                }`}
              >
                Escenas
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentProject && (
              <div className="text-right">
                <div className="text-sm font-medium">{currentProject.name}</div>
                <div className="text-xs text-blue-100">
                  {currentProject.metadata.totalScenes} escenas • {currentProject.category}
                </div>
              </div>
            )}
            
            <button
              onClick={handleCloseManager}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="h-[calc(100vh-80px)]">
        {activeTab === 'projects' ? (
          <ProjectList onProjectSelect={handleProjectSelect} />
        ) : currentProject ? (
          <div className="h-full flex flex-col">
            {/* Scene management toolbar */}
            <div className="flex-shrink-0 bg-gray-50 border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Gestión de Escenas
                  </h2>
                  <p className="text-sm text-gray-600">
                    Proyecto: {currentProject.name}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowSceneManager(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    ⚙️ Gestor Avanzado
                  </button>
                  
                  <button
                    onClick={handleCloseManager}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    🎬 Ir al Editor
                  </button>
                </div>
              </div>
            </div>

            {/* Scene overview with sidebar */}
            <div className="flex-1 flex">
              {/* Sidebar with presets */}
              <div className="w-80 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
                <QuickPresetSelector
                  selectedCategory={currentProject.category}
                  onPresetSelect={(preset) => {
                    updateProject(currentProject.id, {
                      category: preset.category,
                      difficulty: preset.difficultyRange,
                      tags: [...new Set([...currentProject.tags, ...preset.tags])]
                    })
                  }}
                />
                
                {/* Project info */}
                <div className="mt-6 bg-white rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-3">Información del Proyecto</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Categoría:</span>
                      <span className="font-medium">{currentProject.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dificultad:</span>
                      <span className="font-medium">
                        {currentProject.difficulty.min}-{currentProject.difficulty.max}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ubicación:</span>
                      <span className="font-medium">{currentProject.location || 'Sin especificar'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Main content */}
              <div className="flex-1 p-6 overflow-y-auto">
                {currentProject.tours.length > 0 && currentProject.tours[0].scenes.length > 0 ? (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {currentProject.tours[0].scenes.map((scene, index) => (
                      <div
                        key={scene.id}
                        className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                      >
                        {/* Thumbnail */}
                        <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          {scene.panoramaUrl ? (
                            <img
                              src={scene.thumbnail || scene.panoramaUrl}
                              alt={scene.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center">
                              <div className="text-2xl mb-1">📷</div>
                              <div className="text-xs text-gray-500">Sin imagen</div>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <h3 className="font-semibold text-gray-900 truncate flex-1">
                              {scene.name}
                            </h3>
                          </div>

                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {scene.description || 'Sin descripción'}
                          </p>

                          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                            <span>🔗 {scene.hotspots.length} hotspots</span>
                            <span>🧗 {scene.routes.length} rutas</span>
                          </div>

                          {scene.metadata.location && (
                            <div className="text-xs text-gray-500 mb-3">
                              📍 {scene.metadata.location}
                            </div>
                          )}

                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setCurrentTour(currentProject.tours[0])
                                handleCloseManager()
                              }}
                              className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                            >
                              Editar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick stats */}
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">
                      Estadísticas del Proyecto
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {currentProject.tours[0].scenes.length}
                        </div>
                        <div className="text-sm text-blue-700">Escenas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {currentProject.tours[0].scenes.reduce((acc, scene) => acc + scene.hotspots.length, 0)}
                        </div>
                        <div className="text-sm text-green-700">Hotspots</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {currentProject.tours[0].scenes.reduce((acc, scene) => acc + scene.routes.length, 0)}
                        </div>
                        <div className="text-sm text-purple-700">Rutas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {currentProject.difficulty.min}-{currentProject.difficulty.max}
                        </div>
                        <div className="text-sm text-orange-700">Dificultad</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏔️</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Sin escenas
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Este proyecto no tiene escenas. Usa el gestor avanzado para agregar la primera escena.
                  </p>
                  <button
                    onClick={() => setShowSceneManager(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Agregar Primera Escena
                  </button>
                </div>
              )}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📂</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Selecciona un proyecto
              </h3>
              <p className="text-gray-600">
                Ve a la pestaña Proyectos para seleccionar o crear un proyecto
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Scene Manager Modal */}
      {showSceneManager && currentProject && (
        <SceneManager
          isOpen={showSceneManager}
          onClose={() => setShowSceneManager(false)}
        />
      )}
    </div>
  )
}

export default ProjectManager