import React, { useState, useEffect } from 'react'
import { useEditorStore } from '../../stores/editorStore'
import { useTourStore, useCurrentScene } from '../../stores/tourStore'
import { Hotspot } from '../../types'

const HotspotPropertiesPanel: React.FC = () => {
  const { selectedHotspotId, setSelectedHotspot } = useEditorStore()
  const { scenes, currentSceneId, updateHotspot, removeHotspot } = useTourStore()
  const currentScene = useCurrentScene()

  const [formData, setFormData] = useState<Partial<Hotspot>>({})
  const [hasChanges, setHasChanges] = useState(false)

  const selectedHotspot = currentScene?.hotspots.find(h => h.id === selectedHotspotId)

  useEffect(() => {
    if (selectedHotspot) {
      setFormData({ ...selectedHotspot })
      setHasChanges(false)
    }
  }, [selectedHotspot])

  const handleInputChange = (field: keyof Hotspot, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    if (selectedHotspotId && currentSceneId && formData) {
      updateHotspot(currentSceneId, selectedHotspotId, formData)
      setHasChanges(false)
    }
  }

  const handleDelete = () => {
    if (selectedHotspotId && currentSceneId && 
        confirm('¿Estás seguro de que quieres eliminar este hotspot?')) {
      removeHotspot(currentSceneId, selectedHotspotId)
      setSelectedHotspot(null)
    }
  }

  const handleClose = () => {
    if (hasChanges && !confirm('Tienes cambios sin guardar. ¿Quieres continuar?')) {
      return
    }
    setSelectedHotspot(null)
  }

  const getSceneOptions = () => {
    return scenes
      .filter(scene => scene.id !== currentSceneId)
      .map(scene => ({ value: scene.id, label: scene.name }))
  }

  if (!selectedHotspot || !currentSceneId) return null

  return (
    <div className="absolute top-4 left-4 z-20 bg-white rounded-lg shadow-lg p-4 w-80 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Propiedades del Hotspot
        </h3>
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        {/* Tipo de hotspot (read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo
          </label>
          <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded text-sm text-gray-700">
            {formData.type === 'navigation' ? 'Navegación' :
             formData.type === 'info' ? 'Información' :
             formData.type === 'route' ? 'Ruta' : formData.type}
          </div>
        </div>

        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título
          </label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Título del hotspot"
          />
        </div>

        {/* Contenido/Descripción */}
        {formData.type !== 'navigation' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {formData.type === 'route' ? 'Descripción de la Ruta' : 'Contenido'}
            </label>
            <textarea
              value={formData.content || ''}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={formData.type === 'route' ? 
                'Describe la ruta, agarres, movimientos...' : 
                'Información adicional'}
            />
          </div>
        )}

        {/* Target para navegación */}
        {formData.type === 'navigation' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Escena destino
            </label>
            <select
              value={formData.target || ''}
              onChange={(e) => handleInputChange('target', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar escena...</option>
              {getSceneOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Campos específicos para rutas */}
        {formData.type === 'route' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grado de dificultad
              </label>
              <select
                value={formData.difficulty || ''}
                onChange={(e) => handleInputChange('difficulty', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar grado...</option>
                <option value="V0">V0</option>
                <option value="V1">V1</option>
                <option value="V2">V2</option>
                <option value="V3">V3</option>
                <option value="V4">V4</option>
                <option value="V5">V5</option>
                <option value="V6">V6</option>
                <option value="V7">V7</option>
                <option value="V8">V8</option>
                <option value="V9">V9</option>
                <option value="V10">V10</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la ruta
              </label>
              <input
                type="text"
                value={formData.grade || ''}
                onChange={(e) => handleInputChange('grade', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: La Travesía, El Techo..."
              />
            </div>
          </>
        )}

        {/* Botones de acción */}
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium ${
              hasChanges
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Guardar
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default HotspotPropertiesPanel