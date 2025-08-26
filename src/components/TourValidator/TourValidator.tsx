import React, { useState, useEffect } from 'react'
import { useTourStore } from '../../stores/tourStore'
import { useProjectStore } from '../../stores/projectStore'
import { Tour, Scene } from '../../types'

interface ValidationError {
  id: string
  type: 'error' | 'warning' | 'info'
  category: 'project' | 'tour' | 'scene' | 'hotspot' | 'route'
  title: string
  description: string
  sceneId?: string
  hotspotId?: string
  routeId?: string
  autofix?: () => void
}

interface TourValidatorProps {
  isOpen: boolean
  onClose: () => void
}

const TourValidator: React.FC<TourValidatorProps> = ({ isOpen, onClose }) => {
  const { currentTour } = useTourStore()
  const { currentProject } = useProjectStore()
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [isValidating, setIsValidating] = useState(false)
  const [activeCategory, setActiveCategory] = useState<'all' | 'error' | 'warning' | 'info'>('all')

  useEffect(() => {
    if (isOpen && currentProject && currentTour) {
      validateTour()
    }
  }, [isOpen, currentProject, currentTour])

  const validateTour = async () => {
    if (!currentProject || !currentTour) return

    setIsValidating(true)
    const errors: ValidationError[] = []

    // Validar proyecto
    validateProject(currentProject, errors)

    // Validar tour
    validateTourStructure(currentTour, errors)

    // Validar escenas
    currentTour.scenes.forEach(scene => {
      validateScene(scene, errors)
    })

    // Validar navegación entre escenas
    validateNavigation(currentTour, errors)

    setValidationErrors(errors)
    setIsValidating(false)
  }

  const validateProject = (project: any, errors: ValidationError[]) => {
    // Proyecto sin nombre
    if (!project.name || project.name.trim() === '') {
      errors.push({
        id: 'project-no-name',
        type: 'error',
        category: 'project',
        title: 'Proyecto sin nombre',
        description: 'El proyecto debe tener un nombre descriptivo'
      })
    }

    // Proyecto sin ubicación
    if (!project.location || project.location.trim() === '') {
      errors.push({
        id: 'project-no-location',
        type: 'warning',
        category: 'project',
        title: 'Proyecto sin ubicación',
        description: 'Recomendamos especificar la ubicación del proyecto para mejor identificación'
      })
    }

    // Proyecto sin descripción
    if (!project.description || project.description.trim() === '') {
      errors.push({
        id: 'project-no-description',
        type: 'info',
        category: 'project',
        title: 'Proyecto sin descripción',
        description: 'Una descripción ayuda a entender el contenido del proyecto'
      })
    }

    // Verificar rango de dificultad
    if (project.difficulty.min === project.difficulty.max) {
      errors.push({
        id: 'project-single-difficulty',
        type: 'info',
        category: 'project',
        title: 'Rango de dificultad único',
        description: 'El proyecto tiene una sola dificultad. Considera expandir el rango si hay rutas variadas'
      })
    }
  }

  const validateTourStructure = (tour: Tour, errors: ValidationError[]) => {
    // Tour sin escenas
    if (tour.scenes.length === 0) {
      errors.push({
        id: 'tour-no-scenes',
        type: 'error',
        category: 'tour',
        title: 'Tour sin escenas',
        description: 'El tour debe tener al menos una escena para ser funcional'
      })
      return
    }

    // Tour con una sola escena
    if (tour.scenes.length === 1) {
      errors.push({
        id: 'tour-single-scene',
        type: 'warning',
        category: 'tour',
        title: 'Tour con una sola escena',
        description: 'Un tour con múltiples escenas ofrece mejor experiencia de navegación'
      })
    }

    // Tour sin descripción
    if (!tour.description || tour.description.trim() === '') {
      errors.push({
        id: 'tour-no-description',
        type: 'info',
        category: 'tour',
        title: 'Tour sin descripción',
        description: 'Una descripción ayuda a los usuarios a entender el propósito del tour'
      })
    }
  }

  const validateScene = (scene: Scene, errors: ValidationError[]) => {
    // Escena sin imagen panorámica
    if (!scene.panoramaUrl || scene.panoramaUrl.trim() === '') {
      errors.push({
        id: `scene-${scene.id}-no-image`,
        type: 'error',
        category: 'scene',
        title: `Escena "${scene.name}" sin imagen`,
        description: 'La escena necesita una imagen panorámica para ser visualizada',
        sceneId: scene.id
      })
    }

    // Escena sin hotspots
    if (scene.hotspots.length === 0) {
      errors.push({
        id: `scene-${scene.id}-no-hotspots`,
        type: 'warning',
        category: 'scene',
        title: `Escena "${scene.name}" sin hotspots`,
        description: 'Agregar hotspots mejora la interactividad de la escena',
        sceneId: scene.id
      })
    }

    // Escena sin rutas (específico para escalada)
    if (scene.routes.length === 0) {
      errors.push({
        id: `scene-${scene.id}-no-routes`,
        type: 'info',
        category: 'scene',
        title: `Escena "${scene.name}" sin rutas`,
        description: 'Considera agregar rutas de escalada si es relevante para esta escena',
        sceneId: scene.id
      })
    }

    // Validar hotspots
    scene.hotspots.forEach(hotspot => {
      // Hotspot sin título
      if (!hotspot.title || hotspot.title.trim() === '') {
        errors.push({
          id: `hotspot-${hotspot.id}-no-title`,
          type: 'warning',
          category: 'hotspot',
          title: 'Hotspot sin título',
          description: `Hotspot en escena "${scene.name}" sin título descriptivo`,
          sceneId: scene.id,
          hotspotId: hotspot.id
        })
      }

      // Hotspot de navegación sin destino válido
      if (hotspot.type === 'navigation' && hotspot.target) {
        const targetExists = currentTour?.scenes.some(s => s.id === hotspot.target)
        if (!targetExists) {
          errors.push({
            id: `hotspot-${hotspot.id}-invalid-target`,
            type: 'error',
            category: 'hotspot',
            title: 'Hotspot con destino inválido',
            description: `Hotspot "${hotspot.title}" apunta a una escena que no existe`,
            sceneId: scene.id,
            hotspotId: hotspot.id
          })
        }
      }

      // Hotspot de información sin contenido
      if (hotspot.type === 'info' && (!hotspot.content || hotspot.content.trim() === '')) {
        errors.push({
          id: `hotspot-${hotspot.id}-no-content`,
          type: 'warning',
          category: 'hotspot',
          title: 'Hotspot sin contenido',
          description: `Hotspot de información "${hotspot.title}" sin contenido`,
          sceneId: scene.id,
          hotspotId: hotspot.id
        })
      }
    })

    // Validar rutas
    scene.routes.forEach(route => {
      // Ruta sin nombre
      if (!route.name || route.name.trim() === '') {
        errors.push({
          id: `route-${route.id}-no-name`,
          type: 'warning',
          category: 'route',
          title: 'Ruta sin nombre',
          description: `Ruta en escena "${scene.name}" sin nombre identificativo`,
          sceneId: scene.id,
          routeId: route.id
        })
      }

      // Ruta sin dificultad
      if (!route.difficulty || route.difficulty.trim() === '') {
        errors.push({
          id: `route-${route.id}-no-difficulty`,
          type: 'error',
          category: 'route',
          title: 'Ruta sin dificultad',
          description: `Ruta "${route.name || 'Sin nombre'}" sin grado de dificultad`,
          sceneId: scene.id,
          routeId: route.id
        })
      }

      // Ruta con pocos puntos
      if (route.points.length < 2) {
        errors.push({
          id: `route-${route.id}-insufficient-points`,
          type: 'error',
          category: 'route',
          title: 'Ruta incompleta',
          description: `Ruta "${route.name || 'Sin nombre'}" necesita al menos 2 puntos`,
          sceneId: scene.id,
          routeId: route.id
        })
      }
    })
  }

  const validateNavigation = (tour: Tour, errors: ValidationError[]) => {
    const sceneConnections = new Map<string, Set<string>>()
    
    // Construir mapa de conexiones
    tour.scenes.forEach(scene => {
      sceneConnections.set(scene.id, new Set())
      scene.hotspots
        .filter(h => h.type === 'navigation' && h.target)
        .forEach(h => {
          sceneConnections.get(scene.id)?.add(h.target!)
        })
    })

    // Buscar escenas aisladas (sin conexiones de entrada)
    tour.scenes.forEach(scene => {
      const hasIncomingConnections = Array.from(sceneConnections.values())
        .some(connections => connections.has(scene.id))
      
      const isFirstScene = tour.scenes.indexOf(scene) === 0
      
      if (!hasIncomingConnections && !isFirstScene) {
        errors.push({
          id: `scene-${scene.id}-isolated`,
          type: 'warning',
          category: 'scene',
          title: `Escena "${scene.name}" aislada`,
          description: 'Esta escena no tiene hotspots de navegación que la conecten con otras escenas',
          sceneId: scene.id
        })
      }
    })

    // Verificar escenas sin conexiones de salida
    tour.scenes.forEach(scene => {
      const outgoingConnections = sceneConnections.get(scene.id)?.size || 0
      const isLastScene = tour.scenes.indexOf(scene) === tour.scenes.length - 1
      
      if (outgoingConnections === 0 && !isLastScene && tour.scenes.length > 1) {
        errors.push({
          id: `scene-${scene.id}-no-exit`,
          type: 'info',
          category: 'scene',
          title: `Escena "${scene.name}" sin salidas`,
          description: 'Esta escena no tiene hotspots de navegación hacia otras escenas',
          sceneId: scene.id
        })
      }
    })
  }

  if (!isOpen) return null

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'project': return '📁'
      case 'tour': return '🎬'
      case 'scene': return '🖼️'
      case 'hotspot': return '📍'
      case 'route': return '🧗'
      default: return '📋'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'error': return '❌'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
      default: return '📋'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-600 bg-red-50 border-red-200'
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const filteredErrors = activeCategory === 'all' 
    ? validationErrors 
    : validationErrors.filter(e => e.type === activeCategory)

  const errorCount = validationErrors.filter(e => e.type === 'error').length
  const warningCount = validationErrors.filter(e => e.type === 'warning').length
  const infoCount = validationErrors.filter(e => e.type === 'info').length

  const canPublish = errorCount === 0

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className={`p-6 text-white ${
          canPublish 
            ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
            : 'bg-gradient-to-r from-red-600 to-pink-600'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {canPublish ? '✅ Validación Completada' : '🔍 Validación del Tour'}
              </h2>
              <p className="text-sm opacity-90">
                {canPublish 
                  ? 'Tu tour está listo para ser publicado'
                  : 'Revisa y corrige los problemas encontrados'
                }
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Summary */}
          <div className="mt-4 flex gap-4">
            <div className={`px-3 py-1 rounded-full text-sm ${
              errorCount > 0 ? 'bg-red-500 bg-opacity-20' : 'bg-white bg-opacity-20'
            }`}>
              ❌ {errorCount} errores
            </div>
            <div className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
              ⚠️ {warningCount} advertencias
            </div>
            <div className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
              ℹ️ {infoCount} sugerencias
            </div>
          </div>
        </div>

        <div className="flex h-[calc(90vh-180px)]">
          {/* Sidebar - Categories */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Filtros</h3>
            <div className="space-y-1">
              <button
                onClick={() => setActiveCategory('all')}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-left ${
                  activeCategory === 'all'
                    ? 'bg-blue-100 text-blue-800'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span>Todos</span>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                  {validationErrors.length}
                </span>
              </button>
              
              <button
                onClick={() => setActiveCategory('error')}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-left ${
                  activeCategory === 'error'
                    ? 'bg-red-100 text-red-800'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span>❌ Errores</span>
                <span className="text-xs bg-red-200 px-2 py-1 rounded">
                  {errorCount}
                </span>
              </button>
              
              <button
                onClick={() => setActiveCategory('warning')}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-left ${
                  activeCategory === 'warning'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span>⚠️ Advertencias</span>
                <span className="text-xs bg-yellow-200 px-2 py-1 rounded">
                  {warningCount}
                </span>
              </button>
              
              <button
                onClick={() => setActiveCategory('info')}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-left ${
                  activeCategory === 'info'
                    ? 'bg-blue-100 text-blue-800'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span>ℹ️ Sugerencias</span>
                <span className="text-xs bg-blue-200 px-2 py-1 rounded">
                  {infoCount}
                </span>
              </button>
            </div>

            <div className="mt-6">
              <button
                onClick={validateTour}
                disabled={isValidating}
                className="w-full flex items-center justify-center gap-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isValidating ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>Validando...</span>
                  </>
                ) : (
                  <>
                    <span>🔄</span>
                    <span>Revalidar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {filteredErrors.length === 0 ? (
              <div className="text-center py-12">
                {activeCategory === 'all' ? (
                  <>
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-xl font-semibold text-green-800 mb-2">
                      ¡Excelente trabajo!
                    </h3>
                    <p className="text-green-600">
                      No se encontraron problemas en tu tour
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-6xl mb-4">✨</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Sin problemas de este tipo
                    </h3>
                    <p className="text-gray-600">
                      No hay {activeCategory === 'error' ? 'errores' : activeCategory === 'warning' ? 'advertencias' : 'sugerencias'} que mostrar
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredErrors.map(error => (
                  <div
                    key={error.id}
                    className={`border rounded-lg p-4 ${getTypeColor(error.type)}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 flex items-center gap-2">
                        <span className="text-lg">{getTypeIcon(error.type)}</span>
                        <span className="text-lg">{getCategoryIcon(error.category)}</span>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{error.title}</h4>
                        <p className="text-sm mb-2">{error.description}</p>
                        
                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2 py-1 bg-white bg-opacity-50 rounded">
                            {error.category}
                          </span>
                          {error.sceneId && (
                            <span className="px-2 py-1 bg-white bg-opacity-50 rounded">
                              Escena: {error.sceneId}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {error.autofix && (
                        <button
                          onClick={error.autofix}
                          className="px-3 py-1 bg-white bg-opacity-70 hover:bg-opacity-90 rounded text-sm transition-colors"
                        >
                          🔧 Arreglar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {canPublish ? (
                <span className="text-green-600 font-medium">
                  ✅ Tour listo para publicar
                </span>
              ) : (
                <span>
                  Corrige los errores para poder publicar el tour
                </span>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cerrar
              </button>
              
              <button
                disabled={!canPublish}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  canPublish
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                🚀 Publicar Tour
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TourValidator