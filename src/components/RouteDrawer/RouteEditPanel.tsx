import React, { useState } from 'react'
import { useRouteEditorStore } from '../../stores/routeEditorStore'
import { useTourStore, useCurrentScene } from '../../stores/tourStore'
import { Route } from '../../types'

const RouteEditPanel: React.FC = () => {
  const { 
    selectedRouteId, 
    selectedEditTool,
    showRoutePanel, 
    setShowRoutePanel,
    selectRoute
  } = useRouteEditorStore()
  
  const { updateScene } = useTourStore()
  const currentScene = useCurrentScene()
  
  const [editData, setEditData] = useState<Partial<Route>>({})
  const [hasChanges, setHasChanges] = useState(false)

  const selectedRoute = currentScene?.routes.find(r => r.id === selectedRouteId)

  React.useEffect(() => {
    if (selectedRoute) {
      setEditData({ ...selectedRoute })
      setHasChanges(false)
    }
  }, [selectedRoute])

  const handleInputChange = (field: keyof Route, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    if (selectedRoute && currentScene && editData) {
      const updatedRoutes = currentScene.routes.map(route =>
        route.id === selectedRoute.id ? { ...route, ...editData } : route
      )
      updateScene(currentScene.id, { routes: updatedRoutes })
      setHasChanges(false)
    }
  }

  const handleDelete = () => {
    if (selectedRoute && currentScene && 
        confirm(`¿Estás seguro de que quieres eliminar la ruta "${selectedRoute.name}"?`)) {
      const updatedRoutes = currentScene.routes.filter(route => route.id !== selectedRoute.id)
      updateScene(currentScene.id, { routes: updatedRoutes })
      selectRoute(null)
    }
  }

  const handleDuplicate = () => {
    if (selectedRoute && currentScene) {
      const newRoute: Route = {
        ...selectedRoute,
        id: `route-${Date.now()}`,
        name: `${selectedRoute.name} (Copia)`,
        // Offset slightly to make the duplicate visible
        points: selectedRoute.points.map(point => ({
          x: Math.min(95, point.x + 5),
          y: Math.min(95, point.y + 5)
        }))
      }
      
      const updatedRoutes = [...currentScene.routes, newRoute]
      updateScene(currentScene.id, { routes: updatedRoutes })
      selectRoute(newRoute.id)
    }
  }

  const handleClose = () => {
    if (hasChanges && !confirm('Tienes cambios sin guardar. ¿Quieres continuar?')) {
      return
    }
    setShowRoutePanel(false)
    selectRoute(null)
  }

  const difficultyGrades = ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10']
  const routeTypes = [
    { value: 'boulder', label: 'Boulder', icon: '🪨' },
    { value: 'route', label: 'Ruta', icon: '🧗' },
    { value: 'traverse', label: 'Travesía', icon: '↔️' }
  ]

  if (!showRoutePanel || !selectedRoute) return null

  return (
    <div className="absolute bottom-4 right-4 z-20">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-80 max-h-96 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">✏️</span>
              <div>
                <h3 className="font-semibold">Editar Ruta</h3>
                <p className="text-xs opacity-90">
                  {selectedRoute.points.length} puntos
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1 rounded hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
          {/* Basic info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la ruta
            </label>
            <input
              type="text"
              value={editData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Nombre descriptivo..."
            />
          </div>

          {/* Difficulty and type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grado
              </label>
              <select
                value={editData.difficulty || ''}
                onChange={(e) => handleInputChange('difficulty', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {difficultyGrades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={editData.type || ''}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {routeTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Style properties */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={editData.color || '#FF6B6B'}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={editData.color || '#FF6B6B'}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grosor: {editData.strokeWidth || 3}px
              </label>
              <input
                type="range"
                min="1"
                max="8"
                value={editData.strokeWidth || 3}
                onChange={(e) => handleInputChange('strokeWidth', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={editData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Describe los movimientos, agarres, técnica..."
            />
          </div>

          {/* Stats */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="font-medium text-gray-700 mb-2">Estadísticas</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Puntos:</span>
                <span className="ml-2 font-medium">{selectedRoute.points.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Tipo:</span>
                <span className="ml-2 font-medium">
                  {routeTypes.find(t => t.value === selectedRoute.type)?.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                hasChanges
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              💾 Guardar
            </button>
            <button
              onClick={handleDuplicate}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              title="Duplicar ruta"
            >
              📋
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              title="Eliminar ruta"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RouteEditPanel